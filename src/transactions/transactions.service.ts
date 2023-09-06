import { BadRequestException, Inject, Logger, NotFoundException } from '@nestjs/common';
import { ITransaction, Transaction } from './schemas/transaction.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { GetQueryDto, GetQueryPaginationDto, LocalPaginationConfig, PaginationResponseDto } from 'src/global/global.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PAID_ITEM_SCHEMA_VERSION, TRANSACTION_SCHEMA_VERSION } from 'src/global/global.schema-versions';
import moment from 'moment';
import { GlobalService } from 'src/global/global.service';
import { User } from 'src/user/schemas/user.schema';
import { Coupon } from 'src/coupon/schemas/coupon.schema';
import { RecentTransaction } from 'src/user/schemas/recent-transactions.interface';
import { RecentItem } from 'src/user/schemas/recent-items.interface';
import { NfcTag } from 'src/nfc_tag/schemas/nfc-tag.schema';
import { IPaidItem, PaidItem } from 'src/paid-item/schemas/paid-item.schema';
import { CreditCard } from 'src/user/schemas/credit-card.schema';
import { ITransactionItem } from './dto/transaction-item.interface';
import { MailService } from 'src/mail/mail.service';
import { DayOfWeek, Month } from 'src/global/global.enum';
import { EmailItem, IStats, UserFullStats } from 'src/global/global.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
export interface Rest {
    amountToCharge: number;
    products: ITransactionItem[];
}
export class TransactionsService {
    private LOCAL_PAGINATION_CONFIG: LocalPaginationConfig = { sort: { '_id': -1 }, limit: 10 }
    private readonly logger: Logger = new Logger(TransactionsService.name)
    constructor(
        @InjectModel(Transaction.name)
        private transactionModel: Model<Transaction>,
        @InjectModel(User.name)
        private userModel: Model<User>,
        @InjectModel(Coupon.name)
        private couponModel: Model<Coupon>,
        @InjectModel(NfcTag.name)
        private nfcTagModel: Model<NfcTag>,
        @InjectModel(PaidItem.name)
        private paidItemModel: Model<PaidItem>,
        private globalService: GlobalService,
        private mailService: MailService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }
    //#region user Analytics
    async getWeeklyPurchases(id: mongoose.Types.ObjectId): Promise<IStats[]> {
        const today = new Date();
        const weekObject: IStats[] = [];

        // Calculate the start date (last Wednesday)
        const startDate = new Date(today);
        const dayOfWeek = today.getDay();
        startDate.setDate(today.getDate() - 7);
        // Initialize the weekObject with default values
        for (let i = 0; i < 7; i++) {
            const day = (dayOfWeek + 6 - i) % 7; // Calculate the day of the week (0 to 6)
            today.setDate(today.getDate() - 1);

            weekObject.push({
                label: DayOfWeek[day], // Assuming DayOfWeek is an enum
                value: 0,
                date: new Date(today), // Initialize date property
            });
        }

        const lastWeeklyPurchases = await this.transactionModel.find({
            userId: id,
            createdAt: { $gte: startDate, $lte: new Date() }, // Filter by date range
        });
        lastWeeklyPurchases.forEach((purchase) => {
            const purchaseDate = purchase.createdAt.getDate()
            const matchingDay = weekObject.find((day) => day.date.getDate() == purchaseDate)
            if (matchingDay) {
                matchingDay.value += purchase.amountToCharge
            }
        });

        return weekObject.reverse();
    }
    async getMonthlyPurchases(id: mongoose.Types.ObjectId): Promise<IStats[]> {
        const today = new Date();
        const monthObject: IStats[] = [];

        // Calculate the start date (12 months ago from today)
        const startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 11); // Subtract 11 months to go back 12 months
        startDate.setDate(1); // Set the day to the 1st day of the month
        // Initialize the monthObject with default values for each month
        for (let i = 0; i < 12; i++) {
            const year = startDate.getFullYear();
            const month = startDate.getMonth(); // Months are 0-based, so add 1
            monthObject.push({
                year: year,
                label: Month[month],
                value: 0,
            });
            // Move to the next month
            startDate.setMonth(startDate.getMonth() + 1);
        }
        startDate.setMonth(today.getMonth() - 11); // Subtract 11 months to go back 12 months
        const last12MonthsPurchases = await this.transactionModel.find({
            userId: id,
            createdAt: { $gte: startDate, $lte: today }, // Filter by date range
        });

