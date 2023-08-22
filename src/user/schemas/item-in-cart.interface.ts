import mongoose from "mongoose";

export interface ItemInCart {
    itemId: mongoose.Schema.Types.ObjectId
    tagId:  mongoose.Schema.Types.ObjectId
}