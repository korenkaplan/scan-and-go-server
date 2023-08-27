import { IsNotEmpty, IsString, IsEmail, IsEnum } from "class-validator";
import { Gender } from "src/global/global.enum";
export class SignUpDto {

    @IsNotEmpty()
    @IsString()
    readonly fullName: string;

    @IsNotEmpty()
    @IsEmail({}, { message: "Please enter a valid email address" })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly newPassword: string;

    @IsNotEmpty()
    @IsEnum(Gender, { message: 'Please enter a valid gender' })
    readonly gender: Gender

    @IsNotEmpty()
    @IsString()
    readonly deviceToken: string;

    @IsNotEmpty()
    readonly birthDate: Date;

}