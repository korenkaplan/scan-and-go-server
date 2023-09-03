import mongoose from "mongoose";

export class ITransactionItem {
   itemId: mongoose.Types.ObjectId
   nfcTagCode: string
   imageSource: string
   name: string
   price: number
}
