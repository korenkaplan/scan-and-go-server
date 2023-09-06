import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { PaidItemService } from './paid-item.service';
import { Public } from 'src/auth/decorators/public-guard.decorator';
import { CreatePaidItemDto } from './dto/create-pad-item.dto';
import { PaidItem } from './schemas/paid-item.schema';

@Controller('paid-item')
export class PaidItemController {
    constructor(private readonly paidItemService: PaidItemService) { }
    @Public()
    @Get('/getOne')
    async getOne(@Query('nfcCode') nfcCode: string): Promise<PaidItem> {
        return await this.paidItemService.getOne(nfcCode);
    }
    @Public()
    @Post('/create')
    async create(@Body() dto: CreatePaidItemDto) {
        return await this.paidItemService.create(dto);
    }
    @Delete('/destroy')
    async destroy():Promise<string>{
        return await this.paidItemService.cleanCollection();
    }

}
