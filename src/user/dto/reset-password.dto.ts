import {  IsString} from "class-validator"
import mongoose from "mongoose"

export class ResetPasswordQueryDto {
    @IsString()
    newPassword: string
    userId: mongoose.Schema.Types.ObjectId
}