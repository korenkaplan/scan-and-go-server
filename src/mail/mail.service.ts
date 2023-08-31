import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { randomInt } from 'crypto';
import { UserService } from 'src/user/user.service';
import { VerificationEmailResponse } from './dto/verification-respond.dto';
import { User } from 'src/user/schemas/user.schema';
import { GetQueryDto } from 'src/global/global.dto';
import mongoose from 'mongoose';
import { ITransactionItem } from 'src/transactions/dto/transaction-item.interface';
import { EmailItem } from 'src/global/global.interface';
@Injectable()
export class MailService {
    constructor(private mailerService: MailerService, @Inject(forwardRef(() => UserService)) private userService: UserService) { }

    async sendResetPasswordEmail(email: string): Promise<VerificationEmailResponse> {
        const [isExist, userId] = await this.verifyEmail(email);
        if (!isExist) {
            return this.createResObject(isExist, '00000', userId); // if the email don't exists return 5 digits so the user can't input a correct code without letting it know the email don't exist
        }
        const number = randomInt(1000, 9999).toString();
        await this.mailerService.sendMail({
            to: email,
            subject: 'Scan & Go Password Reset',
            from: 'The Scan & Go Team',
            template: 'passwordResetEmail',
            context: {
                digits: number
            }
        });
        return this.createResObject(isExist, number, userId);
    }
   
    async sendOrderConfirmationEmail(email: string, purchasedItems: EmailItem[],name: string): Promise<void> {
       
        await this.mailerService.sendMail({
            to: email,
            subject: 'Scan & Go Order Confirmation',
            from: 'The Scan & Go Team',
            template: 'orderConfirmation',
            context: {
                items: purchasedItems,
                year: new Date().getFullYear(),
                name: name
            }
        });
    } 
    async verifyEmail(email: string): Promise<[boolean, mongoose.Types.ObjectId]> {
        const dto: GetQueryDto<User> = {
            query: { email },
            projection: { _id: 1 }
        }
        const user = await this.userService.getOne(dto);
        return user ? [true, user._id] : [false, null]
    }
    createResObject(isExist: boolean, digits: string, userId: mongoose.Types.ObjectId): VerificationEmailResponse {
        const expireIn = new Date();
        expireIn.setMinutes(expireIn.getMinutes() + 5)
        const res: VerificationEmailResponse = {
            isExist,
            expireIn,
            digits: digits,
            userId
        }
        return res;
    }
}

