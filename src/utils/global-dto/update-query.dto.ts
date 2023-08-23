import { FilterQuery, UpdateQuery } from "mongoose";

export class UpdateQueryDto<T> {
    query: FilterQuery<T>
    updateQuery: UpdateQuery<T>
}