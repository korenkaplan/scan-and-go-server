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
import { MailModule } from 'src/mail/mail.module';
import { PaidItemModule } from 'src/paid-item/paid-item.module';

@Module({
  imports:[UserModule,GlobalModule,MailModule,MongooseModule.forFeature([
    {name:Transaction.name,schema:TransactionSchema},
    {name:User.name,schema:UserSchema},
    {name:Coupon.name,schema:CouponSchema},
    {name:NfcTag.name,schema:NfcTagSchema},
  ]),
PaidItemModule,
GlobalModule,
],
  providers: [TransactionsService,PaidItemModule],
  controllers: [TransactionsController],
  exports:[TransactionsService]
})
export class TransactionsModule {}
