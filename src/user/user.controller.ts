import { Controller, Get, Delete, Body, Patch, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { FilterQuery } from 'mongoose';
import { GetQueryDto, UpdateQueryDto } from 'src/global/global.dto';
import { UpdatePasswordQueryDto } from './dto/update-password.dto';
import { PasswordValidationPipe } from 'src/global/Validation/password-validation.pipe';
import { ResetPasswordQueryDto } from './dto/reset-password.dto';

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
    @Patch('/updateAll')
    async updateUsers(@Body() dto: UpdateQueryDto<User>): Promise<number> {
        return await this.userService.updateMany(dto);
    }
    @UsePipes(PasswordValidationPipe)
    @Patch('/updatePassword')
    async updatePassword(@Body() dto: UpdatePasswordQueryDto):Promise<void>{
        return await this.userService.updatePassword(dto);
    }
    @UsePipes(PasswordValidationPipe)
    @Patch('/resetPassword')
    async resetPassword(@Body() dto: ResetPasswordQueryDto):Promise<void>{
        return await this.userService.resetPassword(dto);
    }
}
