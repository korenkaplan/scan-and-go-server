import { Module } from '@nestjs/common';
import { GlobalService } from './global.service';
import { GlobalController } from './global.controller';

@Module({
  controllers: [GlobalController],
  providers: [GlobalService],
  exports: [GlobalService]
})
export class GlobalModule { }
