import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import * as CryptoJS from 'crypto-js'
import { GetQueryDto, GetQueryPaginationDto, LocalPaginationConfig } from './global.dto';
import { CreditCard } from 'src/user/schemas/credit-card.schema';
import { CardType, CardValidationRegex } from './global.enum';


@Injectable()
export class GlobalService {
    private readonly Logger: Logger = new Logger();
    constructor(  ) { }
  
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
        const result: LocalPaginationConfig = { sort, limit}
        return result
    }
     validateCreditCart(card:CreditCard): boolean {
        const cardTypeDecrypted = this.decryptText(card.cardType)
        const cardNumberDecrypted = this.decryptText(card.cardNumber)
      switch (cardTypeDecrypted) {
        case CardType.AMERICAN_EXPRESS:{
            return new RegExp(CardValidationRegex.AMERICAN_EXPRESS).test(cardNumberDecrypted)
        }
        case CardType.VISA:{
            return new RegExp(CardValidationRegex.VISA).test(cardNumberDecrypted)
        }
        case CardType.DISCOVER:{
            return new RegExp(CardValidationRegex.DISCOVER).test(cardNumberDecrypted)
        }
        case CardType.MASTERCARD:{
            return new RegExp(CardValidationRegex.MASTERCARD).test(cardNumberDecrypted)
        }
        default:{
            return false
        }
      
      }
    }
    async chargeCreditCard(card:CreditCard,amountToCharge: number): Promise<boolean> {
       //simulate credit card charging
       Logger.debug(`Card charge: ${card.cardNumber} with amount: ${amountToCharge}`);
       return await true; 
    }
    

}
