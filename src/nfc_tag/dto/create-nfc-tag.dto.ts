import mongoose from "mongoose";
export class CreateNfcTagDto {
    itemId:mongoose.Types.ObjectId
    tagId:string
}