import { RawAxiosRequestHeaders, AxiosHeaders } from "axios";

export class LazyLoaderConfig<T>{
    url!: string;
    headers?: RawAxiosRequestHeaders | AxiosHeaders;
    params?: any;
    pageSize?: number;
    pageNumber?: number;

    public constructor(init?: Partial<LazyLoaderConfig<T>>){
        Object.assign(this, init);
    }
}