import { IsNotEmpty, IsString, IsEmail, MinLength, IsEnum } from "class-validator";
import { Gender } from "src/globals/enums/gender.enum";
export class SignUpDto {

    @IsNotEmpty()
    @IsString()
    readonly fullName: string;

    @IsNotEmpty()
    @IsEmail({}, { message: "Please enter a valid email address" })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string;

    @IsNotEmpty()
    @IsEnum(Gender, { message: 'Please enter a valid gender' })
    readonly gender: Gender

    @IsNotEmpty()
    @IsString()
    readonly deviceToken: string;

    @IsNotEmpty()
    readonly birthDate: string;

}