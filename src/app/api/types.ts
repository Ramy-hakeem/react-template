export interface ApiResponse<D> {
  isSuccess: boolean;
  errorCode: number | string;
  traceId: string;
  data: D;
  pageNumber?: number;
  pageSize?: number;
  totalCount?: number;
  totalPages?: number;
}
export interface ErrorApiResponse {
  isSuccess: boolean;
  errorCode: string;
  traceId: string;
  StatusCode: number;
}

export interface BaseQueryWithInterceptors {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: { 'X-Idempotency-Key'?: string };
  skipIdempotencyKey?: boolean;
}
