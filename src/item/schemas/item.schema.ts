import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Category, ClothingGender, Color, Fabric, Season } from "src/global/global.enum";
@Schema({
    timestamps: { createdAt: true, updatedAt: false },
})

export class Item {

    @Prop()
    _id?: mongoose.Types.ObjectId;

    @Prop({ unique: true })
    name: string;

    @Prop()
    category: Category

    @Prop()
    price: number

    @Prop()
    imageSource: string

    @Prop()
    fabric: Fabric

    @Prop()
    gender: ClothingGender

    @Prop()
    season: Season

    @Prop()
    colors: Color[]

    @Prop()
    createdAt: Date
}
export class IItem {
    _id?: mongoose.Types.ObjectId;
    name: string;
    category: Category;
    price: number;
    imageSource: string;
    fabric: Fabric;
    gender: ClothingGender;
    season: Season;
    colors: Color[]
    createdAt: Date
}
export const ItemSchema = SchemaFactory.createForClass(Item);