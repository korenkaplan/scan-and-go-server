import { Module } from '@nestjs/common';
import { SiteService } from './site.service';
import { SiteController } from './site.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from 'src/transactions/schemas/transaction.schema';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { PaidItem, PaidItemSchema } from 'src/paid-item/schemas/paid-item.schema';
import { Item, ItemSchema } from 'src/item/schemas/item.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:Transaction.name,schema:TransactionSchema},
    {name:User.name,schema:UserSchema},{name:PaidItem.name,schema:PaidItemSchema},{name:Item.name,schema:ItemSchema},])],
  providers: [SiteService],
  controllers: [SiteController]
})
export class SiteModule {}
