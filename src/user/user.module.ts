import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { GlobalModule } from 'src/global/global.module';
import { Item, ItemSchema } from 'src/item/schemas/item.schema';
import { NfcTag, NfcTagSchema } from 'src/nfc_tag/schemas/nfc-tag.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name:'User', schema:UserSchema},{name:NfcTag.name, schema:NfcTagSchema}]),
    GlobalModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports:[UserService]

})
export class UserModule {}
