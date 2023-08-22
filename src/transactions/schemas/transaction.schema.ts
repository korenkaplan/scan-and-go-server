import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "src/user/schemas/user.schema";
import { ITransactionItem } from "./transaction-item.interface";

@Schema({
    timestamps:{createdAt:true, updatedAt:false,},
    collection:'transactions'
})
export class Transaction {
    
    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'User',index:1})
    userId:User

    @Prop()
    cardNumber:string
 
    @Prop()
    cardType:string

    @Prop()
    amount:number

    @Prop()
    products:ITransactionItem[]

    @Prop()
    schemaVersion: number

    @Prop()
    formattedDate:string

    @Prop()
    createdAt: Date


}
export interface ITransaction {
    _id:mongoose.Schema.Types.ObjectId
    userId:mongoose.Schema.Types.ObjectId
    cardNumber:string
    cardType:string
    amount:number
    products:ITransactionItem[]
    schemaVersion:number
    formattedDate:string
    createdAt:Date
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);