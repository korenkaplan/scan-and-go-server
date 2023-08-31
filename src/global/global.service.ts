import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import * as CryptoJS from 'crypto-js'
import { GetQueryDto, LocalPaginationConfig } from './global.dto';
import { CreditCard } from 'src/user/schemas/credit-card.schema';
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
    async validateCreditCart(card:CreditCard): Promise<boolean> {
        //TODO: Create credit card validation
        return await true;
    }
    async chargeCreditCard(card:CreditCard,amountToCharge: number): Promise<boolean> {
       //TODO: Create credit card charge
       return await true; 
    }


}
