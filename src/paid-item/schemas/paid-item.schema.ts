import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Item } from "src/item/schemas/item.schema";

@Schema({
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'paidItems',

})
//TODO: Create a yearly paid items collection.
export class PaidItem extends Document {
    @Prop()
    tagsCodes: string[]

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Item' })
    itemId: Item

    @Prop()
    createdAt: Date

    @Prop()
    schemaVersion: number

    @Prop()
    tagsAmount: number

    @Prop()
    maxTagsAmount: number

}
export interface IPaidItem {
    _id?: mongoose.Types.ObjectId
    tagsCodes: string[]
    itemId: mongoose.Types.ObjectId
    createdAt: Date,
    schemaVersion: number,
    tagsAmount: number,
    maxTagsAmount: number,
}
export const PaidItemSchema = SchemaFactory.createForClass(PaidItem)

//TODO: Check index is created successfully.
PaidItemSchema.index({ itemId: 1, tagsCodes: 1 })