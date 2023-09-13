import { Module } from '@nestjs/common';
import { PaidItemService } from './paid-item.service';
import { PaidItemController } from './paid-item.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PaidItem, PaidItemSchema } from './schemas/paid-item.schema';
import { Item, ItemSchema } from 'src/item/schemas/item.schema';

@Module({
  imports: [MongooseModule.forFeature([{name:PaidItem.name, schema:PaidItemSchema},
    {name:Item.name, schema:ItemSchema}])],
  providers: [PaidItemService],
  controllers: [PaidItemController]
})
export class PaidItemModule {}
