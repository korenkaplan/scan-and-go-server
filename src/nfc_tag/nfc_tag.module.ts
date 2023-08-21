import { Module } from '@nestjs/common';
import { NfcTagController } from './nfc_tag.controller';
import { NfcTagService } from './nfc_tag.service';

@Module({
  controllers: [NfcTagController],
  providers: [NfcTagService]
})
export class NfcTagModule {}
