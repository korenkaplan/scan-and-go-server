import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import {Query as ExpressQuery} from 'express-serve-static-core'
@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>
        ){}
    async findAll(): Promise<User[]>{
      
        const users = await this.userModel.find();
        return users
    }
    async getUser(query:ExpressQuery): Promise<User>{
         console.log(query);
        return await this.userModel.findOne(query,{password:0});
         
    }
    async deleteAll(): Promise<void>{
        await this.userModel.deleteMany({});
    }

}
