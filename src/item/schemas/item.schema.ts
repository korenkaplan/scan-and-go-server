import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Category, Color, Fabric, Season } from "src/global/global.enum";

enum Gender {
    M= "male",
    F= "female",
    U= "unisex"
}
@Schema({
    timestamps: { createdAt: true, updatedAt: false },
})

export class Item extends Document {

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
    gender: Gender

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
    gender: Gender;
    season: Season;
    colors: Color[]
    createdAt: Date
}
export const ItemSchema = SchemaFactory.createForClass(Item);