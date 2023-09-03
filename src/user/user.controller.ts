import { Controller, Get, Delete, Body, Patch, UsePipes, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { FilterQuery } from 'mongoose';
import { GetQueryDto, UpdateQueryDto } from 'src/global/global.dto';
import { UpdatePasswordQueryDto } from './dto/update-password.dto';
import { PasswordValidationPipe } from 'src/global/Validation/password-validation.pipe';
import { ResetPasswordQueryDto } from './dto/reset-password.dto';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { ChangeDefaultCardDto } from './dto/change-default-card.dto';
import { DeleteCreditCardDto } from './dto/delete-credit-card.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ItemInCart } from './schemas/item-in-cart.interface';
import { RemoveItemFromCartDto } from './dto/remove-from-cart.dto';
import { Public } from 'src/auth/decorators/public-guard.decorator';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Post('/removeFromCart')
    async removeFromCart(@Body() dto: RemoveItemFromCartDto): Promise<ItemInCart[]> {
        return await this.userService.removeItemFromCart(dto)
    }
    @Post('/addToCart')
    async addToCart(@Body() dto: AddToCartDto): Promise<ItemInCart[]> {
        return await this.userService.addToCart(dto)
    }
    @Post('/getAll')
    async getUsers(@Body() dto: GetQueryDto<User>): Promise<User[]> {
        return await this.userService.getMany(dto);
    }
    @Post('/getOne')
    async getOne(@Body() dto: GetQueryDto<User>): Promise<User> {
        return await this.userService.getOne(dto);
    }
    @Delete('/deleteAll')
    async deleteUsers(@Body() query: FilterQuery<User>): Promise<number> {
        return await this.userService.deleteMany(query);
    }
    @Patch('/updateAll')
    async updateUsers(@Body() dto: UpdateQueryDto<User>): Promise<number> {
        return await this.userService.updateMany(dto);
    }
    @Patch('/updateOne')
    async updateUser(@Body() dto: UpdateQueryDto<User>): Promise<User> {
        return await this.userService.updateOne(dto);
    }
    @UsePipes(PasswordValidationPipe)
    @Put('/updatePassword')
    async updatePassword(@Body() dto: UpdatePasswordQueryDto): Promise<void> {
        return await this.userService.updatePassword(dto);
    }
    @Public()
    @UsePipes(PasswordValidationPipe)
    @Put('/resetPassword')
    async resetPassword(@Body() dto: ResetPasswordQueryDto): Promise<void> {
        return await this.userService.resetPassword(dto);
    }
    @Post('/paymentMethods/addCreditCard')
    async addCreditCard(@Body() dto: CreateCreditCardDto): Promise<string> {
        return await this.userService.addCreditCard(dto);
    }
    @Patch('/paymentMethods/changeDefault')
    async changeDefaultCard(@Body() dto: ChangeDefaultCardDto): Promise<string> {
        return await this.userService.setDefaultCard(dto);
    }
    @Patch('/paymentMethods/deleteCreditCard')
    async deleteCreditCard(@Body() dto: DeleteCreditCardDto): Promise<string> {
        return await this.userService.deleteCreditCard(dto);
    }
}
