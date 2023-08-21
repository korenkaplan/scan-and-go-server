import { Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps:{createdAt:true, updatedAt:false,},
    collection:'transactions'
})
export class Transaction {
    //TODO: Add Props
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);