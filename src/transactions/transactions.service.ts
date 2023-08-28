import { Injectable } from '@nestjs/common';
import { Transaction } from './schemas/transaction.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetQueryDto } from 'src/global/global.dto';

@Injectable()
export class TransactionsService {
    //TODO: Continue with transaction service
    constructor(@InjectModel(Transaction.name)
    private transactionModel: Model<Transaction>) { }
    async getMany(dto: GetQueryDto<Transaction>): Promise<Transaction[]> {
        const { query, projection } = dto

        const users = await this.transactionModel.find(query, projection);
        return users
    }
    async getOne(dto: GetQueryDto<Transaction>): Promise<Transaction> {
        const { query, projection } = dto

        return await this.transactionModel.findOne(query, projection);
    }
}
