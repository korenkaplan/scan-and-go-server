import { IsString } from "class-validator"
import mongoose from "mongoose"

export class UpdatePasswordQueryDto {
    @IsString()
    oldPassword: string
    @IsString()
    newPassword: string
    userId: mongoose.Types.ObjectId
}