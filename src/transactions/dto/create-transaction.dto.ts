import mongoose from "mongoose";

export class CreateTransactionDto {
    userId: mongoose.Types.ObjectId;
    cardNumber:string

    //TODO: Finish dto
}