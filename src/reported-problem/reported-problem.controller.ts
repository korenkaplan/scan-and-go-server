import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'
import { ReportedProblem } from './schema/reported-problem.schema';
import { CreateProblemDto } from './dto/create-problem-dto';
import { ReportedProblemService } from './reported-problem.service';
@Controller('reported-problem')
export class ReportedProblemController {
  constructor(private reportedProblemService: ReportedProblemService) { }

  //TODO: End point 1: get the problem object and return the Id. (create the problem)
  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.reportedProblemService.createProblem(file)
  }

  //TODO: End point 2: get the image file and the problem ID.(upload the image to aws s3 bucket and get back the url. and set the problem screenshot to the url)


}
