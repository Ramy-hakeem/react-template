// Input type
export interface AxiosBaseQueryArgs<
  T = Record<string, unknown>,
  P = Record<string, unknown>,
> {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: T;
  params?: P;
  isForm?: boolean;
}

// Success response type
export interface AxiosBaseQuerySuccess<D> {
  isSuccess: true;
  errorCode: number | string;
  traceId: string;
  data: D;
  pageNumber?: number;
  pageSize?: number;
  totalCount?: number;
  totalPages?: number;
}

// Error response type
export interface AxiosBaseQueryError {
  isSuccess: false;
  traceId: string;
  errorCode: string;
}

// Union type for return
export type AxiosBaseQueryResult<D> =
  | AxiosBaseQuerySuccess<D>
  | AxiosBaseQueryError;
