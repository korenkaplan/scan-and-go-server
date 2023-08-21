import { Prop } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Transaction } from "src/transactions/schemas/transaction.schema";
import { CardType } from "utils/enums/credit-cards.enum";

export class RecentTransactions {
    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'Transaction'})
    transactionId: Transaction

    @Prop()
    amount: number

    @Prop()
    date: Date

    @Prop()
    cardType: CardType
}