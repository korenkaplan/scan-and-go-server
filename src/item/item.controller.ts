import { ItemService } from './item.service';
import { Body, Controller, Get } from '@nestjs/common';
import { Item } from './schemas/item.schema';
import { GetQueryDto } from 'src/global/global.dto';
import { Public } from 'src/auth/decorators/public-guard.decorator';
import { ItemForNfcAddition } from './item.dto';

@Controller('items')
export class ItemController {
    constructor(private itemService: ItemService) { }
    @Public()
    @Get('/getAll')
    async getUsers(@Body() dto: GetQueryDto<Item>): Promise<Item[]> {
        return await this.itemService.getMany(dto);
    }

    @Get('/getOne')
    async getItems(@Body() dto: GetQueryDto<Item>): Promise<Item[]> {
        return await this.itemService.getMany(dto);
    }
    @Public()
    @Get('/getItemsForNfc')
    async getItemsForNfc(): Promise<ItemForNfcAddition[]> {
        return await this.itemService.getAllItemsForNfcAddition();
    }
}
