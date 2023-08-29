import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, {Document} from "mongoose";
import { Item } from "src/item/schemas/item.schema";


@Schema({
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'nfcTags'
})

export class NfcTag extends Document {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Item' })
    itemId: Item

    @Prop()
    createdAt: Date

    @Prop({ default: 1 })
    schemaVersion: number
}

export interface INfcTag {
    _id?: mongoose.Schema.Types.ObjectId,
    itemId: mongoose.Types.ObjectId
    createdAt: Date,
    schemaVersion: number,
}
export const NfcTagSchema = SchemaFactory.createForClass(NfcTag);