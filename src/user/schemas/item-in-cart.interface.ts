import mongoose from "mongoose";

export class ItemInCart {
    itemId: mongoose.Types.ObjectId
    nfcTagCode: string
}