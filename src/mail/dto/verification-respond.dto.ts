import mongoose from "mongoose";

export class VerificationEmailResponse {
     digits: string;
     expireIn: Date
     isExist: boolean
     userId:mongoose.Types.ObjectId
}