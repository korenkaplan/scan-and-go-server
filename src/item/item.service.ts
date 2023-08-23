import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from './schemas/item.schema';
import { Model } from 'mongoose';
import { GetQueryDto } from 'src/user/global-dto/get-query.dto';

@Injectable()
export class ItemService {
    constructor(@InjectModel(Item.name) private itemModel: Model<Item>) { }

    async getMany(dto: GetQueryDto<Item>): Promise<Item[]> {
        const { query, projection } = dto

        const users = await this.itemModel.find(query, projection);
        return users
    }
    async getOne(dto: GetQueryDto<Item>): Promise<Item> {
        const { query, projection } = dto

        return await this.itemModel.findOne(query, projection);
    }
}
