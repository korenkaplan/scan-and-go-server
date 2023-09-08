import mongoose from "mongoose";

export class RecentTransaction {
    _id: mongoose.Types.ObjectId
    totalAmount: number
    formattedDate: string
    cardType: string
    cardNumber: string
    couponDiscountAmount?: number
}