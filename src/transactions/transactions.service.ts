import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
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
    ) { }

    async PaymentPipeline(dto: CreateTransactionDto): Promise<void> {
        //#region
        //* Step 1: Validation
        const {userId, cardId, couponId, ...rest} = dto
        //* Step 1.1: validate user and card
        // validate the user
        const user = await this.userModel.findById(userId)
        if(!user)
            throw new NotFoundException(`user with the id ${userId} not found`)

        // validate the card
        const card = user.creditCards.find(card => card._id == cardId)
        if(!card)
            throw new NotFoundException(`card with the id ${cardId} was not found`)

        if(! await this.globalService.validateCreditCart(card))
            throw new BadRequestException(`card with the id ${cardId} is invalid`);

        //* Step 1.2: validate coupon if coupon is used in the transaction
        // validate the coupon(if exists update amount used in the coupon and change the price accordingly)
        const coupon = await this.couponModel.findById(couponId)
        if(!coupon)
            throw new BadRequestException(`coupon with the id ${couponId} wan't found`);
        if(!coupon.isActive)
            throw new BadRequestException(`coupon with the id ${couponId} is not active`);
        const currantDate = new Date();
         if(!(coupon.validFrom < currantDate && coupon.validUntil > currantDate))
         {
            coupon.isActive = false
            throw new BadRequestException(`coupon with the id ${couponId} date is invalid and now is not active`);
         }
         if(coupon.maxUsageCount <= coupon.currentUsageCount)
         {
            coupon.isActive = false
            throw new BadRequestException(`coupon with the id ${couponId} has reached max usages and now  is not active`);
         }
         //* Step 1.3: update coupon and transaction price
        coupon.currentUsageCount = coupon.currentUsageCount + 1
        const discountPercentage = coupon.discountPercentage;
        const amountToCharge = dto.amountToCharge
        dto.amountToCharge = amountToCharge - (amountToCharge * (discountPercentage / 100));

        //* Step 1.4: charge the credit card
         // charge the credit card
         const isCharged = await this.globalService.chargeCreditCard(card,amountToCharge);
         if(!isCharged)
            throw new BadRequestException(`Problem charging credit card: ${card._id}`);



        //* Step 2: Create Transaction
        // create the transaction object and save to the collection
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

        //* Step 3: Update the user 
        //* Step 3.1: create the abstract transaction and recent items from transaction
        const latestTransaction: RecentTransaction = {
            transactionId: newTransaction._id,
            amount: transaction.amountToCharge,
            formattedDate:transaction.formattedDate,
            cardType: transaction.cardType
        }
        const latestItems: RecentItem[] = transaction.products.map(product => {
            const recentItem: RecentItem = {
              itemId:product.itemId,
              imageSource:product.imageSource,
              name:product.name,  
            }
            return recentItem
        })

        //* Step 3.2: add to the user's latest transaction and latest items arrays
        user.recentTransactions.unshift(latestTransaction)
        user.recentTransactions.splice(20)
        user.recentItems.unshift(...latestItems)
        user.recentItems.splice(20)
        //* Step 3.3: update the user's cart and save user
        user.cart = []
        await user.save()
        //* Step 4: Update the paid items collection
        //add the items (nfc chip) to the paid items collection
        const paidItems: IPaidItem[] = transaction.products.map(product => {
            const paidItem: IPaidItem = {
                nfcTagId: product.nfcId,
                userId: user._id,
                itemId: product.itemId,
                transactionId: newTransaction._id,
                createdAt: new Date(),
                schemaVersion: PAID_ITEM_SCHEMA_VERSION,
            }
            return paidItem
        })

         await this.paidItemModel.insertMany(paidItems)
        //#endregion
    }   
    //TODO: decrypt the credit card details for all the get requests
    async getManyPagination(dto: GetQueryDto<Transaction>): Promise<Transaction[]> {
        const { query, projection } = dto;
        const { limit, sort, currentPage } = this.globalService.configPagination(dto, this.LOCAL_PAGINATION_CONFIG)
        const skipAmount = currentPage * limit
        const transactions = await this.transactionModel.find(query, projection).skip(skipAmount).limit(limit).sort(sort);
        return transactions
    }
    async getMany(dto: GetQueryDto<Transaction>): Promise<Transaction[]> {
        const { query, projection } = dto;
        const transactions = await this.transactionModel.find(query, projection)
        return transactions
    }
    async getOne(dto: GetQueryDto<Transaction>): Promise<Transaction> {
        const { query, projection } = dto

        return await this.transactionModel.findOne(query, projection);
    }

}
