export interface SuccessApiResponse<D> {
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
  errorCode: number | string;
  traceId: string;
}
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
