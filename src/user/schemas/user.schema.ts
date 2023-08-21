import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Role } from "utils/enums/roles.enum";
import { CreditCard } from "./credit-card.schema";
import { ItemInCart } from "./item-in-cart.schema";
import { Gender } from "utils/enums/gender.enum";
import { RecentItem } from "./recent-items.schema";
import { RecentTransactions } from "./recent-transactions.schema";

@Schema({
    timestamps:{createdAt:true, updatedAt:false},
    collection:'users',
})

export class User extends Document {
    @Prop()
    fullName:string;

    @Prop()
    role: Role

    @Prop({unique:true})
    email: string;

    @Prop()
    creditCards: CreditCard[];

    @Prop()
    password: string;

    @Prop()
    cart: ItemInCart[]

    @Prop()
    gender:Gender

    @Prop()
    birthDate: Date

    @Prop()
    isActive: boolean

    @Prop()
    schemaVersion: number

    @Prop()
    deviceToken: string
    
    @Prop()
    createdAt: Date

    @Prop()
    transactionsAmount: number

    @Prop()
    lastActivity: Date

    @Prop()
    recentItems: RecentItem[]

    @Prop()
    recentTransactions: RecentTransactions[]
}   
export interface IUser  {

    _id?:mongoose.Types.ObjectId;

    fullName:string;

    role: Role

    email: string;

    creditCards: CreditCard[];

    password: string;

    cart: ItemInCart[]

    gender:Gender

    birthDate: Date

    isActive: boolean

    schemaVersion: number

    deviceToken: string
    
    createdAt: Date

    transactionsAmount: number

    lastActivity: Date

    recentItems: RecentItem[]

    recentTransactions: RecentTransactions[]
}   

export const UserSchema = SchemaFactory.createForClass(User)