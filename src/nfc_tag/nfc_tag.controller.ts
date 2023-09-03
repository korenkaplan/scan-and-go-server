import { Body, Controller, Delete, Query, Post } from '@nestjs/common';
import { NfcTagService } from './nfc_tag.service';
import { CreateNfcTagDto } from './dto/create-nfc-tag.dto';
import { NfcTag } from './schemas/nfc-tag.schema';
import { GetQueryDto } from 'src/global/global.dto';
import mongoose from 'mongoose';
import { Public } from 'src/auth/decorators/public-guard.decorator';

@Controller('nfc-tag')
export class NfcTagController {
    constructor(private nfcTagService: NfcTagService) { }
    @Public()
    @Post('create')
    async createNfcTag(@Body() dto: CreateNfcTagDto): Promise<NfcTag> {
        return await this.nfcTagService.create(dto)
    }
    @Post('getOne')
    async getOne(@Body() dto: GetQueryDto<NfcTag>): Promise<NfcTag> {
        return await this.nfcTagService.getOne(dto)
    }
    @Post('getMany')
    async getMany(@Body() dto: GetQueryDto<NfcTag>): Promise<NfcTag[]> {
        return await this.nfcTagService.getMany(dto)
    }
    @Delete('deleteOne')
    async deleteOne(@Query('id') id: mongoose.Types.ObjectId): Promise<NfcTag> {
        return await this.nfcTagService.deleteOne(id)
    }


}
