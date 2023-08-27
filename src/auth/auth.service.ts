import { Injectable, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { IUser, User } from 'src/user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs'
import moment from 'moment';
import { MailService } from 'src/mail/mail.service';
import { VerificationEmailResponse } from 'src/mail/dto/verification-respond.dto';
import { Role } from 'src/global/global.enum';
import { GlobalService } from 'src/global/global.service';
import { UserService } from 'src/user/user.service';
@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        @Inject(forwardRef(()=>UserService))
        private userModel: Model<User>,
        private jwtService: JwtService,
        private mailService: MailService,
        private globalService: GlobalService
    ) { }
    async signUp(dto: SignUpDto): Promise<{ token: string }> {
        const user = await this.createUserFromSignUpDto(dto);
        const createdUser = await this.userModel.create(user)
        return this.generateToken(createdUser)
    }
    async login(dto: LoginDto): Promise<{ token: string }> {
        const { email, password } = dto;
        const user = await this.userModel.findOne({ email });

        if (!user) { throw new BadRequestException(`Invalid email or password`) }


        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if (!isPasswordMatch) { throw new BadRequestException(`Invalid email or password`) }
        return this.generateToken(user)
    }
    async generateToken(user: IUser): Promise<{ token: string }> {
        const token = this.jwtService.sign({ id: user._id })
        return { token }
    }
     convertDate(date: string): Date {
        const isoDate = moment(date, "DD-MM-YYYY").toDate();
        return isoDate;
    }
    async createUserFromSignUpDto(dto: SignUpDto): Promise<IUser> {
        const today = new Date()
        const { newPassword, ...rest } = dto;
        const hashedPassword = await this.globalService.hashPassword(newPassword);

        const user: IUser = {
            password: hashedPassword,
            roles: [Role.USER],
            schemaVersion: 1,
            isActive: true,
            lastActivity: today,
            createdAt: today,
            transactionsAmount: 0,
            creditCards: [],
            recentItems: [],
            recentTransactions: [],
            cart: [],
            ...rest,

        }
        return user
    }
    async sendResetPasswordMail(email: string): Promise<VerificationEmailResponse> {
        return await this.mailService.sendResetPasswordEmail(email);
    }


}
