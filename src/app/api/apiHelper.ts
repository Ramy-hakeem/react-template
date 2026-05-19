import type { ErrorApiResponse, ApiResponse } from './types';

export function transformResponse<D>(res: ApiResponse<D>) {
  return res.data;
}

export const invalidateOnSuccess =
  <T extends string>(tags: T[]) =>
  (_result: unknown, error: unknown) => {
    return error ? [] : tags.map((ele) => ({ type: ele }));
  };

export function transformErrorResponse(response: {
  status: number;
  data: ErrorApiResponse;
}): ErrorApiResponse {
  return { ...response.data, StatusCode: response.status } as ErrorApiResponse;
}
