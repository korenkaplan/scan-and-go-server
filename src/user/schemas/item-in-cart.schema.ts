import { Prop } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Item } from "src/item/schemas/item.schema";
import { NfcTag } from "src/nfc_tag/schemas/nfc-tag.schema";

export class ItemInCart {

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Item'})
    itemId: Item

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'NfcTag'})
    tagId: NfcTag
}