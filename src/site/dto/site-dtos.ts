import { IStats } from "src/global/global.interface";

export class GraphStats {
    weekly: IStats[]
    monthly: IStats[]
    yearly: IStats[]
}
export class TransactionGraphStats {
    weekly: IStatsDouble[]
    monthly: IStatsDouble[]
    yearly: IStatsDouble[]
}
export interface IStatsDouble {
    year?: number,
    label: string,
    value: number,
    count:number, 
    date?: Date
}
export interface ITopSellingItem {
    _id:string,
    name:string,
    totalTagsAmount:number,
}