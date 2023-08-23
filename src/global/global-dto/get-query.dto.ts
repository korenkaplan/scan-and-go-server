import { FilterQuery, ProjectionFields } from "mongoose";

export class GetQueryDto<T> {
    query: FilterQuery<T>
    projection: ProjectionFields<T>
}