import { Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import * as CryptoJS from 'crypto-js'
import { GetQueryPaginationDto, LocalPaginationConfig } from './global.dto';
import { CreditCard } from 'src/user/schemas/credit-card.schema';
import { CardType, CardValidationRegex } from './global.enum';


@Injectable()
export class GlobalService {
    constructor() { }
    async hashPassword(password: string): Promise<string> {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword
    }
    encryptText(textToEncrypt: string): string {
        const { CRYPTO_KEY } = process.env
        return CryptoJS.AES.encrypt(textToEncrypt, CRYPTO_KEY).toString()
    }
    decryptText(ciphertext: string): string {
        const { CRYPTO_KEY } = process.env
        const bytes = CryptoJS.AES.decrypt(ciphertext, CRYPTO_KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);

        return originalText;
    }
    configPagination<T>(dto: GetQueryPaginationDto<T>, locals: LocalPaginationConfig): LocalPaginationConfig {
        const sort = dto?.sort || locals.sort;
        const limit = dto?.limit || locals.limit;
        const result: LocalPaginationConfig = { sort, limit }
        return result
    }
    validateCreditCart(card: CreditCard): boolean {
        const { cardType, cardNumber } = card
        switch (cardType) {
            case CardType.AMERICAN_EXPRESS: {
                return new RegExp(CardValidationRegex.AMERICAN_EXPRESS).test(cardNumber)
            }
            case CardType.VISA: {
                return new RegExp(CardValidationRegex.VISA).test(cardNumber)
            }
            case CardType.DISCOVER: {
                return new RegExp(CardValidationRegex.DISCOVER).test(cardNumber)
            }
            case CardType.MASTERCARD: {
                return new RegExp(CardValidationRegex.MASTERCARD).test(cardNumber)
            }
            default: {
                return false
            }

        }
    }
    async chargeCreditCard(card: CreditCard, amountToCharge: number): Promise<boolean> {
        //simulate credit card charging
        return await true;
    }
    decryptCreditCard(card: CreditCard): CreditCard {
        const decryptCreditCard: CreditCard = {
            cardNumber: this.decryptText(card.cardNumber),
            expirationDate: this.decryptText(card.expirationDate),
            cardholderName: this.decryptText(card.cardholderName),
            cvv: this.decryptText(card.cvv),
            cardType: this.decryptText(card.cardType),
            isDefault: card.isDefault,
            _id: card._id
        }
        return decryptCreditCard;
    }
}
