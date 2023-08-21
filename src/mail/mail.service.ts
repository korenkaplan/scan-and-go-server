import { Injectable, NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';
import { randomInt } from 'crypto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService, private userService: UserService){}
  
    async sendResetPasswordEmail(email: string): Promise<string>{

        const number = randomInt(1000,9999).toString();

        const templateUrl = join(__dirname, 'templates','confirmation.hbs')
        console.log('templateUrl: ' + templateUrl);
        console.log('email: ' + email );
        
        await this.mailerService.sendMail({
            to: email,
            subject: 'Scan & Go Password Reset',
            from: 'The Scan & Go Team',
            template: 'confirmation',
            context:{
                digits:number
            }
        });
        return number;
    }
}
