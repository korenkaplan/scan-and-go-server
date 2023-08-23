import { FilterQuery, ProjectionFields, UpdateQuery } from "mongoose";

export class GetQueryDto<T> {
    query: FilterQuery<T>
    projection: ProjectionFields<T>
}

export class UpdateQueryDto<T> {
    query: FilterQuery<T>
    updateQuery: UpdateQuery<T>
}
export class HttpResponse<T> {
    message: string;
    status: number;
    data?: T;
    error?: string
}