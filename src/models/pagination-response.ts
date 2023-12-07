export class PaginationResponse<T> {
    pageNo?: number;
    pageSize?: number;
    totalElements?: number;
    totalPages?: number;
    last?: boolean;
    content?: T[];
}