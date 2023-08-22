import { Test, TestingModule } from '@nestjs/testing';
import { PaidItemController } from './paid-item.controller';

describe('PaidItemController', () => {
  let controller: PaidItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaidItemController],
    }).compile();

    controller = module.get<PaidItemController>(PaidItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
