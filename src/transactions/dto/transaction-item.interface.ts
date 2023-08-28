import mongoose from "mongoose";

 export class ITransactionItem {
    item_id: mongoose.Schema.Types.ObjectId
    imageSource: string
    name:string
    price: number
 }
 