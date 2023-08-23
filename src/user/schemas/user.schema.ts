import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { CreditCard } from "./credit-card.schema";
import { ItemInCart } from "./item-in-cart.interface";
import { RecentItem } from "./recent-items.interface";
import { RecentTransactions } from "./recent-transactions.interface";
import { UserGender } from "../enums/gender-user.enum";
enum Role {
    USER = "user",
    ADMIN = "admin",
}
enum Gender {
    M= "male",
    F= "female"
}
@Schema({
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'users',
})

export class User extends Document {
    @Prop()
    fullName: string;

    @Prop()
    roles: Role[]

    @Prop({ unique: true })
    email: string;

    @Prop()
    creditCards: CreditCard[];

    @Prop()
    password: string;

    @Prop()
    cart: ItemInCart[]

    @Prop()
    gender: UserGender

    @Prop()
    birthDate: Date

    @Prop({ default: true })
    isActive: boolean

    @Prop({ default: 1 })
    schemaVersion: number

    @Prop()
    deviceToken: string

    @Prop()
    createdAt: Date

    @Prop({ default: 0 })
    transactionsAmount: number

    @Prop({ index: 1 }) // Create an index on lastActivity field, sorted in ascending order (oldest to newest)
    lastActivity: Date

    @Prop()
    recentItems: RecentItem[]

    @Prop()
    recentTransactions: RecentTransactions[]
}
export interface IUser {

    _id?: mongoose.Types.ObjectId;

    fullName: string;

    roles: Role[]

    email: string;

    creditCards: CreditCard[];

    password: string;

    cart: ItemInCart[]

    gender: UserGender

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