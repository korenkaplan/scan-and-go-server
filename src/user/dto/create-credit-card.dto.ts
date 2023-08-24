import mongoose from "mongoose";
import { CreditCard } from "../schemas/credit-card.schema";

export class CreateCreditCardDto {
    userId: mongoose.Schema.Types.ObjectId
    creditCard:CreditCard
}