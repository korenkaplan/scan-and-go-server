import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'
import { ReportedProblemService } from './reported-problem.service';
import { Public } from 'src/auth/decorators/public-guard.decorator';
import { CreateProblemDto } from './dto/create-problem-dto';
import { GetQueryDto } from 'src/global/global.dto';
import { ReportedProblem } from './schema/reported-problem.schema';
  //TODO: Fix env is uploading to github. add AWS env variables to render
@Controller('reportedProblem')
export class ReportedProblemController {
  constructor(private reportedProblemService: ReportedProblemService) { }

  @Public()
  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.reportedProblemService.uploadToS3(file)
  }

  @Public()
  @Post('createProblem')
  async createProblem(@Body() dto: CreateProblemDto) {
  return await this.reportedProblemService.createProblem(dto)
  }
  @Public()
  @Get('getAll')
  async getAllProblems(@Body() dto: GetQueryDto<ReportedProblem>){
  return await this.reportedProblemService.getAllProblems(dto);
  }

  @Public()
  @Get('getAllTypeCategories')
  async getAllTypeCategories(){
      return this.reportedProblemService.getAllTypeCategories();
  }
}
