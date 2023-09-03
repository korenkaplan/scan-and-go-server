import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { INfcTag, NfcTag, NfcTagSchema } from './schemas/nfc-tag.schema';
import mongoose from 'mongoose';
import { CreateNfcTagDto } from './dto/create-nfc-tag.dto';
import { NFC_TAG_SCHEMA_VERSION } from 'src/global/global.schema-versions';
import { GetQueryDto } from 'src/global/global.dto';

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
        tagId,
        createdAt: new Date(),
        schemaVersion: NFC_TAG_SCHEMA_VERSION,
     }
     const newTag =  await this.nfcTagModel.create(nfcTag)
     return newTag
    }
    async getOne(dto:GetQueryDto<NfcTag>):Promise<NfcTag>{
        const {query, projection} = dto
        const tag = await this.nfcTagModel.findOne(query, projection)
        if(!tag)
            throw new NotFoundException(`No tag found for ${query}`)
        return tag

    }
    async getMany(dto:GetQueryDto<NfcTag>):Promise<NfcTag[]>{
        const {query, projection} = dto
        const tags = await this.nfcTagModel.find(query, projection)
        if(!NfcTagSchema)
            throw new NotFoundException(`No tag found for ${query}`)
        return tags

    }
    async deleteOne(id:mongoose.Types.ObjectId):Promise<NfcTag>{
        const deletedTag = await this.nfcTagModel.findByIdAndDelete(id)
        if(!deletedTag)
            throw new NotFoundException(`No tag found for ${id}`);
        return deletedTag
    }
}
