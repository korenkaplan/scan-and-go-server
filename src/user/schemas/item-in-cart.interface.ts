import mongoose from "mongoose";

export class ItemInCart {
    itemId: mongoose.Types.ObjectId
    nfcTagId: mongoose.Types.ObjectId
}