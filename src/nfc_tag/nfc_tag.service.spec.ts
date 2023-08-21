import { Test, TestingModule } from '@nestjs/testing';
import { NfcTagService } from './nfc_tag.service';

describe('NfcTagService', () => {
  let service: NfcTagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NfcTagService],
    }).compile();

    service = module.get<NfcTagService>(NfcTagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
