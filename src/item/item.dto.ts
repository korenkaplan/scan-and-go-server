import mongoose from "mongoose";

export class ItemForNfcAddition {
    itemId: mongoose.Types.ObjectId;
    imageSource:string;
    name:string;
}