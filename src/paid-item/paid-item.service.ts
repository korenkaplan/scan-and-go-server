import { Injectable, NotFoundException, Logger, Inject, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IPaidItem, PaidItem } from './schemas/paid-item.schema';
import mongoose, { Model } from 'mongoose';
import { CreatePaidItemDto, GetPaidItemDto } from './dto/paid-item.dto';
import { PAID_ITEM_SCHEMA_VERSION } from 'src/global/global.schema-versions';
import { MAX_AMOUNT_OF_TAG_CODES } from './paid-item.config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class PaidItemService {
    private readonly logger: Logger = new Logger();
    private readonly TTL = 60 * 60 * 2; //2 hours the time the nfc tag code that went through the scanner will be in the cache
    constructor(
        @InjectModel(PaidItem.name)
        private paidItemsModel: Model<PaidItem>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }
    async getOne(dto: GetPaidItemDto): Promise<PaidItem> {
        const key = dto.nfcTagCode;
        const cachedPaidItem: PaidItem = await this.cacheManager.get(key);
        if(cachedPaidItem)
            return cachedPaidItem;
        const paidItem = await this.paidItemsModel.findOne({ itemId: dto.itemId, 'tagsCodes': dto.nfcTagCode },{_id:1});
        if (!paidItem)
            throw new NotFoundException(`Paid item not found with the code ${dto.nfcTagCode}`);
        await this. cacheManager.set(key, paidItem,this.TTL);
        return paidItem;
    }
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
        const { nfcTagCode, itemId } = dto

        //search for a bucket matching the itemId
        const bucket = await this.paidItemsModel.findOne({ itemId: itemId, tagsAmount: { $lt: MAX_AMOUNT_OF_TAG_CODES } });
        //if not found create a new bucket or the bucket is full create a new one
        if (!bucket)
            return await this.createNewBucketObject(dto);
        
        // push the new code to the bucket
        bucket.tagsCodes.push(nfcTagCode)
        bucket.tagsAmount = bucket.tagsCodes.length

        //save the updates
        bucket.markModified('tagsCodes');
        await bucket.save();

        //return the bucket
        return bucket;

    }
    async createNewBucketObject(dto: CreatePaidItemDto): Promise<PaidItem> {
        const { nfcTagCode, itemId } = dto
        const tagsCodes: string[] = [nfcTagCode]
        const bucket: IPaidItem = {
            tagsCodes,
            itemId,
            createdAt: new Date(),
            schemaVersion: PAID_ITEM_SCHEMA_VERSION,
            tagsAmount: 1,
        }
        return await this.paidItemsModel.create(bucket);
    }
}



