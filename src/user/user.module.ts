import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { GlobalModule } from 'src/global/global.module';

@Module({
  imports:[
    MongooseModule.forFeature([{name:'User', schema:UserSchema}]),
    GlobalModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports:[UserService]

})
export class UserModule {}
