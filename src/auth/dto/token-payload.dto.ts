import { IsNotEmpty, IsString } from "class-validator";
import { Role } from "src/global/global.enum";

export class TokenPayload {

    @IsNotEmpty()
    @IsString()
    id: string;
    roles: Role[]
}