import { Controller, Get, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/auth/decorators/public-guard.decorator';
import { User } from './schemas/user.schema';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }
    @Get('/allUsers')
    @Public()
    async getUsers(): Promise<User[]> {
        return await this.userService.findAll();
    }
    @Delete()
    @Public()
    async deleteUsers(): Promise<void> {
        return await this.userService.deleteAll();
    }
}
