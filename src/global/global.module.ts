import { Module } from '@nestjs/common';
import { GlobalService } from './global.service';
import { GlobalController } from './global.controller';

@Module({
  controllers: [GlobalController],
  providers: [GlobalService],
  exports: []
})
export class GlobalModule { }
