import { Body, Controller, Get, Post, Query, Delete} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './schemas/transaction.schema';
import { GetQueryDto, GetQueryPaginationDto, PaginationResponseDto, PaginationResponseDtoAdmin } from 'src/global/global.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Types } from 'mongoose';
import {UserFullStats } from 'src/global/global.interface';
import { Public } from 'src/auth/decorators/public-guard.decorator';

@Controller('transactions')
export class TransactionsController {

  constructor(private transactionService: TransactionsService) { }
  @Public()
  @Get('/testEmailExcel')
  async sendTestEmailExcel(): Promise<void> {
    await this.transactionService.testSendEmail();
  }
  @Post('/getMany')
  async getTransactions(@Body() dto: GetQueryDto<Transaction>): Promise<Transaction[]> {
    return await this.transactionService.getMany(dto);
  }
  @Post('/getManyPagination')
  async getTransactionsPagination(@Body() dto: GetQueryPaginationDto<Transaction>): Promise<PaginationResponseDto<Transaction>> {
    return await this.transactionService.getManyPagination(dto);
  }
  @Get('/getOneById')
  async getTransaction(@Query('id') id: string): Promise<Transaction> {
    return await this.transactionService.getOneById(id);
  }
  @Post('/createTransaction')
  async createTransactions(@Body() dto: CreateTransactionDto): Promise<Transaction> {
    return await this.transactionService.PaymentPipeline(dto);
  }

  @Delete('deleteAll')
  async deleteAll(): Promise<number> {
    return await this.transactionService.deleteAll();
  }

  @Get('/allStats')
 // @UseInterceptors(CacheInterceptor)
  async getAllStats(@Query('id') id: Types.ObjectId): Promise<UserFullStats> {
    return await this.transactionService.getAllStats(id);
  }
@Public()
@Get('/transactionsAmount')
async getTransactionsAmount():Promise<number>{
  return await this.transactionService.getTransactionsAmount();
}
@Public()
@Post('/getManyPaginationAdmin')
async getManyPaginationAdmin(@Body() dto:GetQueryPaginationDto<Transaction>):Promise<PaginationResponseDtoAdmin<Transaction>>{
  return await this.transactionService.getManyPaginationAdmin(dto)
}
}