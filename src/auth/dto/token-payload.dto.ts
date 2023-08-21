import { IsNotEmpty, IsString } from "class-validator";

export class TokenPayload {

    @IsNotEmpty()
    @IsString()
    id: string;
}