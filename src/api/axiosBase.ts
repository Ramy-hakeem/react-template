import { getState } from '@/utils/localStorageHandler';
import axios from 'axios';
import { msgs } from './messages.ts';
import { toast } from 'sonner';

// create axios client
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

//
apiClient.interceptors.request.use(
  (config) => {
    if (config.headers?.skipAuth) {
      delete config.headers.skipAuth;
      return config;
    }
    const token = getState('user_data')?.access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request configuration error:', error);
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('this is response ', response);
    // check for auth error
    if (response.data?.RESULT_CODE === 401) {
      throw new Error('ERROR:AUTHENTICATION');
    }
    return response;
  },
  (error) => {
    const errorCode = error.response?.data?.errorCode;
    const message = msgs[errorCode]?.message || 'An error occurred';
    const description = msgs[errorCode]?.description || '';
    if (message) {
      toast.error(message, {
        description,
        duration: 5000,
      });
    }
  },
);
const { get, post, put, postForm, delete: del } = apiClient;

export { get, post, put, postForm, del };
