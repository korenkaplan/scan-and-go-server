import { Injectable, BadRequestException } from '@nestjs/common';
import { IUser, User } from 'src/user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from 'utils/enums/roles.enum';
import * as bcrypt from 'bcryptjs'
import * as moment from 'moment';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService,
        private mailService: MailService
    ) { }
    async signUp(dto: SignUpDto): Promise<{ token: string }> {
        const user = await this.createUserFromSignUpDto(dto);
        const createdUser = await this.userModel.create(user)
        return this.generateToken(createdUser)
    }
    async login(dto: LoginDto): Promise<{ token: string }> {
        const { email, password} = dto;
        const user = await this.userModel.findOne({email});

        if (!user) {throw new BadRequestException(`Invalid email or password`)}
            
        
        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if(!isPasswordMatch) {throw new BadRequestException(`Invalid email or password`)}
        return this.generateToken(user)
    }
    async generateToken(user: IUser): Promise<{ token: string }> {
        const token = this.jwtService.sign({ id: user._id })
        return { token }
    }
    async hashPassword(password: string): Promise<string> {
        const hashedPassword =  await bcrypt.hash(password, 10);
        console.log('hashPassword:'+ hashedPassword);
        return hashedPassword

    }
    convertDate(date: string): Date{
        const isoDate = moment(date, "DD-MM-YYYY").toDate();
        console.log(isoDate);
        return isoDate;
    }
    async createUserFromSignUpDto(dto: SignUpDto): Promise<IUser> {
        const today = new Date()
        const {birthDate, password, ...rest} = dto;
        const hashedPassword = await this.hashPassword(password);

        const user: IUser = {
            password: hashedPassword,
            role: Role.USER,
            schemaVersion: 1,
            isActive: true,
            lastActivity: today,
            createdAt: today,
            transactionsAmount: 0,
            creditCards: [],
            recentItems: [],
            recentTransactions: [],
            cart: [],
            birthDate: this.convertDate(birthDate),
            ...rest,

        }
        return user
    }
    async sendResetPasswordMail(email:string):Promise<string>{
        return await this.mailService.sendResetPasswordEmail(email);
    }
}
