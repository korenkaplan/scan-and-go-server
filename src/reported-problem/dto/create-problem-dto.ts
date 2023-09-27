import mongoose from "mongoose";
import { DeviceInfo } from "../schema/device-info.interface";
import { ProblemType } from "../reported-problem.enum";
import { IsEnum, IsOptional } from "class-validator";
export class CreateProblemDto {
    @IsOptional()
    userId: mongoose.Types.ObjectId;
    description: string;
    deviceInfo: DeviceInfo
    @IsEnum(ProblemType, { message: 'Please enter a valid Problem Type' })
    type: ProblemType
    @IsOptional()
    screenShot: string
}