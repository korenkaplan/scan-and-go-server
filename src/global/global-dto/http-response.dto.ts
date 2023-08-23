export class HttpResponse<T> {
    message: string;
    status: number;
    data?: T;
    error?: string
}