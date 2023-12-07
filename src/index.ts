import axios, { AxiosError, AxiosHeaders, AxiosResponse, RawAxiosRequestHeaders } from 'axios';
import { LazyLoaderConfig } from './models/lazy-loader-config';
import { PaginationResponse } from './models/pagination-response';

export async function callPaginationAPI<T>(config: LazyLoaderConfig<T>): Promise<PaginationResponse<T> | AxiosError | Error |undefined> {
    try {
        console.log('Sending Request...');
        let request: AxiosResponse = await axios.get(
            config.url, {
                headers: config.headers ?? {
                    "Content-Type" : "application/json"
                },
                params: {
                    ...config.params,
                    pageNo: config.pageNumber ?? 1,
                    pageSize: config.pageSize ?? 10,
                },
            }
        );
        console.log('Received Request...');

        if(isRequestOK(request.status)){
            console.log('Request successful');
            let paginationResponse: PaginationResponse<T> = JSON.parse(JSON.stringify(request.data));
            
            return paginationResponse;
        }else{
            console.log('Request failed: ' + request.status);
        }
    }catch(e: any){
        if(axios.isAxiosError(e)){
            return e as AxiosError;
        }

        return Error(e.toString());
    }
}

function isRequestOK(statusCode: number): boolean {
    return statusCode >= 200 && statusCode <= 299;
}

callPaginationAPI({
    url: 'https://sabsbe.ergrouptech.com/api/v1/devotee/pagination/filter',
    headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzAxODMxNzM4LCJleHAiOjE3MDM0NjYzMzd9.1olNMsqOIQsYiWYBuALqLeiysP1jVInxuGxhgsKmMXQ',
    },
    params: {
        price: 80,
        field: 'phoneNo1',
        sortBy: 'updatedAt',
        sortDir: 'desc'
    }
});

export function add(a: number, b: number): number {
    return a + b;
}
  
// console.log(add(3, 5)); //output: 8