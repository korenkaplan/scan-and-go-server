import { Prop,Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Item } from "src/item/schemas/item.schema";


@Schema({
    timestamps:{createdAt:true, updatedAt:false},
    collection:'nfcTags'
})

export class NfcTag extends Document{

    @Prop({required: true, unique:true})
    code: string

    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'Item'})
    itemId: Item

    @Prop()
    createdAt: Date

    @Prop({default:1})
    schemaVersion: number
}

export interface INfcTag {
_id:mongoose.Schema.Types.ObjectId,
code:string;
itemId: mongoose.Schema.Types.ObjectId
createdAt: Date,
schemaVersion: number,
}
export const NfcTagSchema = SchemaFactory.createForClass(NfcTag);