import { Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({
    timestamps:{createdAt:true, updatedAt:false},
})

export class Item extends Document{

    //TODO: add props

}
export const ItemSchema = SchemaFactory.createForClass(Item);