import { Controller, Post, Body,Query,Get, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public-guard.decorator';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import {Throttle, ThrottlerGuard} from '@nestjs/throttler'
import { VerificationEmailResponse } from 'src/mail/dto/verification-respond.dto';
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('/signup')
    @Public()
    signup(@Body() dto: SignUpDto): Promise<{ token: string }> {
        return this.authService.signUp(dto);
    }
    @Post('/login')
    @Public()
    login(@Body() dto: LoginDto): Promise<{ token: string }> {
        return this.authService.login(dto);
    }

    @Get('/verifyEmail')
    @Throttle(2,60)
    @Public()
    verifyEmail(@Query('email') email:string):Promise<VerificationEmailResponse>{
        return this.authService.sendResetPasswordMail(email);
    }
}
