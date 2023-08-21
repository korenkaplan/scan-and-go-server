import { Controller, Post, Body,Query,Get} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public-guard.decorator';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
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
    @Public()
    verifyEmail(@Query('email') email:string):Promise<string>{
        return this.authService.sendResetPasswordMail(email);
    }
}
