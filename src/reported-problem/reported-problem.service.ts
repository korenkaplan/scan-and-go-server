import { Injectable } from '@nestjs/common';
import { ReportedProblem } from './schema/reported-problem.schema';

@Injectable()
export class ReportedProblemService {
    async createProblem(problem:ReportedProblem):Promise<void>{
        
    }
}
