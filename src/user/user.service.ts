import { Injectable } from '@nestjs/common';
import mongoose, { FilterQuery, ProjectionType, UpdateQuery } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UserQueryProjDto } from './dto/get-user.dto';
import { UserUpdateQueryDto } from './dto/update-query.dto';
@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>
        ){}
    async findAll(dto: UserQueryProjDto): Promise<User[]>{
        const {query, projection} = dto
      
        const users = await this.userModel.find(query,projection);
        return users
    }
    async getUser(dto: UserQueryProjDto): Promise<User>{
        const {query, projection} = dto

        return await this.userModel.findOne(query,projection);
    }
    async updateUser(dto: UserUpdateQueryDto): Promise<User>{
        const {query, updateQuery} = dto
        return await this.userModel.findOneAndUpdate(query,updateQuery,{new:true});
    }
    async deleteUser(query:FilterQuery<User>): Promise<User>{
        return await this.userModel.findOneAndDelete(query);
    }
    async deleteAll(query:FilterQuery<User>): Promise<void>{
        await this.userModel.deleteMany(query);
    }

}
