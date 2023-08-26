import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document }  from "mongoose";
import { User } from "src/user/schemas/user.schema";
import { DeviceInfo } from "./device-info.interface";
import { ProblemType, Status } from "../reported-problem.enum";

@Schema({
    timestamps:{createdAt:true, updatedAt:false},
    collection:'reportedProblems',
})

export class ReportedProblem extends Document {
    @Prop({type: mongoose.Schema.Types.ObjectId,ref:'User'}) 
    userId:User
    
    @Prop()
    description:string

    @Prop()
    screenShot: string

    @Prop()
    createdAt:Date

    @Prop()
    deviceInfo:DeviceInfo

    @Prop()
    status:Status

    @Prop()
    schemaVersion:number

    @Prop()
    type:ProblemType

}

export interface IReportedProblem{
    _id:mongoose.Schema.Types.ObjectId
    userId:mongoose.Schema.Types.ObjectId
    description:string
    screenShot:string
    createdAt:Date
    deviceInfo:DeviceInfo
    status:Status
    schemaVersion:number
    type:ProblemType
}

export const ReportedProblemSchema = SchemaFactory.createForClass(ReportedProblem)