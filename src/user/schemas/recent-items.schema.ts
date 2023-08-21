import { Prop } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Item } from "src/item/schemas/item.schema";

export class RecentItem {
    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'Item'})
    itemId: Item

    @Prop()
    imageSource: string

    @Prop()
    name: string
}