import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import * as CryptoJS from 'crypto-js'
import { GetQueryDto, LocalPaginationConfig } from './global.dto';
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
    configPagination<T>(dto: GetQueryDto<T>, locals: LocalPaginationConfig): LocalPaginationConfig {
        const sort = dto?.sort || locals.sort;
        const limit = dto?.limit || locals.limit;
        const currentPage = dto?.currentPage || locals.currentPage;
        const result: LocalPaginationConfig = { sort, limit, currentPage }
        return result
    }
    //TODO: Test validateCreditCart()
     validateCreditCart(card:CreditCard): boolean {
      switch (card.cardType) {
        case CardType.AMERICAN_EXPRESS:{
            return new RegExp(CardValidationRegex.AMERICAN_EXPRESS).test(card.cardNumber)
        }
        case CardType.VISA:{
            return new RegExp(CardValidationRegex.VISA).test(card.cardNumber)
        }
        case CardType.DISCOVER:{
            return new RegExp(CardValidationRegex.DISCOVER).test(card.cardNumber)
        }
        case CardType.MASTERCARD:{
            return new RegExp(CardValidationRegex.MASTERCARD).test(card.cardNumber)
        }
        default:{
            return false
        }
      
      }
    }
    async chargeCreditCard(card:CreditCard,amountToCharge: number): Promise<boolean> {
       //simulate credit card charging
       console.log(`Card charge: ${card.cardNumber} with amount: ${amountToCharge}`);
       return await true; 
    }

    
}
