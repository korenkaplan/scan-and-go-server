import { Controller, Delete, Post } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { CouponService } from './coupon.service';
import { GetQueryDto } from 'src/global/global.dto';
import { Coupon } from './schemas/coupon.schema';
import mongoose from 'mongoose';

@Controller('coupon')
export class CouponController {
constructor(private readonly couponService: CouponService){}
    @Post('creteCoupon')
    async createCoupon(dto: CreateCouponDto){
        return await this.couponService.createCoupon(dto);
    }
    @Post('getMany')
    async getMany(dto: GetQueryDto<Coupon>){
        return await this.couponService.getMany(dto);
    }
    @Delete('deleteOne')
    async deleteOne(id: mongoose.Types.ObjectId){
        return await this.couponService.deleteOne(id);
    }
    @Post('getOne')
    async getOne(dto: GetQueryDto<Coupon>){
        return await this.couponService.getOne(dto);
    }

}
