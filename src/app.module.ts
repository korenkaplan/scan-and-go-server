import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ItemModule } from './item/item.module';
import { NfcTagModule } from './nfc_tag/nfc_tag.module';
import { TransactionsModule } from './transactions/transactions.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { MailModule } from './mail/mail.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { CouponModule } from './coupon/coupon.module';
import { ReportedProblemModule } from './reported-problem/reported-problem.module';
import { PaidItemModule } from './paid-item/paid-item.module';
import { GlobalModule } from './global/global.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { SiteModule } from './site/site.module';
@Module({
  imports: [ 
    CacheModule.register({
      isGlobal: true,
      ttl:60*60*24
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
     MongooseModule.forRoot(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}${process.env.MONGO_PATH}`,{dbName: process.env.DB_NAME}),
     UserModule,
     MailModule, 
     AuthModule,
     ItemModule, 
     NfcTagModule,
     TransactionsModule, 
     PaidItemModule,
     CouponModule,
     ReportedProblemModule,
     GlobalModule,
     SiteModule,
  ],
  providers: [ 
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
   
  ],
})
export class AppModule { }
