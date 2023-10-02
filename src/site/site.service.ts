import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import moment from 'moment';
import { Model } from 'mongoose';
import { DayOfWeek, Month } from 'src/global/global.enum';
import { IStats } from 'src/global/global.interface';
import { Item } from 'src/item/schemas/item.schema';
import { PaidItem } from 'src/paid-item/schemas/paid-item.schema';
import { Transaction } from 'src/transactions/schemas/transaction.schema';
import { User } from 'src/user/schemas/user.schema';
import { UserJoiningsStats } from './dto/site-dtos';

@Injectable()
export class SiteService {
    private NUMBER_OF_LAST_YEARS_FOR_YEARLY_STATS = 7
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
        @InjectModel(Item.name) private itemsModel: Model<Item>,
        @InjectModel(PaidItem.name) private paidModel: Model<PaidItem>,
    ) { };
    private initWeeklyObject(): IStats[] {
        const weekObject: IStats[] = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const clonedDate = new Date(today); // Clone the date
            clonedDate.setDate(today.getDate() - i); // Update the cloned date
            const day = clonedDate.getDay(); // Calculate the day of the week (0 to 6)

            weekObject.push({
                label: DayOfWeek[day],
                value: 0,
                date: clonedDate,
            });
        }

        return weekObject // Reverse the array to get the correct order
    }
    private initMonthlyObject(): IStats[] {
        const today = new Date();
        const monthObject: IStats[] = [];
        const monthlyStartDate = new Date(today);

        // calculate starting month
        monthlyStartDate.setFullYear(today.getFullYear() - 1); // Go back one year
        monthlyStartDate.setMonth(today.getMonth() + 1); // Go to the month after the current month

        // set the day to 1 for consistency
        monthlyStartDate.setDate(1);

        for (let i = 0; i < 12; i++) {
            const year = monthlyStartDate.getFullYear();
            const month = monthlyStartDate.getMonth(); // Months are 0-based, so add 1

            monthObject.push({
                year: year,
                label: Month[month],
                value: 0,
            });

            // Move to the next month
            monthlyStartDate.setMonth(monthlyStartDate.getMonth() + 1);
        }

        return monthObject;
    }
    private initYearlyObject(): IStats[] {
        const today = new Date();
        const yearlyObject: IStats[] = [];
        //get the last 7 years date
        const yearlyStartDate = new Date(today);
        yearlyStartDate.setFullYear(today.getFullYear() - 6);
        for (let i = 0; i < 7; i++) {
            const year = yearlyStartDate.getFullYear() + i;
            yearlyObject.push({
                label: year.toString(),
                value: 0,
            });

        }
        return yearlyObject;
    }
    private initWeeklyStartDate(): Date {
        const today = new Date();
        const weeklyStartDate = new Date(today);
        weeklyStartDate.setDate(today.getDate() - 7);
        return weeklyStartDate;
    }
    private initMonthlyStartDate(): Date {
        const today = moment();
        const monthlyStartDate = moment(today).subtract(11, 'months').startOf('month');
        return monthlyStartDate.toDate();
    }
    private initYearlyStartDate(yearsBack: number): Date {
        const today = new Date();
        const yearlyStartDate = new Date(today);
        yearlyStartDate.setFullYear(today.getFullYear() - 1 - yearsBack);
        return yearlyStartDate;
    }
    //#region Top row Cards Dashboard
    //users card
    async usersJoiningsStats():Promise<UserJoiningsStats> {
        //#1 get the users
        const users = await this.userModel.find();

        //2# create the start dates of the last week, last year and last x years
        const weeklyStartDate = this.initWeeklyStartDate();
        const monthlyStartDate = this.initMonthlyStartDate();
        const yearlyStartDate = this.initYearlyStartDate(this.NUMBER_OF_LAST_YEARS_FOR_YEARLY_STATS);

        // create the objects to holds the data (IStats)
        const weekObject: IStats[] = this.initWeeklyObject();
        const monthObject: IStats[] = this.initMonthlyObject();
        const yearlyObject: IStats[] = this.initYearlyObject();

        //convert the users to data for graph visualization
        users.forEach(user => {
            const createdAt = user.createdAt;
            if (createdAt > weeklyStartDate) {
                const date = createdAt.getDate();
                const matchingDay = weekObject.find((day) => day.date.getDate() == date)
                if (matchingDay) {
                    matchingDay.value += 1;
                }
            }
            if (createdAt > monthlyStartDate) {
                const year = user.createdAt.getFullYear();
                const monthNum = user.createdAt.getMonth();
                const matchingMonth = monthObject.find((month) => month.year == year && month.label == Month[monthNum])
                if (matchingMonth) {
                    matchingMonth.value += 1;
                }
            }
            if (createdAt > yearlyStartDate) {
                const yearNum = user.createdAt.getFullYear();
                const matchingYear = yearlyObject.find((year) => year.label == yearNum.toString())
                if (matchingYear) {
                    matchingYear.value += 1;
                }
            
            }
        })

        const stats: UserJoiningsStats = {
            weekly: weekObject.reverse(),
            monthly: monthObject,
            yearly: yearlyObject,
        }
        return stats;

    }
    //rest of the cards dashboard
    //#endregion
}
