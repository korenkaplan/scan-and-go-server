import { CardType } from "src/utils/enums/credit-cards.enum";
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class CreditCard {

    @Prop()
    cardNumber: string;

    @Prop()
    expirationDate: string;

    @Prop()
    cardholderName: string;

    @Prop()
    cvv: string;

    @Prop()
    cardType: CardType;
}

export const CreditCardSchema = SchemaFactory.createForClass(CreditCard);