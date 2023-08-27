import mongoose from "mongoose";
import { ItemInCart } from "../schemas/item-in-cart.interface";

export class AddToCartDto {
    userId:mongoose.Types.ObjectId
    itemInCart: ItemInCart
}