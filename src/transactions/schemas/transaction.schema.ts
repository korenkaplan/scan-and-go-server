import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/user/schemas/user.schema";
import { ITransactionItem } from "../dto/transaction-item.interface";



export type TransactionDocument = HydratedDocument<Transaction>

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Transaction {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: 1 })
    userId: User
    @Prop()
    _id?: mongoose.Types.ObjectId
    @Prop()
    cardNumber: string

    @Prop()
    cardType: string

    @Prop()
    totalAmount: number

    @Prop()
    products: ITransactionItem[]

    @Prop()
    schemaVersion: number

    @Prop()
    formattedDate: string

    @Prop()
    createdAt: Date
    
    @Prop()
    couponDiscountAmount?: number
}
export interface ITransaction {
    _id?: mongoose.Types.ObjectId
    userId: mongoose.Types.ObjectId
    cardNumber: string
    cardType: string
    totalAmount: number
    products: ITransactionItem[]
    schemaVersion: number
    formattedDate: string
    createdAt: Date
    couponDiscountAmount?: number

}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);