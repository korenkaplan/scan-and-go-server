import { Module } from '@nestjs/common';
import { PaidItemService } from './paid-item.service';
import { PaidItemController } from './paid-item.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PaidItem, PaidItemSchema } from './schemas/paid-item.schema';
@Module({
  imports: [MongooseModule.forFeature([{ name: PaidItem.name, schema: PaidItemSchema }])],
  providers: [PaidItemService],
  controllers: [PaidItemController]
})
export class PaidItemModule { }
