import mongoose from "mongoose";
import { CardType } from "../user.enum";

export interface RecentTransactions {
    transactionId: mongoose.Schema.Types.ObjectId
    amount: number
    date: Date
    cardType: CardType
}