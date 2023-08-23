import { FilterQuery,UpdateQuery,  ProjectionFields } from "mongoose";

export class GetQueryDto<T> {
    query: FilterQuery<T>
    projection: ProjectionFields<T>
}

export class UpdateQueryDto<T> {
    query: FilterQuery<T>
    updateQuery: UpdateQuery<T>
}