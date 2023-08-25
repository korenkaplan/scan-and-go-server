import mongoose from "mongoose";

export class ChangeDefaultCardDto {
    userId:mongoose.Types.ObjectId
    cardId:mongoose.Types.ObjectId
}