import { FilterQuery, UpdateQuery } from "mongoose";
import { User } from "../schemas/user.schema";

export class UserUpdateQueryDto {
    query:FilterQuery<User>
    updateQuery: UpdateQuery<User>
}