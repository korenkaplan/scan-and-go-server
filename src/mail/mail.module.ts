import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: 'smtp.gmail.com',
          auth: {
            user: 'korenkaplan96@gmail.com',
            pass: 'aabcqfjblaupmrfo',
          },
          tls:{
            rejectUnauthorized: false,
          },
        },
      
        defaults: {
          from: 'The Scan & Go Team'
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          }
        },
        port: 587,
        secure: false,

      })
    })
  ],
  providers: [MailService],
  exports: [MailService], // 👈 export for DI
})
export class MailModule { }
