import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy, ExtractJwt} from "passport-jwt"
import { TokenPayload } from "../dto/token-payload.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/user/schemas/user.schema";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
){
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    })
}
async validate(payload: TokenPayload): Promise<User>{
    const {id} = payload;
    const user = await this.userModel.findById(id);
    if(!user){
        throw new UnauthorizedException('Login first to access this endpoint')
    }
    return user;
}
}