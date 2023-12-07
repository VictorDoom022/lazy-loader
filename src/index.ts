import axios, { AxiosError, AxiosHeaders, AxiosResponse, RawAxiosRequestHeaders } from 'axios';
import { CallPaginationAPIConfig, CallPaginationAPIResult, LazyLoaderConfig, PaginationAPIResultType } from './models/lazy-loader-config';
import { PaginationResponse } from './models/pagination-response';

export async function excuteLazyLoading<T>(config: LazyLoaderConfig<T>) {
    let contentList: T[] = [];
    let currentPageNumber: number = 1;
    let pageSize: number = config.pageSize ?? 20;
    let totalPageNumber: number = 1;
    let totalElements: number = 0; // No usage, dislay only

    // Call the API for the first time to get the initial content
    let initialContent: CallPaginationAPIResult = await callPaginationAPI({
        ...config,
        pageSize: pageSize,
        pageNumber: currentPageNumber
    });
    
    if(initialContent.status == PaginationAPIResultType.SUCCESS){
        let paginationResponse: PaginationResponse<T> = initialContent.result as PaginationResponse<T>;
        console.log('Total Content: ' + paginationResponse.totalElements);
        contentList.push(...paginationResponse?.content ?? []);
        totalPageNumber = paginationResponse.totalPages ?? 1;
        totalElements = paginationResponse.totalElements ?? 0;
        currentPageNumber += 1;
    }

    while(currentPageNumber <= totalPageNumber){
        // Loop the API call until all content is loaded
        let initialContent: CallPaginationAPIResult = await callPaginationAPI({
            ...config,
            pageSize: pageSize,
            pageNumber: currentPageNumber
        });

        if(initialContent.status == PaginationAPIResultType.SUCCESS){
            console.log('Current page number' + currentPageNumber);
            
            let paginationResponse: PaginationResponse<T> = initialContent.result as PaginationResponse<T>;
            contentList.push(...paginationResponse?.content ?? []);
            totalPageNumber = paginationResponse.totalPages ?? 1;
            currentPageNumber += 1;
        }
    }


    console.log(' ================= RESULT =================');
    console.log('Total pages: ' + totalPageNumber);
    console.log('Total elements: ', totalElements);
    console.log('Total content loaded: ' + contentList.length);
    
}

export async function callPaginationAPI<T>(config: CallPaginationAPIConfig<T>): Promise<CallPaginationAPIResult> {
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
            
            return {
                status: PaginationAPIResultType.SUCCESS,
                result: paginationResponse,
            };
        }else{
            console.log('Request failed: ' + request.status);
        }
    }catch(e: any){
        if(axios.isAxiosError(e)){
            return {
                status: PaginationAPIResultType.AXIOS_ERROR,
                result: e as AxiosError
            };
        }

        return {
            status: PaginationAPIResultType.ERROR,
            result: Error(e.toString())
        };
    }

    return {
        status: PaginationAPIResultType.UNKNOWN
    };
}

function isRequestOK(statusCode: number): boolean {
    return statusCode >= 200 && statusCode <= 299;
}

excuteLazyLoading({
    url: 'http://localhost:8080/api/v1/devotee/pagination/filter',
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

// callPaginationAPI({
//     url: 'http://localhost:8080/api/v1/devotee/pagination/filter',
//     headers: {
//         Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzAxODMxNzM4LCJleHAiOjE3MDM0NjYzMzd9.1olNMsqOIQsYiWYBuALqLeiysP1jVInxuGxhgsKmMXQ',
//     },
//     params: {
//         price: 80,
//         field: 'phoneNo1',
//         sortBy: 'updatedAt',
//         sortDir: 'desc'
//     }
// });

export function add(a: number, b: number): number {
    return a + b;
}
  
// console.log(add(3, 5)); //output: 8