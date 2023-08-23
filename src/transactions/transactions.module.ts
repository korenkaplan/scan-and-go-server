import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionSchema } from './schemas/transaction.schema';

@Module({
 // imports:[MongooseModule.forFeature([{name:'Transaction',schema:TransactionSchema}])],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports:[TransactionsService]
})
export class TransactionsModule {}
