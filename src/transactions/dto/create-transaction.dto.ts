import mongoose from "mongoose";
import { ITransactionItem } from "./transaction-item.interface";

export class CreateTransactionDto {
    userId: mongoose.Types.ObjectId;
    cardId: mongoose.Types.ObjectId;
    couponId?: mongoose.Types.ObjectId;
    amountToCharge: number
    products: ITransactionItem[]
}