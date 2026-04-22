import type { SuccessApiResponse } from './types';

export function transformResponse<D>(res: SuccessApiResponse<D>) {
  return res.data;
}

export const invalidateOnSuccess =
  <T extends string>(tags: T[]) =>
  (_result: unknown, error: unknown) => {
    return error ? [] : tags.map((ele) => ({ type: ele }));
  };
