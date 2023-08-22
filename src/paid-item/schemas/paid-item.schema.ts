import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Item } from "src/item/schemas/item.schema";
import { User } from "src/user/schemas/user.schema";

@Schema({
    timestamps: {createdAt:true, updatedAt:false},
    collection:'paidItems'
})
export class PaidItem extends Document {
    @Prop()
    tag_code:string

    @Prop({type: mongoose.Schema.Types.ObjectId,ref:'Item'})
    itemId: Item

    @Prop({type: mongoose.Schema.Types.ObjectId,ref:'User'})
    userId:User

    @Prop()
    createdAt:Date

    @Prop()
    schemaVersion:number
}

export interface IPaidItem {
    _id:mongoose.Schema.Types.ObjectId
    tagCode:string
    itemId: mongoose.Schema.Types.ObjectId
    userId: mongoose.Schema.Types.ObjectId
    createdAt: Date,
    schemaVersion:number
}
export const PaidItemSchema = SchemaFactory.createForClass(PaidItem)