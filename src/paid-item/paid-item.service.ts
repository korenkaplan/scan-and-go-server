import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IPaidItem, PaidItem } from './schemas/paid-item.schema';
import mongoose, { Model } from 'mongoose';
import { CreatePaidItemDto } from './dto/create-pad-item.dto';
import { PAID_ITEM_SCHEMA_VERSION } from 'src/global/global.schema-versions';
//import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PaidItemService {
    constructor(
        @InjectModel(PaidItem.name)
        private paidItemsModel: Model<PaidItem>
    ) { }
    async getOne(@Query() nfcTagCode:string): Promise<PaidItem> {
        const paidItem = await this.paidItemsModel.findOne({nfcTagCode});
        if (!paidItem)
            throw new NotFoundException(`Paid item not found with the code ${nfcTagCode}`);
        return paidItem
    }
    //TODO: Add Cron?
    // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT,{
    //     timeZone:'Asia/Jerusalem'
    // })
    async cleanCollection(): Promise<string> {
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



