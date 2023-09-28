import { Injectable, NotFoundException,Logger, BadRequestException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon, ICoupon } from './schemas/coupon.schema';
import mongoose, { Model } from 'mongoose';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { GetQueryDto, UpdateQueryDto } from 'src/global/global.dto';
import { COUPON_SCHEMA_VERSION } from 'src/global/global.schema-versions';
import { MailService } from 'src/mail/mail.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CouponService {
     private readonly GIFT_COUPON_DISCOUNT_PERCENTAGE: number = 10
     private readonly Logger = new Logger()
    constructor( 
        @InjectModel(Coupon.name) 
        private readonly couponModel:Model<Coupon>,
        private mailService:MailService
    ) { }
    //TODO: Cron: send coupon to all users.
    @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_NOON)
    async sendGiftCoupon(): Promise<void>{
    const code: string = this.generateRandomWord(6) + this.GIFT_COUPON_DISCOUNT_PERCENTAGE;
    const validFrom = new Date();
    const validUntil =new Date(validFrom);
    validUntil.setDate(validFrom.getDate() + 7);
    const maxUsageCount = 1000
    const dto:CreateCouponDto = {
        maxUsageCount,
        code,
        validFrom,
        validUntil,
        discountPercentage: this.GIFT_COUPON_DISCOUNT_PERCENTAGE
    }
    const coupon = await this.createCoupon(dto)
    await this.mailService.sendCouponEmail(coupon)
    }
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

        return this.validateCoupon(coupon);
    
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
     generateRandomWord(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomWord = '';
    
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomWord += characters[randomIndex];
        }
        return randomWord;
    }
     async validateCoupon(coupon:Coupon) {
        const currantDate = new Date();
        if (!coupon.isActive)
            throw new BadRequestException(`coupon with the id ${coupon._id} is not active`);
        else if (!(coupon.validFrom < currantDate && coupon.validUntil > currantDate)) {
            coupon.isActive = false;
            coupon.markModified('isActive');
            await coupon.save();
            throw new BadRequestException(`coupon with the id ${coupon._id} date is invalid and now is not active`);
        }
        else if (coupon.maxUsageCount <= coupon.currentUsageCount) {
            coupon.isActive = false;
            coupon.markModified('isActive');
            await coupon.save();
            throw new BadRequestException(`coupon with the id ${coupon._id} has reached max usages and now  is not active`);
        }
        else {
            coupon.currentUsageCount = coupon.currentUsageCount + 1;
            coupon.markModified('currentUsageCount');
            return coupon;
        }
    }
}