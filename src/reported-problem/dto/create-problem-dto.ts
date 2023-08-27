import { ReportedProblem } from "../schema/reported-problem.schema";
export class CreateProblemDto {
    problem:ReportedProblem;
    file: Express.Multer.File
}