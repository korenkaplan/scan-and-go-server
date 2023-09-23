import { ItemService } from './item.service';
import { Body, Controller, Delete, Get, Patch, Post,Query,UseInterceptors } from '@nestjs/common';
import { Item } from './schemas/item.schema';
import { GetQueryDto, UpdateQueryDto } from 'src/global/global.dto';
import { ItemForNfcAddition } from './item.dto';
import { Public } from 'src/auth/decorators/public-guard.decorator';
import { CreateItemDto } from './schemas/create-item.dto';
import mongoose from 'mongoose';
import { CacheInterceptor } from '@nestjs/cache-manager';
@Controller('items')
export class ItemController {
    constructor(private itemService: ItemService, ) { }

    @Post('/getAll')
    async getUsers(@Body() dto: GetQueryDto<Item>): Promise<Item[]> {
        return await this.itemService.getMany(dto);
    }

    @Post('/getOne')
    async getItems(@Body() dto: GetQueryDto<Item>): Promise<Item> {
        return await this.itemService.getOne(dto);
    }
    @Get('/getById')
    @UseInterceptors(CacheInterceptor)
    async getById(@Query('id') id: mongoose.Types.ObjectId): Promise<Item> {
        return await this.itemService.getById(id);
    }

    @Public()
    @Get('/getItemsForNfc')
    async getItemsForNfc(): Promise<ItemForNfcAddition[]> {
        return await this.itemService.getAllItemsForNfcAddition();
    }
    
    @Post('/create')
    async create(@Body() dto: CreateItemDto): Promise<Item> {
        return await this.itemService.createItem(dto);
    }

    @Delete('/delete')
    async delete(@Query('id') id: mongoose.Types.ObjectId): Promise<Item>{
    return await this.itemService.deleteItem(id);
    }
    @Patch('/update')
    async update(@Body() dto: UpdateQueryDto<Item>): Promise<Item> {
        return await this.itemService.updateItem(dto);
    }
}
