import { Body, Controller, Delete, HttpCode, Post, UseInterceptors } from '@nestjs/common';
import { PaidItemService } from './paid-item.service';
import { Public } from 'src/auth/decorators/public-guard.decorator';
import { CreatePaidItemDto, GetPaidItemDto } from './dto/paid-item.dto';
import { PaidItem } from './schemas/paid-item.schema';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('paid-item')
export class PaidItemController {
    constructor(private readonly paidItemService: PaidItemService) { }
    @Public()
    @HttpCode(200)
    @UseInterceptors(CacheInterceptor)
    @Post('/getOne')
    async getOne(@Body() dto: GetPaidItemDto): Promise<PaidItem> {
        return  await this.paidItemService.getOne(dto);
    }
    @Public()
    @Post('/create')
    async create(@Body() dto: CreatePaidItemDto) {
        return await this.paidItemService.create(dto);
    }
    @Delete('/destroy')
    async destroy(): Promise<string> {
        return await this.paidItemService.cleanCollection();
    }

}
