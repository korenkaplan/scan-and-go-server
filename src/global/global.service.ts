import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import * as CryptoJS from 'crypto-js'
@Injectable()
export class GlobalService {
    constructor(){}
    async hashPassword(password: string): Promise<string> {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword
    }
    async encryptText(textToEncrypt:string):Promise<string>{
        const {CRYPTO_KEY} = process.env
        return CryptoJS.AES.encrypt(textToEncrypt,CRYPTO_KEY).toString()
    }
    async decryptText(ciphertext: string): Promise<string> {
        const {CRYPTO_KEY } = process.env
        const bytes = CryptoJS.AES.decrypt(ciphertext, CRYPTO_KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText;
    }

 
   
}
