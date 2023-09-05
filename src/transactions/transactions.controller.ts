import { Body, Controller, Get, Post, Query, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './schemas/transaction.schema';
import { GetQueryDto } from 'src/global/global.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Types } from 'mongoose';
import { DailyPurchases, MonthlyPurchases } from 'src/global/global.interface';

@Controller('transactions')
export class TransactionsController {

    constructor(private transactionService: TransactionsService) { }
    @Get('/getMany')
    async getUsers(@Body() dto: GetQueryDto<Transaction>): Promise<Transaction[]> {
        return await this.transactionService.getMany(dto);
    }

    @Get('/getOne')
    async getTransactions(@Body() dto: GetQueryDto<Transaction>): Promise<Transaction> {
        return await this.transactionService.getOne(dto);
    }
    @Post('/createTransaction')
    async createTransactions(@Body() dto: CreateTransactionDto): Promise<Transaction> {
        return await this.transactionService.PaymentPipeline(dto);
    }
    @Post('/createTransactionTest')
    async testCreateTransactions(@Query('id') id: string): Promise<Transaction> {
        return await this.transactionService.TestPaymentPipeline(id);
    }

    @Delete('deleteAll')
  async deleteAll(): Promise<number>{
    return await this.transactionService.deleteAll();
  }
    @Get('/lastWeekTransactions')
    async getTransactionsWeek(@Query('id') id: Types.ObjectId): Promise<DailyPurchases[]> {
     return await this.transactionService.getWeeklyPurchases(id)   
    }
    @Get('/lastYearTransactions')
    async getTransactionsMonthly(@Query('id') id: Types.ObjectId): Promise<MonthlyPurchases[]> {
     return await this.transactionService.getMonthlyPurchases(id)   
    }
}