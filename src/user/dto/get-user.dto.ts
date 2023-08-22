import { FilterQuery, ProjectionFields } from "mongoose";
import { User } from "../schemas/user.schema";

export class UserQueryProjDto {
    query:FilterQuery<User>
    projection: ProjectionFields<User>
}