import { Module } from '@nestjs/common';
import { ReportedProblemController } from './reported-problem.controller';
import { ReportedProblemService } from './reported-problem.service';

@Module({
  controllers: [ReportedProblemController],
  providers: [ReportedProblemService]
})
export class ReportedProblemModule {}
