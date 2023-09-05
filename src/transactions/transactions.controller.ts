import { Body, Controller, Get, Post, Query, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './schemas/transaction.schema';
import { GetQueryDto } from 'src/global/global.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Types } from 'mongoose';
import { DailyPurchases, MonthlyPurchases, YearlyPurchases } from 'src/global/global.interface';

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

    @Delete('deleteAll')
  async deleteAll(): Promise<number>{
    return await this.transactionService.deleteAll();
  }
    @Get('/dailyPurchases')
    async getTransactionsWeek(@Query('id') id: Types.ObjectId): Promise<DailyPurchases[]> {
     return await this.transactionService.getWeeklyPurchases(id)   
    }
    @Get('/monthlyPurchases')
    async getTransactionsMonthly(@Query('id') id: Types.ObjectId): Promise<MonthlyPurchases[]> {
     return await this.transactionService.getMonthlyPurchases(id)   
    }
    @Get('/yearlyPurchases')
    async getTransactionsYearly(@Query('id') id: Types.ObjectId): Promise<YearlyPurchases[]> {
     return await this.transactionService.getYearlyPurchases(id)   
    }
}