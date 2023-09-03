import { ItemService } from './item.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { Item } from './schemas/item.schema';
import { GetQueryDto } from 'src/global/global.dto';
import { ItemForNfcAddition } from './item.dto';
import { Public } from 'src/auth/decorators/public-guard.decorator';
//TODO: Add Cache on the controller
@Controller('items')
export class ItemController {
    constructor(private itemService: ItemService) { }
    @Get('/getAll')
    async getUsers(@Body() dto: GetQueryDto<Item>): Promise<Item[]> {
        return await this.itemService.getMany(dto);
    }

    @Post('/getOne')
    async getItems(@Body() dto: GetQueryDto<Item>): Promise<Item[]> {
        return await this.itemService.getMany(dto);
    }
    @Public()
    @Get('/getItemsForNfc')
    async getItemsForNfc(): Promise<ItemForNfcAddition[]> {
        return await this.itemService.getAllItemsForNfcAddition();
    }
    //TODO: Add CRUD Operations on this controller
}
