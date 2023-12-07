import axios, { AxiosError, AxiosHeaders, AxiosResponse, RawAxiosRequestHeaders } from 'axios';
import { CallPaginationAPIConfig, CallPaginationAPIResult, LazyLoaderConfig, PaginationAPIResultType } from './models/lazy-loader-config';
import { PaginationResponse } from './models/pagination-response';
import { LazyLoaderOutput } from './models/lazy-loader-output';

export async function useLazyLoading<T>(config: LazyLoaderConfig<T>, callback: (data: T[]) => void) {
    // Create a new instance of LazyLoaderOutput with the callback
    // let contentList = new LazyLoaderOutput<T>(callback);

    // Pass the config to the excuteLazyLoading function
    await excuteLazyLoading<T>(config, callback);
}

export async function excuteLazyLoading<T>(config: LazyLoaderConfig<T>, callback: (data: T[]) => void){
    let contentList: LazyLoaderOutput<T> = new LazyLoaderOutput<T>(callback);
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
        contentList.data = paginationResponse?.content ?? [];
        totalPageNumber = paginationResponse.totalPages ?? 1;
        totalElements = paginationResponse.totalElements ?? 0;
        currentPageNumber += 1;
    }

    while(currentPageNumber <= totalPageNumber){
        await timer(500);
        // Loop the API call until all content is loaded
        let initialContent: CallPaginationAPIResult = await callPaginationAPI({
            ...config,
            pageSize: pageSize,
            pageNumber: currentPageNumber
        });

        if(initialContent.status == PaginationAPIResultType.SUCCESS){
            // console.log('Current page number' + currentPageNumber);
            
            let paginationResponse: PaginationResponse<T> = initialContent.result as PaginationResponse<T>;
            contentList.data = paginationResponse?.content ?? [];
            totalPageNumber = paginationResponse.totalPages ?? 1;
            currentPageNumber += 1;
        }
    }


    // console.log(' ================= RESULT =================');
    // console.log('Total pages: ' + totalPageNumber);
    // console.log('Total elements: ', totalElements);
    // console.log('Total content loaded: ' + contentList.data.length);
    // console.log(contentList.data.length);

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

const timer = (ms: number | undefined) => new Promise(res => setTimeout(res, ms))

export function add(a: number, b: number): number {
    return a + b;
}
