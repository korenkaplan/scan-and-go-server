import { ItemService } from './item.service';
import { Body, Controller, Get } from '@nestjs/common';
import { Item } from './schemas/item.schema';
import { GetQueryDto } from 'src/utils/global-dto/get-query.dto';

@Controller('item')
export class ItemController {
    constructor(private itemService: ItemService) { }

    @Get('/getAll')
    async getUsers(@Body() dto: GetQueryDto<Item>): Promise<Item[]> {
        return await this.itemService.getMany(dto);
    }

    @Get('/getOne')
    async getItems(@Body() dto: GetQueryDto<Item>): Promise<Item[]> {
        return await this.itemService.getMany(dto);
    }
}
