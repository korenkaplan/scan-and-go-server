import mongoose from "mongoose";
import { ItemInCart } from "../schemas/item-in-cart.interface";

export class RemoveItemFromCartDto {
    userId:mongoose.Types.ObjectId;
    itemInCart:ItemInCart
}