import { Month} from "./global.enum"

export interface MonthlyPurchases{
    year: number
    month:string,
    sumAmount: number
}
export interface YearlyPurchases{
    year:number,
    sumAmount: number
}
export interface DailyPurchases{
    day:string,
    sumAmount: number
    date:string
   }
   export interface EmailItem {
    name: string
    price: number
    imageSource: string
}