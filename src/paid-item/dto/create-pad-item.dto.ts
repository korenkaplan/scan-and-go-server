import mongoose from "mongoose"

export class CreatePaidItemDto {
    nfcTagCode:string
    transactionId: mongoose.Types.ObjectId
    itemId: mongoose.Types.ObjectId
    userId: mongoose.Types.ObjectId
}