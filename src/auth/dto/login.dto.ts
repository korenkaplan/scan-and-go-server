import { IsNotEmpty, IsEmail, MinLength, IsString } from "class-validator";


export class LoginDto {

    @IsNotEmpty()
    @IsEmail({},{message:'Please enter a valid email address'})
    readonly email: string;
    
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}