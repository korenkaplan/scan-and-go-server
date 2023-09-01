import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from './schemas/item.schema';
import { Model } from 'mongoose';
import { GetQueryDto } from 'src/global/global.dto';
import { Category, Fabric, Season, Color, ClothingGender } from 'src/global/global.enum';
import { ItemForNfcAddition } from './item.dto';

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
    console.log('inserted');

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
}
