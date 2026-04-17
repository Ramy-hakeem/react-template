import { get, post, put, postForm, del } from './axiosBase';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { createApi } from '@reduxjs/toolkit/query/react';
import type {
  AxiosBaseQueryArgs,
  AxiosBaseQueryError,
  AxiosBaseQueryResult,
  AxiosBaseQuerySuccess,
} from './types';

// Type for createApi config

// Helper to check if result is success
export const isSuccess = <D>(
  result: AxiosBaseQueryResult<D>,
): result is AxiosBaseQuerySuccess<D> => {
  return result.isSuccess === true;
};

export const axiosBaseQuery = async <Req, Res, P = Record<string, unknown>>(
  args: AxiosBaseQueryArgs<Req, P>,
): Promise<AxiosBaseQueryResult<Res>> => {
  const { url, method = 'GET', data, body, params, isForm = false } = args;
  const requestData = data || body;
  try {
    let response: AxiosResponse<AxiosBaseQuerySuccess<Res>>;
    switch (method.toUpperCase()) {
      case 'GET':
        response = await get(url, { params });
        break;

      case 'POST':
        response = isForm
          ? await postForm(url, requestData, { params })
          : await post(url, requestData, { params });
        break;

      case 'PUT':
        response = await put(url, requestData, { params });
        break;

      case 'DELETE':
        response = await del(url, { data: requestData, params });
        break;

      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Case 1: Server responded with error
      if (error.response) {
        // Type the response data as your error interface
        const errorData = error.response.data as AxiosBaseQueryError;

        return {
          isSuccess: false,
          traceId: errorData?.traceId || '',
          errorCode: errorData?.errorCode || String(error.response.status),
        };
      }
      // Case 2: No response from server
      else if (error.request) {
        return {
          isSuccess: false,
          traceId: '',
          errorCode: 'NETWORK_ERROR',
        };
      }
    }
    // Case 3: Non-Axios errors
    return {
      isSuccess: false,
      traceId: '',
      errorCode: 'UNKNOWN_ERROR',
    };
  }
};

// RTK compatible baseQuery
const rtkBaseQuery = async (args: unknown) => {
  const result = await axiosBaseQuery(
    args as AxiosBaseQueryArgs<unknown, unknown>,
  );
  if (result.isSuccess) {
    return { data: result.data };
  } else {
    return { error: { status: result.errorCode, data: result } };
  }
};

export const axiosBaseAPI = createApi({
  reducerPath: 'axiosBaseAPI',
  baseQuery: rtkBaseQuery,
  endpoints: () => ({}),
});
