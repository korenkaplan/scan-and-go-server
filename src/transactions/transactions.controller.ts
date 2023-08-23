import { Body, Controller, Get } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './schemas/transaction.schema';
import { GetQueryDto } from 'src/utils/global-dto/get-query.dto';

@Controller('transactions')
export class TransactionsController {

    constructor(private transactionService: TransactionsService) { }
    // @Get('/getAll')
    // async getUsers(@Body() dto: GetQueryDto<Transaction>): Promise<Transaction[]> {
    //     return await this.transactionService.getMany(dto);
    // }

    // @Get('/getOne')
    // async getTransactions(@Body() dto: GetQueryDto<Transaction>): Promise<Transaction[]> {
    //     return await this.transactionService.getMany(dto);
    // }

}
