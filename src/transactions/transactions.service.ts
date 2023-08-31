import { BadRequestException, NotFoundException, NotImplementedException } from '@nestjs/common';
import { ITransaction, Transaction } from './schemas/transaction.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { GetQueryDto, LocalPaginationConfig } from 'src/global/global.dto';
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
import {  DayOfWeek, Month } from 'src/global/global.enum';
import { DailyPurchases, EmailItem, MonthlyPurchases, YearlyPurchases } from 'src/global/global.interface';

export interface Rest {
    amountToCharge: number; 
    products:ITransactionItem[];
}
export class TransactionsService {
    private LOCAL_PAGINATION_CONFIG: LocalPaginationConfig = { sort: { '_id': -1 }, limit: 10, currentPage: 0 }
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
    ) { }

    //TODO: Check Analytics Functions
    async getWeeklyPurchases(id:mongoose.Types.ObjectId): Promise<DailyPurchases[]>{
        const lastWeeklyPurchases = await this.transactionModel.find({userId:id,createdAt:{$gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}}); // number of milliseconds in seven days
      const weekObject: DailyPurchases[] = [
        {
        day: DayOfWeek.Sun,
        amount:0
        },
        {
        day: DayOfWeek.Mon,
        amount:0
        },
        {
        day: DayOfWeek.Tue,
        amount:0
        },
        {
        day: DayOfWeek.Wed,
         amount:0
        },
        {
        day: DayOfWeek.Thu,
        amount:0
        },
        {
        day: DayOfWeek.Fri,
        amount:0
        },
        {
        day: DayOfWeek.Sat,
        amount:0
        },
      ]
      lastWeeklyPurchases.forEach((purchase)=>{
        const dayNumber:number = purchase.createdAt.getDay();
        weekObject[dayNumber].amount += 1
      })
      return weekObject;
    }
    async getMonthlyPurchases(id:mongoose.Types.ObjectId): Promise<MonthlyPurchases[]>{
        const now = new Date();
        const startDate = new Date(now.getFullYear(), 0, 1);
        const endDate = new Date(now.getFullYear() + 1, 0, 1);
        const lastYearPurchases  = await this.transactionModel.find({userId:id,createdAt:{$gte: startDate, $lt: endDate}});
        
        const monthsObjects: MonthlyPurchases[] = [
            {
                month: Month.Jan,
                amount:0
            },
            {
                month: Month.Feb,
                amount:0
            },
            {
                month: Month.Mar,
                amount:0
            },
            {
                month: Month.Apr,
                amount:0
            },
            {
                month: Month.May,
                amount:0
            },
            {
                month: Month.Jun,
                amount:0
            },
            {
                month: Month.Jul,
                amount:0
            },
            {
                month: Month.Aug,
                amount:0
            },
            {
                month: Month.Sep,
                amount:0
            },
            {
                month: Month.Oct,
                amount:0
            },
            {
                month: Month.Nov,
                amount:0
            },
            {
                month: Month.Dec,
                amount:0
            },
        ]
        lastYearPurchases.forEach((purchase)=>{
            const monthNumber:number = purchase.createdAt.getMonth();
            monthsObjects[monthNumber].amount += 1
        })
        return monthsObjects;
    }
    async getYearlyPurchases(id:mongoose.Types.ObjectId): Promise<YearlyPurchases[]>{
        const userTransaction = await this.transactionModel.find({userId:id})
        const yearlyPurchases: YearlyPurchases[]  = [];

        userTransaction.forEach((transaction)=> {
            const yearOfTransaction = transaction.createdAt.getFullYear();
            if(!yearlyPurchases[yearOfTransaction])
            {
                yearlyPurchases[yearOfTransaction] = {
                    year: yearOfTransaction,
                    amount:0
                }
            }
            else
            {
                yearlyPurchases[yearOfTransaction].amount += 1
            }

    })
        return yearlyPurchases;
    }
    async PaymentPipeline(dto: CreateTransactionDto): Promise<void> {
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

        if(couponId)
        {
         //* Step 1.2: validate coupon if coupon is used in the transaction
        // validate the coupon(if exists update amount used in the coupon and change the price accordingly)
        const coupon = await this.validateCoupon(couponId);

        //* Step 1.3: update coupon and transaction price
        dto = this.discountCouponFromPrice(coupon, dto);
        }

        //* Step 1.4: charge the credit card
        // charge the credit card
        await this.chargeCreditCard(card, dto);

        //* Step 2: Create Transaction
        
        // create the transaction object and save to the collection
        const {newTransaction, transaction} = await this.createTransactionAndNewTransaction(card, rest, userId) 

        //* Step 3: Update the user 
        //* Step 3.1: create the abstract transaction and recent items from transaction
        const { latestTransaction, latestItems }: { latestTransaction: RecentTransaction; latestItems: RecentItem[]; } = this.createAbstractObjectsForUserArrays(newTransaction, transaction);

        //* Step 3.2: add to the user's latest transaction and latest items arrays
        await this.updateTheUser(user, latestTransaction, latestItems);

        //* Step 4: Update the paid items collection
        //add the items (nfc chip) to the paid items collection
        await this.updatePaidItemsCollection(transaction, user._id, newTransaction);
        //#endregion
        //commit the transaction
        await session.commitTransaction();
        //send the order confirmation email after the transaction has been committed successfully
        await this.mailService.sendOrderConfirmationEmail(user.email,transaction.products,user.fullName)
        } catch (error) {
            await session.abortTransaction();
            throw error
        }
        finally{
            session.endSession();
        }
     
    }
    //#region Sub functions for payment Pipeline
    private async updatePaidItemsCollection(transaction: ITransaction, id:mongoose.Types.ObjectId, newTransaction: Transaction) {
        const paidItems: IPaidItem[] = transaction.products.map(product => {
            const paidItem: IPaidItem = {
                nfcTagId: product.nfcId,
                userId: id,
                itemId: product.itemId,
                transactionId: newTransaction._id,
                createdAt: new Date(),
                schemaVersion: PAID_ITEM_SCHEMA_VERSION,
            };
            return paidItem;
        });

        await this.paidItemModel.insertMany(paidItems);
    }

    private async updateTheUser(user: User, latestTransaction: RecentTransaction, latestItems: RecentItem[]) {
        user.recentTransactions.unshift(latestTransaction);
        user.recentTransactions.splice(20);
        user.recentItems.unshift(...latestItems);
        user.recentItems.splice(20);
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

    async createTransactionAndNewTransaction(card: CreditCard, rest:Rest,userId: mongoose.Types.ObjectId ) {
        const transaction: ITransaction = {
            userId,
            cardNumber: await this.globalService.encryptText(card.cardNumber),
            cardType: await this.globalService.encryptText(card.cardType),
            createdAt: new Date(),
            formattedDate: moment().format('DD-MM-YYYY'),
            schemaVersion: TRANSACTION_SCHEMA_VERSION,
            ...rest
        }
        const newTransaction = await this.transactionModel.create(transaction)
        return {newTransaction, transaction}
    }
    private async chargeCreditCard(card: CreditCard, dto: CreateTransactionDto) {
        const isCharged = await this.globalService.chargeCreditCard(card, dto.amountToCharge);
        if (!isCharged)
            throw new BadRequestException(`Problem charging credit card: ${card._id}`);
    }

    private discountCouponFromPrice(coupon: Coupon, dto: CreateTransactionDto) {
        coupon.currentUsageCount = coupon.currentUsageCount + 1;
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
        return coupon;
    }

    private async validateCard(user: User, cardId: mongoose.Types.ObjectId) {
        const card = user.creditCards.find(card => card._id == cardId);
        if (!card)
            throw new NotFoundException(`card with the id ${cardId} was not found`);

        if (!await this.globalService.validateCreditCart(card))
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
    async getManyPagination(dto: GetQueryDto<Transaction>): Promise<Transaction[]> {
        const { query, projection } = dto;
        const { limit, sort, currentPage } = this.globalService.configPagination(dto, this.LOCAL_PAGINATION_CONFIG)
        const skipAmount = currentPage * limit
        const transactions = await this.transactionModel.find(query, projection).skip(skipAmount).limit(limit).sort(sort);
        return this.decryptTransactions(transactions)
    }
    async getMany(dto: GetQueryDto<Transaction>): Promise<Transaction[]> {
        const { query, projection } = dto;
        const transactions = await this.transactionModel.find(query, projection)
        return this.decryptTransactions(transactions)
    }
    async getOne(dto: GetQueryDto<Transaction>): Promise<Transaction> {
        const { query, projection } = dto
        const transaction= await this.transactionModel.findOne(query, projection);
        return this.decryptTransaction(transaction)
    }
    //TODO: Check decryption functions
    private decryptTransactions(transactions: Transaction[]): Transaction[] {
     const decryptedTransactions =   transactions.map(  transaction => {
        return this.decryptTransaction(transaction)
     })
     return decryptedTransactions
    }
    private decryptTransaction(transaction: Transaction): Transaction {
        transaction.cardNumber =  this.globalService.decryptText(transaction.cardNumber)
        transaction.cardType =  this.globalService.decryptText(transaction.cardType)
        return transaction
    }
    async sendOrderConfirmationEmail(email:string,products:ITransactionItem[],name: string):Promise<string> 
    {
        const emailItems: EmailItem[] = products.map(product => {
            return {
                name: product.name,
                price: product.price,
                imageSource: product.imageSource
            }
        })
        await this.mailService.sendOrderConfirmationEmail(email, emailItems, name);
        return 'email sent successfully'
    }

}
