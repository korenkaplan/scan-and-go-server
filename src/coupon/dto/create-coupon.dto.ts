export class CreateCouponDto{
    code:string;
    discountPercentage:number;
    validFrom: Date;
    validUntil: Date;
    maxUsageCount: number;
}