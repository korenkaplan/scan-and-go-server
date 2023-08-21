import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
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
    full_name:string;

    @Prop()
    role: Role

    @Prop({unique:true})
    email: string;

    @Prop()
    credit_cards: CreditCard[];

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

export const UserSchema = SchemaFactory.createForClass(User)