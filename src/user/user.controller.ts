import { Controller, Get, Delete, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/auth/decorators/public-guard.decorator';
import { User } from './schemas/user.schema';
import { FilterQuery } from 'mongoose';
import { UserQueryProjDto } from './dto/get-user.dto';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }
    @Get('/allUsers')
    @Public()
    async getUsers(@Body() dto: UserQueryProjDto): Promise<User[]> {
        return await this.userService.findAll(dto);
    }
    @Delete()
    @Public()
    async deleteUsers(@Body() query: FilterQuery<User>): Promise<void> {
        return await this.userService.deleteAll(query);
    }
}
