import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { GlobalModule } from 'src/global/global.module';
import { UserModule } from 'src/user/user.module';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { Coupon, CouponSchema } from 'src/coupon/schemas/coupon.schema';
import { NfcTag, NfcTagSchema } from 'src/nfc_tag/schemas/nfc-tag.schema';
import { PaidItem, PaidItemSchema } from 'src/paid-item/schemas/paid-item.schema';

@Module({
  imports:[UserModule,GlobalModule,MongooseModule.forFeature([
    {name:Transaction.name,schema:TransactionSchema},
    {name:User.name,schema:UserSchema},
    {name:Coupon.name,schema:CouponSchema},
    {name:NfcTag.name,schema:NfcTagSchema},
    {name:PaidItem.name,schema:PaidItemSchema},
  ])],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports:[TransactionsService]
})
export class TransactionsModule {}
