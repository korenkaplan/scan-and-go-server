import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { uploadToS3ResDto } from './dto/upload-to-s3-res.dto';
import { UploadToS3Dto } from './dto/upload-to-s3-dto';
import { CreateProblemDto } from './dto/create-problem-dto';
import { IReportedProblem, ReportedProblem } from './schema/reported-problem.schema';
import { REPORTED_PROBLEM_SCHEMA_VERSION } from 'src/global/global.schema-versions';
import { Status } from './reported-problem.enum';
import { ReportedProblemModule } from './reported-problem.module';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class ReportedProblemService {
    private readonly s3Client = new S3Client({ region: this.configService.getOrThrow('AWS_S3_REGION') });
    // Image url Example: https://scan-and-go.s3.eu-north-1.amazonaws.com/example.jpeg
    private s3PrefixUrl = `https://${this.configService.getOrThrow('AWS_BUCKET_NAME')}.s3.${this.configService.getOrThrow('AWS_S3_REGION')}.amazonaws.com/`
    constructor(
        private readonly configService: ConfigService,
        @InjectModel(ReportedProblem.name)
        private readonly reportedProblemModel: Model<ReportedProblem>
        ) {}
    async createProblem(dto:CreateProblemDto):Promise<ReportedProblem>{
        const {...rest} = dto
        //create the problem 
        const problem: IReportedProblem = {
            schemaVersion:REPORTED_PROBLEM_SCHEMA_VERSION,
            status:Status.Open,
            createdAt:new Date(),
            ...rest
        }
        const newProblem = await this.reportedProblemModel.create(problem)
        // return the problem 
        console.log(newProblem)
        return newProblem
    }

    async uploadToS3(file: Express.Multer.File): Promise<uploadToS3ResDto> {
        const dto: UploadToS3Dto = { fileName: Date.now().toString() + ".jpeg", file: file.buffer }
        await this.uploadToS3Action(dto)
        const resDto: uploadToS3ResDto = { "imageUrl": this.s3PrefixUrl + dto.fileName }
        return resDto
    }

    private async uploadToS3Action(dto: UploadToS3Dto): Promise<void> {
        const { fileName, file } = dto;
        await this.s3Client.send(new PutObjectCommand({
            Bucket: 'scan-and-go',
            Key: fileName,
            Body: file,
            ContentType: 'image/jpeg'
        }))


    }
}