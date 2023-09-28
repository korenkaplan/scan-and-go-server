import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { SignUpDto } from "src/auth/dto/signup.dto";
import { ResetPasswordQueryDto } from "src/user/dto/reset-password.dto";
import { UpdatePasswordQueryDto } from "src/user/dto/update-password.dto";


//TODO: Password validation pipe
@Injectable()
export class PasswordValidationPipe implements PipeTransform {
    transform(value: UpdatePasswordQueryDto | ResetPasswordQueryDto | SignUpDto) {
        if (value.newPassword.length < 6) {
            throw new BadRequestException('Invalid password must be more then 6 characters')
        }
        return value;
    }
}