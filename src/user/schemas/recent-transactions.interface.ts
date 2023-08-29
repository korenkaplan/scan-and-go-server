import mongoose from "mongoose";

export class RecentTransaction {
    transactionId: mongoose.Types.ObjectId
    amount: number
    formattedDate: string
    cardType: string
}