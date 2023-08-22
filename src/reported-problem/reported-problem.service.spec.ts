import { Test, TestingModule } from '@nestjs/testing';
import { ReportedProblemService } from './reported-problem.service';

describe('ReportedProblemService', () => {
  let service: ReportedProblemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportedProblemService],
    }).compile();

    service = module.get<ReportedProblemService>(ReportedProblemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
