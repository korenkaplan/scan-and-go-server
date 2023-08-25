import mongoose from "mongoose";

export class DeleteCreditCardDto {
    userId: mongoose.Types.ObjectId
    cardId: mongoose.Types.ObjectId
}