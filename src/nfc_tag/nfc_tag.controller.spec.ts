import { Test, TestingModule } from '@nestjs/testing';
import { NfcTagController } from './nfc_tag.controller';

describe('NfcTagController', () => {
  let controller: NfcTagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NfcTagController],
    }).compile();

    controller = module.get<NfcTagController>(NfcTagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
