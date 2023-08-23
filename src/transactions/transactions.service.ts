import { Injectable } from '@nestjs/common';
import { Transaction } from './schemas/transaction.schema';
import { InjectModel } from '@nestjs/mongoose';
import { GetQueryDto } from 'utils/global-dto/get-query.dto';
import  { Model } from 'mongoose';

@Injectable()
export class TransactionsService {
    // constructor( @InjectModel(Transaction.name)
    //  private transactionModel:Model<Transaction>)
    //  {}
    // async getMany(dto: GetQueryDto<Transaction>): Promise<Transaction[]> {
    //     const { query, projection } = dto

    //     const users = await this.transactionModel.find(query, projection);
    //     return users
    // }
    // async getOne(dto: GetQueryDto<Transaction>): Promise<Transaction> {
    //     const { query, projection } = dto

    //     return await this.transactionModel.findOne(query, projection);
    // }
}
