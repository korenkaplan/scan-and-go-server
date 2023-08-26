import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { ReportedProblem } from './schema/reported-problem.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('reported-problem')
export class ReportedProblemController {
    @Post('/createProblem')
    @UseInterceptors(FileInterceptor('file', {
        storage:diskStorage({
            destination:'src\\reported-problem\\uploads',
            filename:(req, file, cb)=> {
                cb(null,`${file.originalname}`)
            }
        })
    }))
    async createProblem():Promise<string>{
        return 'successfully created';
    }
}
