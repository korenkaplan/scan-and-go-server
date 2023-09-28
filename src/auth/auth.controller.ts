import { Controller, Post, Body,Query,Get, UseGuards, UsePipes} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public-guard.decorator';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import {Throttle, ThrottlerGuard} from '@nestjs/throttler'
import { VerificationEmailResponse } from 'src/mail/dto/verification-respond.dto';
import { PasswordValidationPipe } from 'src/global/Validation/password-validation.pipe';
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {

    constructor(private authService: AuthService) { }
    @Public()
    @UsePipes(PasswordValidationPipe)
    @Post('/signup')
    signup(@Body() dto: SignUpDto): Promise<{ token: string }> {
        return this.authService.signUp(dto);
    }
    @Public()
    @Post('/login')
    login(@Body() dto: LoginDto): Promise<{ token: string }> {
        return this.authService.login(dto);
    }

    //TODO: Rate Limit
    @Public()
    @Get('/verifyEmail')
    @Throttle(1,60)
    verifyEmail(@Query('email') email:string):Promise<VerificationEmailResponse>{
        return this.authService.sendResetPasswordMail(email);
    }
}