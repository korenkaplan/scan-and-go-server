import { Test, TestingModule } from '@nestjs/testing';
import { ReportedProblemController } from './reported-problem.controller';

describe('ReportedProblemController', () => {
  let controller: ReportedProblemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportedProblemController],
    }).compile();

    controller = module.get<ReportedProblemController>(ReportedProblemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
