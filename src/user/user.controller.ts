import { Controller, Get, Delete, Body, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { FilterQuery } from 'mongoose';
import { GetQueryDto, UpdateQueryDto } from 'src/global/global.dto';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }
    @Get('/getAll')
    async getUsers(@Body() dto: GetQueryDto<User>): Promise<User[]> {
        return await this.userService.getMany(dto);
    }
    @Delete('/deleteAll')
    async deleteUsers(@Body() query: FilterQuery<User>): Promise<number> {
        return await this.userService.deleteMany(query);
    }

    @Put('/updateAll')
    async updateUsers(@Body() dto: UpdateQueryDto<User>): Promise<number> {
        return await this.userService.updateMany(dto);
    }
}
