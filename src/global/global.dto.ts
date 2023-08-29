import { FilterQuery, ProjectionFields, UpdateQuery } from "mongoose";

export class GetQueryDto<T> {
    query: FilterQuery<T>
    projection: ProjectionFields<T>
    currentPage?: number
    limit?: number
    sort?: Record<string, -1 | 1>
}

export class UpdateQueryDto<T> {
    query: FilterQuery<T>
    updateQuery: UpdateQuery<T>
}
export class LocalPaginationConfig {
    currentPage: number
    limit: number
    sort: Record<string, -1 | 1>
}
export class HttpResponse<T> {
    message: string;
    status: number;
    data?: T;
    success: boolean
    error?: string
    tokenError?: boolean;
}