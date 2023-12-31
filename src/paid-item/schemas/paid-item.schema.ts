import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Item } from "src/item/schemas/item.schema";

@Schema({
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'paidItems',

})
export class PaidItem extends Document {
    @Prop()
    tagsCodes:string[]

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Item' })
    itemId: Item

    @Prop()
    createdAt: Date

    @Prop()
    schemaVersion: number

    @Prop()
    tagsAmount: number

    @Prop()
    itemName: string

}
export interface IPaidItem {
    _id?: mongoose.Types.ObjectId
    tagsCodes: string[]
    itemId: mongoose.Types.ObjectId
    createdAt: Date,
    schemaVersion: number,
    tagsAmount: number,
    itemName: string,
}
export const PaidItemSchema = SchemaFactory.createForClass(PaidItem)

PaidItemSchema.index({ itemId: 1, tagsCodes: 1 })