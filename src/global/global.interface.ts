import { Moment } from "moment"
import { Month } from "./global.enum"

export interface MonthlyPurchases {
    year: number
    month: string,
    sumAmount: number
}
export interface YearlyPurchases {
    year: number,
    sumAmount: number
}
export interface DailyPurchases {
    day: string,
    sumAmount: number
    date: Date
}
export interface IStats {
    year?: number,
    label: string,
    value: number 
    date?: Date
}
export interface EmailItem {
    name: string
    price: number
    imageSource: string
}
export interface UserFullStats {
    weekly: IStats[]
    monthly: IStats[]
    yearly: IStats[]
}