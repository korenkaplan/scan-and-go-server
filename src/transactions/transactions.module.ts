import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';

@Module({
  //imports:[MongooseModule.forFeature([{name:Transaction.name,schema:TransactionSchema}])],
  // imports:[MongooseModule.forFeatureAsync([{name:Transaction.name,useFactory: () => {
  // const schema = TransactionSchema;
  // schema.loadClass(Transaction);
  // return schema
  // }}])],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports:[TransactionsService]
})
export class TransactionsModule {}
