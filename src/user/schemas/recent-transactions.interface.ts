import mongoose from "mongoose";
import { CardType } from "utils/enums/credit-cards.enum";

export interface RecentTransactions {
    transactionId: mongoose.Schema.Types.ObjectId
    amount: number
    date: Date
    cardType: CardType
}