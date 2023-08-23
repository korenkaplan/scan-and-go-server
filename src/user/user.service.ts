import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import mongoose, { FilterQuery, UpdateWriteOpResult }from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { GetQueryDto } from 'src/utils/global-dto/get-query.dto';
import { UpdateQueryDto } from 'src/utils/global-dto/update-query.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>
    ) { }

    async updatePassword(dto:UpdatePasswordDto):Promise<void> {
        const {oldPassword, newPassword, userId} = dto;

        //find the user with the id
        const user = await this.userModel.findById(userId);

        //if not found throw error
        if(!user) throw new NotFoundException('No user with id ' + userId + ' found in database');

        //hash oldPassword and compare to user.password
        const isPasswordMatch = await  bcrypt.compare(oldPassword,user.password);

        //if not match return return old password incorrect
        if(!isPasswordMatch) throw new BadRequestException('Old password does not match')

        //hash new password and update user password
        user.password = await this.hashPassword(newPassword)
        await user.save()
    }
    async hashPassword(password: string): Promise<string> {
        const hashedPassword =  await bcrypt.hash(password, 10);
        return hashedPassword
    }
    //#region CRUD OPERATIONS
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
    //#endregion
}
