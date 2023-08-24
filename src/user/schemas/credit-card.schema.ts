import mongoose from 'mongoose';

export class CreditCard {
    _id: mongoose.Types.ObjectId;
    cardNumber: string;
    expirationDate: string;
    cardholderName: string;
    cvv: string;
    cardType: string;
    isDefault: boolean;
}