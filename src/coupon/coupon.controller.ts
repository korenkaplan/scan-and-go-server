import { Body, Controller, Delete,Post, Query } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { CouponService } from './coupon.service';
import { GetQueryDto } from 'src/global/global.dto';
import { Coupon } from './schemas/coupon.schema';
import mongoose from 'mongoose';

@Controller('coupon')
export class CouponController {
constructor(private readonly couponService: CouponService){}
    @Post('creteCoupon')
    async createCoupon(@Body() dto: CreateCouponDto){
        return await this.couponService.createCoupon(dto);
    }
    @Post('getMany')
    async getMany(@Body() dto: GetQueryDto<Coupon>){
        return await this.couponService.getMany(dto);
    }
    @Delete('deleteOne')
    async deleteOne(@Query('id') id: mongoose.Types.ObjectId){
        return await this.couponService.deleteOne(id);
    }
    @Post('getOne')
    async getOne(@Body() dto: GetQueryDto<Coupon>){
        return await this.couponService.getOne(dto);
    }

}
