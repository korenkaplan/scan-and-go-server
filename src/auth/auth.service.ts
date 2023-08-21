import { Injectable, NotImplementedException } from '@nestjs/common';
import { User } from 'src/user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel:Model<User>,
        private jwtService: JwtService
    ){}
    async signUp(dto: SignUpDto): Promise<{ token: string}>{
        const user = await this.userModel.create(dto)
        return this.generateToken(user)
    }
    async login(dto: LoginDto): Promise<{ token: string}>{
        throw new NotImplementedException
    }
    async generateToken(user: User): Promise<{ token: string}> {
        const token = this.jwtService.sign({ id: user._id})
        return { token }
    }
     hashPassword(password: string): string{
        throw new NotImplementedException
    }
}
