import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express } from 'express'
import { ReportedProblem } from './schema/reported-problem.schema';
import { CreateProblemDto } from './dto/create-problem-dto';
import { ReportedProblemService } from './reported-problem.service';
@Controller('reported-problem')
export class ReportedProblemController {
constructor(private reportedProblemService: ReportedProblemService){}
@Post('createProblem')
@UseInterceptors(FileInterceptor('file'))
async createProblem(@UploadedFile() file: Express.Multer.File, @Body() reportedProblem: ReportedProblem) {
  const newProblem:CreateProblemDto= {
    problem:reportedProblem,
    file
  }
  return await this.reportedProblemService.createProblem(newProblem)

}


    // @Post('/createProblem')
    // @UseInterceptors(FileInterceptor('file', {
    //     storage:diskStorage({
    //         destination:'./uploads',
    //         filename:(req, file, cb)=> {
    //             const fileName = Date.now().toString();
    //             cb(null,`${fileName}.jpg`)
    //         }
    //     })
    // }))
    // async createProblem():Promise<string>{
    //     return 'successfully created';
    // }
}
