import { Controller, Get, Delete, Body, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/auth/decorators/public-guard.decorator';
import { User } from './schemas/user.schema';
import { FilterQuery } from 'mongoose';
import { GetQueryDto } from 'utils/global-dto/get-query.dto';
import { UpdateQueryDto } from 'utils/global-dto/update-query.dto';

@Controller('users')
@Public()
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

    @Patch('/updateAll')
    async updateUsers(@Body() dto: UpdateQueryDto<User>): Promise<number> {
        return await this.userService.updateMany(dto);
    }
}
