import { Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({
    timestamps:{createdAt:true, updatedAt:false},
})

export class NfcTag extends Document{

    //TODO: add props

}
export const NfcTagSchema = SchemaFactory.createForClass(NfcTag);