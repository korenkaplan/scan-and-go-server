import { BadRequestException, Inject, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { ITransaction, Transaction } from './schemas/transaction.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { GetQueryDto, GetQueryPaginationDto, LocalPaginationConfig, PaginationResponseDto } from 'src/global/global.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TRANSACTION_SCHEMA_VERSION } from 'src/global/global.schema-versions';
import moment from 'moment';
import { GlobalService } from 'src/global/global.service';
import { User } from 'src/user/schemas/user.schema';
import { Coupon } from 'src/coupon/schemas/coupon.schema';
import { RecentTransaction } from 'src/user/schemas/recent-transactions.interface';
import { RecentItem } from 'src/user/schemas/recent-items.interface';
import { NfcTag } from 'src/nfc_tag/schemas/nfc-tag.schema';
import { CreditCard } from 'src/user/schemas/credit-card.schema';
import { ITransactionItem } from './dto/transaction-item.interface';
import { MailService } from 'src/mail/mail.service';
import { DayOfWeek, Month } from 'src/global/global.enum';
import { EmailItem, IStats, UserFullStats } from 'src/global/global.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FilterUserTransactionDto } from './dto/Filter-user-transactions.dto';
import { PaidItemService } from 'src/paid-item/paid-item.service';
import { CreatePaidItemDto } from 'src/paid-item/dto/paid-item.dto';
export interface Rest {
    totalAmount: number;
    products: ITransactionItem[];
    couponDiscountAmount?: number
}
export class TransactionsService {
    private readonly Logger = new Logger();
    private LOCAL_PAGINATION_CONFIG: LocalPaginationConfig = { sort: { '_id': -1 }, limit: 10 }
    private NUMBER_OF_LAST_YEARS_FOR_YEARLY_STATS = 7
    private readonly logger: Logger = new Logger(TransactionsService.name)
    constructor(
        @InjectModel(Transaction.name)
        private transactionModel: Model<Transaction>,
        @InjectModel(User.name)
        private userModel: Model<User>,
        @InjectModel(Coupon.name)
        private couponModel: Model<Coupon>,
        @InjectModel(NfcTag.name)
        private globalService: GlobalService,
        private mailService: MailService,
        @Inject(forwardRef(() => PaidItemService))
        private paidItemService: PaidItemService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }
    //#region Analytics
    private initWeeklyObject(): IStats[] {
        const weekObject: IStats[] = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const clonedDate = new Date(today); // Clone the date
            clonedDate.setDate(today.getDate() - i); // Update the cloned date
            const day = clonedDate.getDay(); // Calculate the day of the week (0 to 6)

            weekObject.push({
                label: DayOfWeek[day], // Assuming DayOfWeek is an enum
                value: 0,
                date: clonedDate, // Use the cloned date
            });
        }

