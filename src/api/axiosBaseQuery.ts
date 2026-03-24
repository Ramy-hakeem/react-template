import { get, post, put, postForm, del } from './axiosBase';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type {
  AxiosBaseQueryArgs,
  AxiosBaseQueryError,
  AxiosBaseQueryResult,
  AxiosBaseQuerySuccess,
} from './types';

// Helper to check if result is success
export const isSuccess = <D>(
  result: AxiosBaseQueryResult<D>,
): result is AxiosBaseQuerySuccess<D> => {
  return result.isSuccess === true;
};

const axiosBaseQuery = async <Req, Res, P = Record<string, unknown>>(
  args: AxiosBaseQueryArgs<Req, P>,
): Promise<AxiosBaseQueryResult<Res>> => {
  const { url, method = 'GET', data, params, isForm = false } = args;
  try {
    let response: AxiosResponse<AxiosBaseQuerySuccess<Res>>;
    switch (method.toUpperCase()) {
      case 'GET':
        response = await get(url, { params });
        break;

      case 'POST':
        response = isForm
          ? await postForm(url, data, { params })
          : await post(url, data, { params });
        break;

      case 'PUT':
        response = await put(url, data, { params });
        break;

      case 'DELETE':
        response = await del(url, { data, params });
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

// API function builder
export default function createApi<Req, Res, P = Record<string, unknown>>(
  config: Omit<AxiosBaseQueryArgs<Req, P>, 'data'>, // Omit 'data' since we'll pass it separately
) {
  return async (data?: Req, params?: P): Promise<AxiosBaseQueryResult<Res>> => {
    return axiosBaseQuery<Req, Res, P>({
      ...config,
      data,
      params: params || config.params, // Use passed params or fallback to config params
    });
  };
}
