import mongoose from "mongoose";

export class RemoveItemFromCartDto {
    userId:mongoose.Types.ObjectId;
    nfcTagCode: string
}