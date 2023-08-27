import { Injectable } from '@nestjs/common';
import { ReportedProblem } from './schema/reported-problem.schema';
import { CreateProblemDto } from './dto/create-problem-dto';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Express } from 'express';
@Injectable()
export class ReportedProblemService {
    private readonly s3Client = new S3Client({region: this.configService.getOrThrow('AWS_S3_REGION')});
    constructor(private readonly configService: ConfigService){ console.log(configService.getOrThrow('AWS_S3_REGION'))}
    async createProblem(file:Express.Multer.File):Promise<void>{
        //TODO: Create reported problem 
        console.log(file);
        //const fileName = Date.now().toString()
        //await this.uploadToS3(fileName,file.buffer)
        await this.uploadToS3(file.originalname,file.buffer)
     }
    //  async createProblem(dto: CreateProblemDto):Promise<void>{
    //     //TODO: Create reported problem 
    //     const {file, problem} = dto
    //     console.log(file);
    //     //const fileName = Date.now().toString()
    //     //await this.uploadToS3(fileName,file.buffer)
       
    //  }
    async uploadToS3(fileName:string,file:Buffer):Promise<void>{
        await this.s3Client.send(new PutObjectCommand({
            Bucket:'scan-and-go',
            Key:fileName,
            Body:file,
           }))
    
        
}
}