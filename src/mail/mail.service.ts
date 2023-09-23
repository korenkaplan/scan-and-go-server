import { Inject, Injectable, forwardRef, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { randomInt } from 'crypto';
import { UserService } from 'src/user/user.service';
import { VerificationEmailResponse } from './dto/verification-respond.dto';
import { User } from 'src/user/schemas/user.schema';
import { GetQueryDto } from 'src/global/global.dto';
import mongoose, { Model, Types } from 'mongoose';
import { EmailItem } from 'src/global/global.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from 'src/transactions/schemas/transaction.schema';
import excelJs, { Workbook, Worksheet } from 'exceljs';
import moment from 'moment';
import { SendExcelDto } from './dto/send-excel.dto';
import * as fs from 'fs';
import { join } from 'path';
import { ICoupon } from 'src/coupon/schemas/coupon.schema';
@Injectable()
export class MailService {
    private readonly Logger: Logger = new Logger();
    private readonly fromString: string = 'The Scan & Go Team';
    constructor(
        private mailerService: MailerService,
        @Inject(forwardRef(() => UserService)) private userService: UserService,
        @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
        @InjectModel(User.name) private readonly userModel: Model<User>,

    ) { }
    async sendResetPasswordEmail(email: string): Promise<VerificationEmailResponse> {
        const [isExist, userId] = await this.verifyEmail(email);
        if (!isExist) {
            return this.createResObject(isExist, '00000', userId); // if the email don't exists return 5 digits so the user can't input a correct code without letting it know the email don't exist
        }
        const number = randomInt(1000, 9999).toString();
        await this.mailerService.sendMail({
            to: email,
            subject: 'Scan & Go Password Reset',
            from: this.fromString,
            template: 'passwordResetEmail',
            context: {
                digits: number
            }
        });
        return this.createResObject(isExist, number, userId);
    }
    async sendCouponEmail(coupon: ICoupon) {
        const userEmails: { email: string, _id: Types.ObjectId }[] = await this.userModel.find({}, { email: 1, _id: 0 })
        const emails = userEmails.map(user => user.email)
        await this.mailerService.sendMail({
            to: emails,
            subject: 'Scan & Go Gift Coupon',
            from: this.fromString,
            template: 'giftCoupon',
            context: {
                couponCode: coupon.code,
                expirationDate: coupon.validUntil.toDateString(),
                percent: coupon.discountPercentage,
                maxAmount: coupon.maxUsageCount
            }

        })

    }
    async sendExcelFile(dto: SendExcelDto) {
        const { email, fileName, filePath, timePeriod, startDate, endDate } = dto;
        if (fs.existsSync(filePath)) {
            await this.mailerService.sendMail({
                to: email,
                subject: `Scan & Go Transactions ${timePeriod} Report`,
                from: 'No Reply <The Scan & Go Team>',
                template: 'transactionsRecap',
                context: {
                    timePeriod,
                    startDate,
                    endDate
                },
                attachments:
                    [
                        {
                            filename: fileName,
                            path: filePath,
                        },
                    ]

            });
        }
    }
    async sendOrderConfirmationEmail(email: string, purchasedItems: EmailItem[], name: string, amountToCharge: number): Promise<void> {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Scan & Go Order Confirmation',
            from: this.fromString,
            template: 'orderConfirmation',
            context: {
                items: purchasedItems,
                year: new Date().getFullYear(),
                name: name,
                totalPrice: amountToCharge
            }
        });
    }
    async verifyEmail(email: string): Promise<[boolean, mongoose.Types.ObjectId]> {
        const dto: GetQueryDto<User> = {
            query: { email },
            projection: { _id: 1 }
        }
        const user = await this.userService.getOne(dto);
        return user ? [true, user._id] : [false, null]
    }
    createResObject(isExist: boolean, digits: string, userId: mongoose.Types.ObjectId): VerificationEmailResponse {
        const expireIn = new Date();
        expireIn.setMinutes(expireIn.getMinutes() + 5)
        const res: VerificationEmailResponse = {
            isExist,
            expireIn,
            digits: digits,
            userId
        }
        return res;
    }
    async createDirectoryIfNotExists(directoryPath) {
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });

        } else {

        }
    }
    async sendTransactionRecap(startDate: Date, endDate: Date, timePeriod: string): Promise<void> {
        const { workBook, sheet } = this.createTransactionWorkbook();
        const formattedStartDate = moment(startDate).format('DD.MM.YYYY')
        const formattedEndDate = moment(endDate).format('DD.MM.YYYY')
        const folderPath = join(__dirname, 'templates', 'xlsx') // Correct file path
        await this.createDirectoryIfNotExists(folderPath)
        const fileName = `${formattedStartDate}-${formattedEndDate}_Transactions.xlsx`
        const filePath = join(folderPath, fileName)
        const transactions = await this.transactionModel.find({ createdAt: { $gte: startDate, $lte: endDate } });
        transactions.map((transaction) => {
            transaction.products.map((product) => {
                sheet.addRow({
                    _id: transaction._id.toString(),
                    userId: transaction.userId.toString(),
                    itemId: product.itemId,
                    nfcTagCode: product.nfcTagCode,
                    name: product.name,
                    price: product.price,
                    formattedDate: transaction.formattedDate
                }).alignment = { vertical: 'middle', horizontal: 'center' }; // Set alignment 
            });
        })
        await workBook.xlsx.writeFile(filePath);
        await this.checkFileExists(filePath);
        const storeManagerEmail = process.env.STORE_MANAGER_MAIL;
        const dto: SendExcelDto = {
            email: storeManagerEmail,
            fileName,
            filePath,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            timePeriod
        }
        await this.sendExcelFile(dto);
        fs.unlink(filePath, (err: any) => {
            if (err)
                Logger.error('Error deleting file: ' + err.message);
        })
    }
    private createTransactionWorkbook() {
        const workBook: Workbook = new excelJs.Workbook();
        const sheet: Worksheet = workBook.addWorksheet('Transactions');
        sheet.columns = [
            { header: 'Transaction ID', key: '_id', width: 30, alignment: { vertical: 'middle', horizontal: 'center' } },
            { header: 'User ID', key: 'userId', width: 30, alignment: { vertical: 'middle', horizontal: 'center' } },
            { header: 'Item ID', key: 'itemId', width: 30, alignment: { vertical: 'middle', horizontal: 'center' } },
            { header: 'NFC Tag ID', key: 'nfcTagCode', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
            { header: 'Name', key: 'name', width: 30, alignment: { vertical: 'middle', horizontal: 'center' } },
            { header: 'Price', key: 'price', width: 10, alignment: { vertical: 'middle', horizontal: 'center' } },
            { header: 'Date', key: 'formattedDate', width: 15, alignment: { vertical: 'middle', horizontal: 'center' } },
        ]
        sheet.getRow(1).eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'C4D79B' },
            }
            cell.alignment = { vertical: 'middle', horizontal: 'center' }; // Set alignment after setting background color
        })
        return { workBook, sheet };
    }
    private async checkFileExists(filePath) {
        try {
            fs.access(filePath, (err: any) => {
                if (err)
                    Logger.error(err);
            });
        } catch (error) {
            if (error.code === 'ENOENT') {

            } else {
                throw error;
            }
        }
    }
}