        return weekObject // Reverse the array to get the correct order
    }

    private initMonthlyObject(): IStats[] {
        const today = new Date();
        const monthObject: IStats[] = [];
        const monthlyStartDate = new Date(today);

        // Calculate starting month
        monthlyStartDate.setFullYear(today.getFullYear() - 1); // Go back one year
        monthlyStartDate.setMonth(today.getMonth() + 1); // Go to the month after the current month

        // Set the day to 1 for consistency
        monthlyStartDate.setDate(1);

        for (let i = 0; i < 12; i++) {
            const year = monthlyStartDate.getFullYear();
            const month = monthlyStartDate.getMonth(); // Months are 0-based, so add 1

            monthObject.push({
                year: year,
                label: Month[month],
                value: 0,
            });

            // Move to the next month
            monthlyStartDate.setMonth(monthlyStartDate.getMonth() + 1);
        }

        return monthObject;
    }

    private initYearlyObject(): IStats[] {
        const today = new Date();
        const yearlyObject: IStats[] = [];
        //get the last 7 years date
        const yearlyStartDate = new Date(today);
        yearlyStartDate.setFullYear(today.getFullYear() - 6);
        for (let i = 0; i < 7; i++) {
            const year = yearlyStartDate.getFullYear() + i;
            yearlyObject.push({
                label: year.toString(),
                value: 0,
            });

        }
        return yearlyObject;
    }
    private initWeeklyStartDate(): Date {
        const today = new Date();
        const weeklyStartDate = new Date(today);
        weeklyStartDate.setDate(today.getDate() - 7);
        return weeklyStartDate;
    }
    private initMonthlyStartDate(): Date {
        const today = new Date();
        const monthlyStartDate = new Date(today);
        monthlyStartDate.setDate(today.getMonth() - 11);
        monthlyStartDate.setDate(1)
        return monthlyStartDate;
    }
    private initYearlyStartDate(yearsBack: number): Date {
        const today = new Date();
        const yearlyStartDate = new Date(today);
        yearlyStartDate.setFullYear(today.getFullYear() - 1 - yearsBack);
        return yearlyStartDate;
    }
    private async getUserTransactions(id: mongoose.Types.ObjectId): Promise<Transaction[]> {
        const transactions = await this.transactionModel.find({ userId: id });

        if (!transactions) {
            throw new NotFoundException('No transactions found');
        }
        return transactions;
    }
    filterTheTransactionsToObjects(dto: FilterUserTransactionDto): UserFullStats {
        const { weekObject, monthObject, yearlyObject, weeklyStartDate, monthlyStartDate, yearlyStartDate, userTransactions } = dto;
        userTransactions.forEach((transaction) => {
            const transactionDate = transaction.createdAt;
            if (transactionDate > weeklyStartDate) //if the transaction ocurred in the last week
            {
                const transactionDate = transaction.createdAt.getDate()
                const matchingDay = weekObject.find((day) => day.date.getDate() == transactionDate)
                if (matchingDay) {
                    matchingDay.value += transaction.totalAmount
                }
            }

            if (transactionDate > monthlyStartDate)// if the transaction ocurred in the last year
            {
                const transactionYear = transaction.createdAt.getFullYear();
                const transactionMonth = transaction.createdAt.getMonth(); // Months are 0-based, so add 1
                // Find the corresponding month in the monthObject and update the sumAmount
                const matchingMonth = monthObject.find(
                    (month) => month.year == transactionYear && month.label == Month[transactionMonth]
                );
                if (matchingMonth) {
                    matchingMonth.value += transaction.totalAmount;
                }
            }
            if (transactionDate > yearlyStartDate) // if the transaction ocurred in the last 7 years
            {
                const transactionYear = transaction.createdAt.getFullYear();
                const matchingYear = yearlyObject.find((year) => year.label == transactionYear.toString());
                if (matchingYear) {
                    matchingYear.value += transaction.totalAmount;
                }
            }

        })
        const stats: UserFullStats = {
            weekly: weekObject.reverse(),
            monthly: monthObject,
            yearly: yearlyObject
        }
        return stats;
    }
    async createAnalytics(id: mongoose.Types.ObjectId): Promise<UserFullStats> {
        //#1 get the user transactions
        const userTransactions = await this.getUserTransactions(id);

        //2# create the start dates of the last week, last year and last x years
        const weeklyStartDate = this.initWeeklyStartDate();
        const monthlyStartDate = this.initMonthlyStartDate();
        const yearlyStartDate = this.initYearlyStartDate(this.NUMBER_OF_LAST_YEARS_FOR_YEARLY_STATS);

        // create the objects to holds the data (IStats)
        const weekObject: IStats[] = this.initWeeklyObject();
        const monthObject: IStats[] = this.initMonthlyObject();
        const yearlyObject: IStats[] = this.initYearlyObject();

        const dto: FilterUserTransactionDto = {
            weekObject,
            monthObject,
            yearlyObject,
            weeklyStartDate,
            monthlyStartDate,
            yearlyStartDate,
            userTransactions
        }
        //iterate through the user's transactions and check the created at timestamp and filter the transaction.
        return this.filterTheTransactionsToObjects(dto);
    }

    //#endregion

    async getAllStats(id: Types.ObjectId): Promise<UserFullStats> {
        const cachedItem: UserFullStats = await this.cacheManager.get(`stats-${id.toString()}`)
        if (cachedItem) {
            return cachedItem;
        }
        const stats = this.createAnalytics(id);
        await this.cacheManager.set(`stats-${id}`, stats, 60)

        return stats;
    }
    async PaymentPipeline(dto: CreateTransactionDto): Promise<Transaction> {


        const session = await this.userModel.db.startSession();
        session.startTransaction();
        try {
            //#region the payment and transaction pipeline
            //* Step 1: Validation
            const { userId, cardId, couponId, ...rest } = dto
            //* Step 1.1: validate user and card
            // validate the user
            const user = await this.validateUser(userId);

            // validate the card
            const card = await this.validateCard(user, cardId);


            if (couponId) {
                //* Step 1.2: validate coupon if coupon is used in the transaction
                // validate the coupon(if exists update amount used in the coupon and change the price accordingly)
                const coupon = await this.validateCoupon(couponId);

                //* Step 1.3: update coupon and transaction price
                dto = this.discountCouponFromPrice(coupon, dto);

                rest.couponDiscountAmount = dto.couponDiscountAmount;
                rest.totalAmount = dto.totalAmount;
            }

            //* Step 1.4: charge the credit card
            // charge the credit card
            //  await this.chargeCreditCard(card, dto);


            //* Step 2: Create Transaction

            // create the transaction object and save to the collection
            const { transactionDocument, transaction } = await this.createTransactionAndNewTransaction(card, rest, userId)


            //* Step 3: Update the user 
            //* Step 3.1: create the abstract transaction and recent items from transaction
            const { latestTransaction, latestItems }: { latestTransaction: RecentTransaction; latestItems: RecentItem[]; } = this.createAbstractObjectsForUserArrays(transactionDocument, transaction);

            //* Step 3.2: add to the user's latest transaction and latest items arrays
            await this.updateTheUser(user, latestTransaction, latestItems);


            //* Step 4: Update the paid items collection
            //add the items (nfc chip) to the paid items collection
            await this.updatePaidItemsCollection(transaction);


            //#endregion

            //send the order confirmation email after the transaction has been committed successfully
            await this.mailService.sendOrderConfirmationEmail(user.email, transaction.products, user.fullName, transaction.totalAmount)

            //commit the transaction
            await session.commitTransaction();
            return transactionDocument
        } catch (error) {
            await session.abortTransaction();
            throw error
        }
        finally {
            session.endSession();
        }

    }
    //#region Sub functions for payment Pipeline

    private async updatePaidItemsCollection(transaction: ITransaction) {
        const { products } = transaction;
        products.forEach(product => {
            const dto: CreatePaidItemDto = { nfcTagCode: product.nfcTagCode, itemId: product.itemId }
            this.paidItemService.create(dto);
        });

    }

    private async updateTheUser(user: User, latestTransaction: RecentTransaction, latestItems: RecentItem[]) {
        user.recentTransactions.unshift(latestTransaction);
        user.recentTransactions.splice(10);
        user.recentItems.unshift(...latestItems);
        user.recentItems.splice(10);
        user.transactionsAmount = user.transactionsAmount + 1;
        //* Step 3.3: update the user's cart and save user
        user.cart = [];
        user.markModified('cart');
        user.markModified('recentItems');
        user.markModified('recentTransactions');
        user.markModified('transactionsAmount');
        await user.save();
    }

    private createAbstractObjectsForUserArrays(newTransaction: Transaction, transaction: ITransaction) {
        const latestTransaction: RecentTransaction = {
            _id: newTransaction._id,
            totalAmount: transaction.totalAmount,
            formattedDate: transaction.formattedDate,
            cardType: transaction.cardType,
            cardNumber: transaction.cardNumber,
            ...(transaction.couponDiscountAmount && { couponDiscountAmount: transaction.couponDiscountAmount }),
        }
        const latestItems: RecentItem[] = transaction.products.map(product => {
            const recentItem: RecentItem = {
                itemId: product.itemId,
                imageSource: product.imageSource,
                name: product.name,
            };
            return recentItem;
        });
        return { latestTransaction, latestItems };
    }

    async createTransactionAndNewTransaction(card: CreditCard, rest: Rest, userId: mongoose.Types.ObjectId) {
        rest.totalAmount = Math.floor(rest.totalAmount)
        const transaction: ITransaction = {
            _id: new mongoose.Types.ObjectId(),
            userId,
            cardNumber: card.cardNumber,
            cardType: card.cardType,
            createdAt: new Date(),
            formattedDate: moment().format('DD-MM-YYYY'),
            schemaVersion: TRANSACTION_SCHEMA_VERSION,
            ...rest
        }


        const transactionDocument = await this.transactionModel.create(transaction)
        return { transactionDocument: transactionDocument, transaction }
    }
    private async chargeCreditCard(card: CreditCard, dto: CreateTransactionDto) {
        const isCharged = await this.globalService.chargeCreditCard(card, dto.totalAmount);
        if (!isCharged)
            throw new BadRequestException(`Problem charging credit card: ${card._id}`);
    }

    private discountCouponFromPrice(coupon: Coupon, dto: CreateTransactionDto) {
        const discountPercentage = coupon.discountPercentage;
        const amountToCharge = dto.totalAmount;
        const amountToDiscount = Math.floor(amountToCharge * (discountPercentage / 100));
        dto.totalAmount = amountToCharge - amountToDiscount;
        dto.couponDiscountAmount = amountToDiscount;
        return dto;
    }

    private async validateCoupon(couponId: mongoose.Types.ObjectId) {
        const coupon = await this.couponModel.findById(couponId);
        if (!coupon)
            throw new BadRequestException(`coupon with the id ${couponId} wan't found`);
        if (!coupon.isActive)
            throw new BadRequestException(`coupon with the id ${couponId} is not active`);
        const currantDate = new Date();
        if (!(coupon.validFrom < currantDate && coupon.validUntil > currantDate)) {
            coupon.isActive = false;
            throw new BadRequestException(`coupon with the id ${couponId} date is invalid and now is not active`);
        }
        if (coupon.maxUsageCount <= coupon.currentUsageCount) {
            coupon.isActive = false;
            throw new BadRequestException(`coupon with the id ${couponId} has reached max usages and now  is not active`);
        }
        coupon.currentUsageCount = coupon.currentUsageCount + 1;
        coupon.markModified('isActive');
        coupon.markModified('currentUsageCount');
        await coupon.save();
        return coupon;
    }

    private async validateCard(user: User, cardId: mongoose.Types.ObjectId) {
        const card = user.creditCards.find(card => card._id.toString() == cardId.toString())
        if (!card)
            throw new NotFoundException(`card with the id ${cardId} was not found`);
        const result = this.globalService.validateCreditCart(card);
        Logger.debug('validation result:' + result);
        
        if (!result)
            throw new BadRequestException(`card with the id ${cardId} is invalid`);

        return card;
    }

    private async validateUser(userId: mongoose.Types.ObjectId) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new NotFoundException(`user with the id ${userId} not found`);
        return user;
    }
    //#endregion
    async getManyPagination(dto: GetQueryPaginationDto<Transaction>): Promise<PaginationResponseDto<Transaction>> {
        // Extract relevant information from the input DTO
        const { query, projection, currentPage } = dto;

        // Configure pagination settings based on global service and local configuration
        const { limit, sort } = this.globalService.configPagination(dto, this.LOCAL_PAGINATION_CONFIG);
        const skipAmount = currentPage * limit;

        // Retrieve transactions from the database based on query, projection, pagination, and sorting
        const transactions = await this.transactionModel.find(query, projection).skip(skipAmount).limit(limit + 1).sort(sort);

        // Check if there are more records than the specified limit
        const isMore = transactions.length > limit;
        if (isMore) {
            transactions.pop(); // Remove extra record used for pagination check
        }

        // Decrypt the retrieved transactions for further processing
        const decryptedTransactions = this.decryptTransactions(transactions);

        // Prepare the response object with the decrypted transactions
        const res: PaginationResponseDto<Transaction> = {
            list: decryptedTransactions,
            pageNumber: currentPage,
            isMore
        }

        return res; // Return the paginated response
    }
    async getMany(dto: GetQueryDto<Transaction>): Promise<Transaction[]> {
        const { query, projection } = dto;
        const transactions = await this.transactionModel.find(query, projection)
        return this.decryptTransactions(transactions)
    }
    async getOneById(id: string): Promise<Transaction> {
        const objId = new Types.ObjectId(id)
        const transaction = await this.transactionModel.findById(objId);
        if (!transaction)
            throw new NotFoundException(`transaction with the id ${id} is not found`)

        return this.decryptTransaction(transaction)
    }
    private decryptTransactions(transactions: Transaction[]): Transaction[] {
        const decryptedTransactions = transactions.map(transaction => {
            return this.decryptTransaction(transaction)
        })
        return decryptedTransactions
    }
    private decryptTransaction(transaction: Transaction): Transaction {
        if (transaction.cardNumber)
            transaction.cardNumber = this.globalService.decryptText(transaction.cardNumber)
        if (transaction.cardType)
            transaction.cardType = this.globalService.decryptText(transaction.cardType)
        return transaction
    }
    async sendOrderConfirmationEmail(email: string, products: ITransactionItem[], name: string): Promise<string> {
        const emailItems: EmailItem[] = products.map(product => {
            return {
                name: product.name,
                price: product.price,
                imageSource: product.imageSource
            }
        })
        await this.mailService.sendOrderConfirmationEmail(email, emailItems, name, 0);
        return 'email sent successfully'
    }
    async deleteAll(): Promise<number> {
        const deleted = await this.transactionModel.deleteMany({});
        return deleted.deletedCount
    }

    //#region Send a report on a daily / weekly / monthly bases.
    @Cron(CronExpression.EVERY_DAY_AT_10PM)
    async sendDailyTransactionsRecap(): Promise<void> {
        const today = new Date();
        const startDate = new Date();
        const timePeriod = 'Daily'
        startDate.setDate(today.getDate() - 1);
        return this.mailService.sendTransactionRecap(startDate, today, timePeriod)
    }
    @Cron(CronExpression.EVERY_WEEK)
    async sendWeeklyTransactionsRecap(): Promise<void> {
        const today = new Date();
        const startDate = new Date();
        const timePeriod = 'Weekly'
        startDate.setDate(today.getDate() - 7);
        return this.mailService.sendTransactionRecap(startDate, today, timePeriod)
    }
    @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
    async sendMonthlyTransactionsRecap(): Promise<void> {
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1); // Start of last month
        const endDate = new Date(today.getFullYear(), today.getMonth(), 0); // End of last month
        const timePeriod = 'Monthly'
        return this.mailService.sendTransactionRecap(startDate, endDate, timePeriod);
    }
    async testSendEmail(): Promise<void> {
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1); // Start of last month
        const endDate = new Date(today.getFullYear(), today.getMonth(), 0); // End of last month
        const timePeriod = 'Monthly'
        return this.mailService.sendTransactionRecap(startDate, endDate, timePeriod);
    }
    //#endregion
}
