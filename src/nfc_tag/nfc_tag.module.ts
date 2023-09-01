import { Module } from '@nestjs/common';
import { NfcTagController } from './nfc_tag.controller';
import { NfcTagService } from './nfc_tag.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NfcTag, NfcTagSchema } from './schemas/nfc-tag.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:NfcTag.name, schema:NfcTagSchema}])],
  controllers: [NfcTagController],
  providers: [NfcTagService]
})
export class NfcTagModule {}
