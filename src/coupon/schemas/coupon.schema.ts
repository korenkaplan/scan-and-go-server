import { Schema,SchemaFactory, Prop } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({
    timestamps:{createdAt:true, updatedAt:false},
    collection:'coupons',
})
export class Coupon extends Document {
    @Prop({unique:true})
    code: string; // The coupon code 
  
    @Prop()
    discountPercentage: number; // The discount percentage
  
    @Prop()
    validFrom: Date; // The start date of coupon validity
  
    @Prop()
    validUntil: Date; // The end date of coupon validity
  
    @Prop()
    maxUsageCount: number; // Maximum number of times the coupon can be used
  
    @Prop()
    currentUsageCount: number; // Current usage count
  
    @Prop()
    isActive: boolean; // Whether the coupon is active
  
    @Prop()
    createdAt: Date; // Timestamp of when the coupon was created

    @Prop()
    schemaVersion: number; // Version of the schema

}
export interface ICoupon {
    _id?: mongoose.Types.ObjectId;
    code: string;
    discountPercentage: number;
    validFrom: Date;
    validUntil: Date;
    maxUsageCount: number;
    currentUsageCount: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  export const CouponSchema = SchemaFactory.createForClass(Coupon);