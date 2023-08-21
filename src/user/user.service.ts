import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';

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
    async deleteAll(): Promise<void>{
        await this.userModel.deleteMany({});
    }
}
