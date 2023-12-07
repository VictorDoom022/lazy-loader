import { RawAxiosRequestHeaders, AxiosHeaders, AxiosError } from "axios";
import { PaginationResponse } from "./pagination-response";

export class LazyLoaderConfig<T>{
    url!: string;
    headers?: RawAxiosRequestHeaders | AxiosHeaders;
    params?: any;
    pageSize?: number;

    public constructor(init?: Partial<LazyLoaderConfig<T>>){
        Object.assign(this, init);
    }
}

export class CallPaginationAPIConfig<T>{
    url!: string;
    headers?: RawAxiosRequestHeaders | AxiosHeaders;
    params?: any;
    pageSize?: number;
    pageNumber?: number;

    public constructor(init?: Partial<LazyLoaderConfig<T>>){
        Object.assign(this, init);
    }
}

export class CallPaginationAPIResult {
    status!: PaginationAPIResultType;
    result?: PaginationResponse<any> | AxiosError | Error | undefined;
}

export enum PaginationAPIResultType {
    SUCCESS,
    AXIOS_ERROR,
    ERROR,
    UNKNOWN
}