import { Test, TestingModule } from '@nestjs/testing';
import { PaidItemService } from './paid-item.service';

describe('PaidItemService', () => {
  let service: PaidItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaidItemService],
    }).compile();

    service = module.get<PaidItemService>(PaidItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