        last12MonthsPurchases.forEach((purchase) => {
            const purchaseYear = purchase.createdAt.getFullYear();
            const purchaseMonth = purchase.createdAt.getMonth(); // Months are 0-based, so add 1
            // Find the corresponding month in the monthObject and update the sumAmount
            const matchingMonth = monthObject.find(
                (month) => month.year == purchaseYear && month.label == Month[purchaseMonth]
            );

            if (matchingMonth) {
                matchingMonth.value += purchase.amountToCharge;
            }
        });

        return monthObject;
    }
    async getYearlyPurchases(id: mongoose.Types.ObjectId): Promise<IStats[]> {
        const today = new Date();
        const yearlyObject: IStats[] = [];

        //Calculate the start date (7 years ago)
        const startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 6);

        //initialize the years object
        for (let i = 0; i < 7; i++) {
            const year = startDate.getFullYear() + i;
            yearlyObject.push({
                label: year.toString(),
                value: 0,
            });

            //get the transactions  for the year object
            const last7YearsPurchases = await this.transactionModel.find({
                userId: id,
                createdAt: { $gte: startDate, $lte: today }, // Filter by date range
            });

            last7YearsPurchases.forEach((purchase) => {
                const purchaseYear = purchase.createdAt.getFullYear();
                const matchingYear = yearlyObject.find((year) => year.label == purchaseYear.toString());
                if (matchingYear) {
                    matchingYear.value += purchase.amountToCharge;
                }
            })
        }
        return yearlyObject;
    }
    //#endregion
    async PaymentPipeline(dto: CreateTransactionDto): Promise<Transaction> {
        const session = await this.userModel.db.startSession();
        session.startTransaction();
        try {
            //#region the payment and transaction pipeline
            //* Step 1: Validation
            const { userId, cardId, couponId, ...rest } = dto
            //* Step 1.1: validate user and card
            // validate the user
            Logger.debug('userId: ' + userId)
            const user = await this.validateUser(userId);
            Logger.debug('Validated User: ' + user.fullName)
            // validate the card
            const card = await this.validateCard(user, cardId);
            Logger.debug('Validated Card: ' + card.cardType)

            if (couponId) {
                //* Step 1.2: validate coupon if coupon is used in the transaction
                // validate the coupon(if exists update amount used in the coupon and change the price accordingly)
                const coupon = await this.validateCoupon(couponId);

                //* Step 1.3: update coupon and transaction price
                dto = this.discountCouponFromPrice(coupon, dto);
                Logger.debug('Validated Coupon: ' + coupon.code)
                rest.amountToCharge = dto.amountToCharge;
            }

            //* Step 1.4: charge the credit card
            // charge the credit card
            await this.chargeCreditCard(card, dto);
            Logger.debug('Charged credit card')

            //* Step 2: Create Transaction

            // create the transaction object and save to the collection
            const { transactionDocument, transaction } = await this.createTransactionAndNewTransaction(card, rest, userId)
            Logger.debug('Created Transaction: ' + transactionDocument._id)

            //* Step 3: Update the user 
            //* Step 3.1: create the abstract transaction and recent items from transaction
            const { latestTransaction, latestItems }: { latestTransaction: RecentTransaction; latestItems: RecentItem[]; } = this.createAbstractObjectsForUserArrays(transactionDocument, transaction);

            //* Step 3.2: add to the user's latest transaction and latest items arrays
            await this.updateTheUser(user, latestTransaction, latestItems);
            Logger.debug('updated  user transaction list length:' + user.recentTransactions.length)

            //* Step 4: Update the paid items collection
            //add the items (nfc chip) to the paid items collection
            await this.updatePaidItemsCollection(transaction, user._id, transactionDocument);
            Logger.debug('updated paid collection item')

            //#endregion

            //send the order confirmation email after the transaction has been committed successfully
            await this.mailService.sendOrderConfirmationEmail(user.email, transaction.products, user.fullName, transaction.amountToCharge)
            Logger.debug('Sent order confirmation email')
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
    private async updatePaidItemsCollection(transaction: ITransaction, id: mongoose.Types.ObjectId, newTransaction: Transaction) {
        const paidItems: IPaidItem[] = transaction.products.map(product => {
            const paidItem: IPaidItem = {
                nfcTagCode: product.nfcTagCode,
                userId: id,
                itemId: product.itemId,
                transactionId: newTransaction._id,
                createdAt: new Date(),
                schemaVersion: PAID_ITEM_SCHEMA_VERSION,
            };
            Logger.debug(paidItem)

            return paidItem;
        });

        await this.paidItemModel.insertMany(paidItems);
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
            transactionId: newTransaction._id,
            amount: transaction.amountToCharge,
            formattedDate: transaction.formattedDate,
            cardType: transaction.cardType
        };
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
        Logger.debug('made it here')
        return { transactionDocument: transactionDocument, transaction }
    }
    private async chargeCreditCard(card: CreditCard, dto: CreateTransactionDto) {
        const isCharged = await this.globalService.chargeCreditCard(card, dto.amountToCharge);
        if (!isCharged)
            throw new BadRequestException(`Problem charging credit card: ${card._id}`);
    }

    private discountCouponFromPrice(coupon: Coupon, dto: CreateTransactionDto) {
        const discountPercentage = coupon.discountPercentage;
        const amountToCharge = dto.amountToCharge;
        dto.amountToCharge = amountToCharge - (amountToCharge * (discountPercentage / 100));
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
        const card = user.creditCards.filter(card => card._id.toString() == cardId.toString());
        if (!card)
            throw new NotFoundException(`card with the id ${cardId} was not found`);
        //TODO: Uncomment the validation of creditcards
        // if (!await this.globalService.validateCreditCart(card[0]))
        //     throw new BadRequestException(`card with the id ${cardId} is invalid`);
        return card[0];
    }

    private async validateUser(userId: mongoose.Types.ObjectId) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new NotFoundException(`user with the id ${userId} not found`);
        return user;
    }
    //#endregion
    async getManyPagination(dto: GetQueryPaginationDto<Transaction>): Promise<PaginationResponseDto<Transaction>> {
        const { query, projection,currentPage } = dto;
        const { limit, sort} = this.globalService.configPagination(dto, this.LOCAL_PAGINATION_CONFIG)
        const skipAmount = currentPage * limit
        const transactions = await this.transactionModel.find(query, projection).skip(skipAmount).limit(limit + 1).sort(sort);

        // Check for more records
        const isMore = transactions.length > limit;

        if(isMore) {
            transactions.pop()
        }
        const decryptedTransactions = this.decryptTransactions(transactions)
        const res:PaginationResponseDto<Transaction> = {
            list: decryptedTransactions,
            pageNumber: currentPage,
            isMore
        }
        return res;
    }
    async getMany(dto: GetQueryDto<Transaction>): Promise<Transaction[]> {
        const { query, projection } = dto;
        const transactions = await this.transactionModel.find(query, projection)
        return this.decryptTransactions(transactions)
    }
    async getOne(dto: GetQueryDto<Transaction>): Promise<Transaction> {
        const { query, projection } = dto
        const transaction = await this.transactionModel.findOne(query, projection);
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
    async getAllStats(id: Types.ObjectId): Promise<UserFullStats> {
        const cachedItem: UserFullStats = await this.cacheManager.get(`stats-${id.toString()}`)
        Logger.debug('cachedItem: ' + JSON.stringify(cachedItem))
         if(cachedItem) {
         Logger.debug('found cache item')
        return cachedItem;    
        }
        const weekly = await this.getWeeklyPurchases(id);
        const monthly = await this.getMonthlyPurchases(id);
        const yearly = await this.getYearlyPurchases(id);
        const stats = {
            weekly,
            monthly,
            yearly
        }
        await this.cacheManager.set(`stats-${id}`,stats,60)
        Logger.debug('not found cache item')
        return stats;
    }
}
