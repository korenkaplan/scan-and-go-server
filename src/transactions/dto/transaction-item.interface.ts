import mongoose from "mongoose";

export class ITransactionItem {
   itemId: mongoose.Types.ObjectId
   nfcId: mongoose.Types.ObjectId
   imageSource: string
   name: string
   price: number
}
