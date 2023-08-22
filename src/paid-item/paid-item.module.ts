import { Module } from '@nestjs/common';
import { PaidItemService } from './paid-item.service';
import { PaidItemController } from './paid-item.controller';

@Module({
  providers: [PaidItemService],
  controllers: [PaidItemController]
})
export class PaidItemModule {}
