import mongoose from "mongoose"

export class CreatePaidItemDto {
    nfcTagId: mongoose.Types.ObjectId
    transactionId: mongoose.Types.ObjectId
    itemId: mongoose.Types.ObjectId
    userId: mongoose.Types.ObjectId
}