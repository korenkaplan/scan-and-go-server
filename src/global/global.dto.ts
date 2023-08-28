import { FilterQuery, ProjectionFields, UpdateQuery} from "mongoose";

export class GetQueryDto<T> {
    query: FilterQuery<T>
    projection: ProjectionFields<T>
    currantPage?: number = 0
    limit?: number = 10
    sort?: Record<string,-1| 1> ={'_id':-1}
    skipAmount?: number = this.currantPage * this.limit
}

export class UpdateQueryDto<T> {
    query: FilterQuery<T>
    updateQuery: UpdateQuery<T>
}
export class LocalPaginationConfig {
    currantPage: number
    limit:number
    sort: Record<string,-1| 1>
}
export class HttpResponse<T> {
    message: string;
    status: number;
    data?: T;
    success:boolean
    error?: string
    tokenError?:boolean;
}