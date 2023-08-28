import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon, ICoupon } from './schemas/coupon.schema';
import mongoose, { Model } from 'mongoose';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { GetQueryDto, UpdateQueryDto } from 'src/global/global.dto';
import { COUPON_SCHEMA_VERSION } from 'src/global/global.schema-versions';

@Injectable()
export class CouponService {
    constructor( 
        @InjectModel(Coupon.name) 
        private readonly couponModel:Model<Coupon>,
    ) { }

    async createCoupon(dto:CreateCouponDto):Promise<Coupon>{
        //destructure dto
        const {...rest} = dto

        //create coupon
        const newCoupon: ICoupon = {
            isActive: true,
            createdAt: new Date(),
            currentUsageCount:0,
            schemaVersion: COUPON_SCHEMA_VERSION,
            ...rest,
        }
        const coupon = await this.couponModel.create(newCoupon);
        // return new coupon
        return coupon;
    }
    async getOne(dto:GetQueryDto<Coupon>):Promise<Coupon>{
        const {query, projection} = dto;
        const coupon = await this.couponModel.findOne(query, projection);
        if(!coupon)
        throw new NotFoundException('No coupon found')

        return coupon;
    
    }
    async getMany(dto:GetQueryDto<Coupon>):Promise<Coupon[]>{
                const {query, projection} = dto;
        const coupons = await this.couponModel.find(query, projection);
        if(!coupons)
        throw new NotFoundException('No coupon found')
    
        return coupons;
    }
    async deleteOne(id: mongoose.Types.ObjectId):Promise<Coupon>{
        const deletedCoupon = await this.couponModel.findByIdAndDelete(id,{new:true});
        if(!deletedCoupon)
        throw new NotFoundException('No coupon found')
        return deletedCoupon;
    }

    async updateOne(dto: UpdateQueryDto<Coupon>):Promise<Coupon>{
        const {query, updateQuery} = dto;

        const updatedCoupon = await this.couponModel.findOneAndUpdate(query, updateQuery,{new:true});
        if(!updatedCoupon)
        throw new NotFoundException('No coupon found')
        return updatedCoupon;
    }
}