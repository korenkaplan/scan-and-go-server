import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { INfcTag, NfcTag } from './schemas/nfc-tag.schema';
import mongoose from 'mongoose';
import { CreateNfcTagDto } from './dto/create-nfc-tag.dto';
import { NFC_TAG_SCHEMA_VERSION } from 'src/global/global.schema-versions';

@Injectable()
export class NfcTagService {
    constructor(
        @InjectModel(NfcTag.name)
        private nfcTagModel: mongoose.Model<NfcTag>
    ){}
    
    async create(dto:CreateNfcTagDto):Promise<NfcTag>{
     const {itemId, tagId} = dto
     const nfcTag:INfcTag ={
        itemId: itemId,
        _id: tagId,
        createdAt: new Date(),
        schemaVersion: NFC_TAG_SCHEMA_VERSION,
     }
     const newTag =  await this.nfcTagModel.create(nfcTag)
     return newTag
    }
}
