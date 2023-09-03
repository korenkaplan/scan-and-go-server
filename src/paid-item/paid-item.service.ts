import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IPaidItem, PaidItem } from './schemas/paid-item.schema';
import mongoose, { Model } from 'mongoose';
import { GetQueryDto } from 'src/global/global.dto';
import { CreatePaidItemDto } from './dto/create-pad-item.dto';
import { PAID_ITEM_SCHEMA_VERSION } from 'src/global/global.schema-versions';

@Injectable()
export class PaidItemService {
    constructor(
        @InjectModel(PaidItem.name)
        private paidItemsModel: Model<PaidItem>
    ) { }
    async getOne(@Query() dto: GetQueryDto<PaidItem>): Promise<PaidItem> {
        const { query, projection } = dto;
        const paidItem = await this.paidItemsModel.findOne(query, projection);
        if (!paidItem)
            throw new NotFoundException(`Paid item not found with query ${query}`);
        return paidItem;
    }
    //TODO Add scheduled event to clear the collection each end of day
    async deleteAll(): Promise<string> {
        const deletedAmount: number = (await this.paidItemsModel.deleteMany({})).deletedCount;
        return `Deleted ${deletedAmount} items`;
    }
    async deleteOne(id: mongoose.Types.ObjectId): Promise<PaidItem> {
        const deletedPaidItem = await this.paidItemsModel.findByIdAndDelete(id);
        if (!deletedPaidItem)
            throw new NotFoundException(`Paid item not found with id ${id}`);
        return deletedPaidItem;
    }
    async create(dto: CreatePaidItemDto): Promise<PaidItem> {
        const { ...rest } = dto
        const newItem: IPaidItem = {
            createdAt: new Date(),
            schemaVersion: PAID_ITEM_SCHEMA_VERSION,
            ...rest
        }
        const createdPaidItem = await this.paidItemsModel.create(newItem);
        return createdPaidItem;
    }
}



