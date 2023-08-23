import { Injectable } from '@nestjs/common';
import mongoose, { FilterQuery, UpdateWriteOpResult }from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { GetQueryDto } from 'utils/global-dto/get-query.dto';
import { UpdateQueryDto } from 'utils/global-dto/update-query.dto';
@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>
    ) { }
    async getMany(dto: GetQueryDto<User>): Promise<User[]> {
        const { query, projection } = dto

        const users = await this.userModel.find(query, projection);
        return users
    }
    async getOne(dto: GetQueryDto<User>): Promise<User> {
        const { query, projection } = dto

        return await this.userModel.findOne(query, projection);
    }
    async updateOne(dto: UpdateQueryDto<User>): Promise<User> {
        const { query, updateQuery } = dto
        return await this.userModel.findOneAndUpdate(query, updateQuery, { new: true });
    }
    async updateMany(dto: UpdateQueryDto<User>): Promise<number> {
        const { query, updateQuery } = dto
        const result: UpdateWriteOpResult = await this.userModel.updateMany(query, updateQuery, { new: true });
        return result.modifiedCount
    }
    async deleteOne(query: FilterQuery<User>): Promise<User> {
        return await this.userModel.findOneAndDelete(query);
    }
    async deleteMany(query: FilterQuery<User>): Promise<number> {
       return (await this.userModel.deleteMany(query)).deletedCount;
       
    }

}
