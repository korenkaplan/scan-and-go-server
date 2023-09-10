import { IStats } from "src/global/global.interface"
import { Transaction } from "../schemas/transaction.schema"

export class FilterUserTransactionDto {
     weekObject: IStats[]
     monthObject: IStats[] 
     yearlyObject: IStats[]
     weeklyStartDate: Date
     monthlyStartDate: Date
     yearlyStartDate: Date
     userTransactions: Transaction[]   
}