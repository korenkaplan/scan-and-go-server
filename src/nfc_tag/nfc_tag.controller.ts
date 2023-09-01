import { Body, Controller, Post } from '@nestjs/common';
import { NfcTagService } from './nfc_tag.service';
import { Public } from 'src/auth/decorators/public-guard.decorator';
import { CreateNfcTagDto } from './dto/create-nfc-tag.dto';
import { NfcTag } from './schemas/nfc-tag.schema';

@Controller('nfc-tag')
export class NfcTagController {
    constructor(private nfcTagService: NfcTagService){ }
    @Public() //TODO: check if to remain public or not
    @Post('create')
    async createNfcTag(@Body() dto: CreateNfcTagDto): Promise<NfcTag>{
        return await this.nfcTagService.create(dto)
    }

   
}
