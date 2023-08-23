import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/user/schemas/user.schema';
import { MailModule } from 'src/mail/mail.module';
import {ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[
    ThrottlerModule.forRoot({ttl:60,limit:5}),
    UserModule,
    MailModule,
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService)=> {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions:{
            expiresIn:config.get<number | string>('JWT_EXPIRES')
          }
        }
      }
    }),
    MongooseModule.forFeature([{name:'User', schema:UserSchema}])
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  exports:[JwtStrategy,PassportModule]
})
export class AuthModule {}
