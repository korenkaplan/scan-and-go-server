import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IItem, Item } from './schemas/item.schema';
import mongoose, { Model } from 'mongoose';
import { GetQueryDto, GetQueryPaginationDto, LocalPaginationConfig, PaginationResponseDtoAdmin, UpdateQueryDto } from 'src/global/global.dto';
import { Category, Fabric, Season, Color, ClothingGender } from 'src/global/global.enum';
import { ItemForNfcAddition } from './item.dto';
import { CreateItemDto } from './schemas/create-item.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { uploadToS3ResDto } from 'src/reported-problem/dto/upload-to-s3-res.dto';
import { UploadToS3Dto } from 'src/reported-problem/dto/upload-to-s3-dto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';

@Injectable()
export class ItemService {
  private readonly TTL = 60 * 60 * 24  // 24 hours
  private LOCAL_PAGINATION_CONFIG: LocalPaginationConfig = { sort: { 'createdAt': -1 }, limit: 5 }
  private readonly s3Client = new S3Client({ region: this.configService.getOrThrow('AWS_S3_REGION') });
  private readonly folder = "Products/"
  // Image url Example: https://scan-and-go.s3.eu-north-1.amazonaws.com/Problems/donwload.jpeg
  private s3PrefixUrl = `https://${this.configService.getOrThrow('AWS_BUCKET_NAME')}.s3.${this.configService.getOrThrow('AWS_S3_REGION')}.amazonaws.com/${this.folder}`
  constructor(  private readonly configService: ConfigService,@InjectModel(Item.name) private itemModel: Model<Item>, @Inject(CACHE_MANAGER) private cacheManager: Cache) { }

  async getMany(dto: GetQueryDto<Item>): Promise<Item[]> {
    const { query, projection } = dto
    const items = await this.itemModel.find(query, projection);
    if (!items)
      throw new NotFoundException(`Items not found`)
    return items
  }
  async getOne(dto: GetQueryDto<Item>): Promise<Item> {
    const { query, projection } = dto
    const item = await this.itemModel.findOne(query, projection);
    if (!item)
      throw new NotFoundException(`Item not found`)

    return item;
  }
  async getById(id: mongoose.Types.ObjectId): Promise<Item> {
    const cachedItem: Item = await this.cacheManager.get(id.toString())
    if (cachedItem) {
      return cachedItem
    }
    const _id = new mongoose.Types.ObjectId(id)
    log(_id)
    const item = await this.itemModel.findById(_id);
    if (!item)
      throw new NotFoundException(`Item not found`)
    await this.cacheManager.set(id.toString(), item, this.TTL)
    return item;
  }
  async createMock() {
    const items = [
      {
        name: 'SOLY HUX',
        category: Category.Shirts,
        price: 34.99,
        imageSource: 'https://m.media-amazon.com/images/I/71eS4Z65FDL._AC_UL400_.jpg',
        fabric: Fabric.Cotton,
        ClothingGender: ClothingGender.M,
        season: Season.SpringSummer,
        colors: [Color.Brown],
        createdAt: new Date(),
      },
      {
        name: 'Sushi Cat',
        category: Category.Shirts,
        price: 34.99,
        imageSource: 'https://m.media-amazon.com/images/I/61ufM8fYLvL._AC_UL400_.jpg',
        fabric: Fabric.Cotton,
        ClothingGender: ClothingGender.M,
        season: Season.SpringSummer,
        colors: [Color.Green],
        createdAt: new Date(),
      },
      {
        name: 'Ghost Skateboard Lazy',
        category: Category.Shirts,
        price: 34.99,
        imageSource: 'https://m.media-amazon.com/images/I/51uoiHsForL._AC_UL400_.jpg',
        fabric: Fabric.Cotton,
        ClothingGender: ClothingGender.M,
        season: Season.SpringSummer,
        colors: [Color.Green],
        createdAt: new Date(),
      },
    ];

    await this.itemModel.insertMany(items);


  }
  async getAllItemsForNfcAddition(): Promise<ItemForNfcAddition[]> {
    const items = await this.itemModel.find();
    const itemsForNfcAddition: ItemForNfcAddition[] = items.map(item => {
      const abstractedItem: ItemForNfcAddition = {
        name: item.name,
        imageSource: item.imageSource,
        itemId: item._id
      }
      return abstractedItem;
    });
    return itemsForNfcAddition;
  }
  async createItem(dto: CreateItemDto): Promise<Item> {
    const item: IItem = {
      ...dto,
      createdAt: new Date(),
      _id:new mongoose.Types.ObjectId()
    }
    const createdItem = await this.itemModel.create(item);
    return createdItem;

  }
  async deleteItem(id: mongoose.Types.ObjectId): Promise<Item> {
    const item = await this.itemModel.findByIdAndDelete(id);
    if (!item)
      throw new NotFoundException(`Item not found`)
    return item;
  }
  async updateItem(dto: UpdateQueryDto<Item>): Promise<Item> {
    const { query, updateQuery } = dto
    const item = await this.itemModel.findOneAndUpdate(query, updateQuery, { new: true });
    if (!item)
      throw new NotFoundException(`Item not found`)
    return item;
  }
  async uploadToS3(file: Express.Multer.File): Promise<uploadToS3ResDto> {
    const dto: UploadToS3Dto = { fileName: Date.now().toString() + ".jpeg", file: file.buffer }
    await this.uploadToS3Action(dto)
    const resDto: uploadToS3ResDto = { "imageUrl": this.s3PrefixUrl + dto.fileName }
    return resDto
}
private async uploadToS3Action(dto: UploadToS3Dto): Promise<void> {
    const { fileName, file } = dto;
    await this.s3Client.send(new PutObjectCommand({
        Bucket: 'scan-and-go',
        Key: this.folder + fileName,
        Body: file,
        ContentType: 'image/jpeg'
    }))
}
async getManyPaginationAdmin(dto: GetQueryPaginationDto<Item>): Promise<PaginationResponseDtoAdmin<Item>> {
  // extract relevant information from the input DTO
  const { query, projection, currentPage } = dto;

  // configure pagination settings based on global service and local configuration
  const { limit, sort } = this.LOCAL_PAGINATION_CONFIG
  const skipAmount = currentPage * limit;

  // retrieve transactions from the database based on query, projection, pagination, and sorting
  const items = await this.itemModel.find(query, projection).skip(skipAmount).limit(limit).sort(sort);


  // prepare the response object with the decrypted transactions
  const res: PaginationResponseDtoAdmin<Item> = {
      list: items,
      pageNumber: currentPage,
  }
  return res; 
}
async getItemsCount (): Promise<number> {
  const transactionsCount = await this.itemModel.countDocuments({});
  return transactionsCount;
}
}
