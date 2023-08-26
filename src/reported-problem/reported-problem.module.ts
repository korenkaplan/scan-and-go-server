import { Module } from '@nestjs/common';
import { ReportedProblemController } from './reported-problem.controller';
import { ReportedProblemService } from './reported-problem.service';
//import { MulterConfigModule } from 'src/global/multer.config';
import { GlobalModule } from 'src/global/global.module';

@Module({
  imports:[GlobalModule],
  controllers: [ReportedProblemController],
  providers: [ReportedProblemService]
})
export class ReportedProblemModule {}
