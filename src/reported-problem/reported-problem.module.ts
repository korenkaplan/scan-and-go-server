import { Module } from '@nestjs/common';
import { ReportedProblemController } from './reported-problem.controller';
import { ReportedProblemService } from './reported-problem.service';
import { GlobalModule } from 'src/global/global.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportedProblem, ReportedProblemSchema } from './schema/reported-problem.schema';

@Module({
  imports:[GlobalModule,MongooseModule.forFeature([{name:ReportedProblem.name,schema:ReportedProblemSchema}])],
  controllers: [ReportedProblemController],
  providers: [ReportedProblemService]
})
export class ReportedProblemModule {}
