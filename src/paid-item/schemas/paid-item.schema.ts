import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, {Document} from "mongoose";
import { Item } from "src/item/schemas/item.schema";
import { Transaction } from "src/transactions/schemas/transaction.schema";
import { User } from "src/user/schemas/user.schema";

@Schema({
    timestamps: {createdAt:true, updatedAt:false},
    collection:'paidItems'
})
export class PaidItem extends Document {
    @Prop({unique: true})
    nfcTagId:string

    @Prop({type: mongoose.Schema.Types.ObjectId,ref:'Item'})
    itemId: Item
    
    @Prop({type: mongoose.Schema.Types.ObjectId,ref:'Transaction',unique:true})
    transactionId: Transaction

    @Prop({type: mongoose.Schema.Types.ObjectId,ref:User.name})
    userId:User

    @Prop()
    createdAt:Date

    @Prop()
    schemaVersion:number
}

export interface IPaidItem {
    _id?:mongoose.Types.ObjectId
    nfcTagId:mongoose.Types.ObjectId
    transactionId:mongoose.Types.ObjectId
    itemId: mongoose.Types.ObjectId
    userId: mongoose.Types.ObjectId
    createdAt: Date,
    schemaVersion:number
}
export const PaidItemSchema = SchemaFactory.createForClass(PaidItem)