import { IsString } from "class-validator"
import mongoose from "mongoose"

export class UpdatePasswordDto {
    @IsString()
    oldPassword: string
    @IsString()
    newPassword: string
    userId: mongoose.Schema.Types.ObjectId
}