import mongoose from "mongoose";
import { CardType } from "src/global/global.enum";

export interface RecentTransactions {
    transactionId: mongoose.Schema.Types.ObjectId
    amount: number
    date: Date
    cardType: CardType
}