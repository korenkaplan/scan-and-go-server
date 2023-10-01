import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemSchema } from './schemas/item.schema';
import { GlobalModule } from 'src/global/global.module';

@Module({
  imports:[MongooseModule.forFeature([{name:'Item', schema:ItemSchema}]),GlobalModule],
  controllers: [ItemController],
  providers: [ItemService]
})
export class ItemModule {}
