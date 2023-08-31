import { Month, DayOfWeek } from "./global.enum"

export interface MonthlyPurchases{
    month:Month,
    amount: number
}
export interface YearlyPurchases{
    year:number,
    amount: number
}
export interface DailyPurchases{
    day:DayOfWeek,
    amount: number
   }
   export interface EmailItem {
    name: string
    price: number
    imageSource: string
}