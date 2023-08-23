import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { randomInt } from 'crypto';
import { UserService } from 'src/user/user.service';
import { VerificationEmailResponse } from './dto/verification-respond.dto';
import { GetQueryDto } from 'utils/global-dto/get-query.dto';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService, private userService: UserService) { }

    async sendResetPasswordEmail(email: string): Promise<VerificationEmailResponse> {
        const isExist = await this.verifyEmail(email);
        if (!isExist) {
            return this.createResObject(isExist, '00000'); // if the email don't exists return 5 digits so the user can't input a correct code without letting it know the email don't exist
        }
        const number = randomInt(1000, 9999).toString();
        await this.mailerService.sendMail({
            to: email,
            subject: 'Scan & Go Password Reset',
            from: 'The Scan & Go Team',
            template: 'confirmation',
            context: {
                digits: number
            }
        });
        return this.createResObject(isExist, number);
    }

    async verifyEmail(email: string): Promise<boolean> {
        const dto:GetQueryDto<User> = {
            query: { email},
            projection:{}
        }
        const user = await this.userService.getOne(dto);
        return user ? true : false;
    }
    createResObject(isExist: boolean, digits: string): VerificationEmailResponse {
        const expireIn = new Date();
        expireIn.setMinutes(expireIn.getMinutes() + 5)
        const res: VerificationEmailResponse = {
            isExist,
            expireIn,
            digits: digits
        }
        return res;
    }
}
