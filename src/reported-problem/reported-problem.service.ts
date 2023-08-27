import { Injectable } from '@nestjs/common';
import { ReportedProblem } from './schema/reported-problem.schema';
import { CreateProblemDto } from './dto/create-problem-dto';

@Injectable()
export class ReportedProblemService {
    async createProblem(newProblem: CreateProblemDto):Promise<void>{
       //TODO: Create reported problem 
    }
}
