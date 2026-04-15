import { addState, getState } from '@/utils/localStorageHandler';
import axios from 'axios';
import { msgs } from './messages.ts';
import { toast } from 'sonner';
import UUID from '@/utils/generateUUID.ts';
import { useAuthStore } from '@/features/auth/authStore.ts';
import type { FailedToken } from './types.ts';

// create axios client
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (config.headers?.skipAuth) {
      delete config.headers.skipAuth;
      return config;
    }
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const idempotentMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    const method = config.method?.toUpperCase();
    if (!getState('uuid')) {
      addState('uuid', UUID());
    }
    if (idempotentMethods.includes(method || '')) {
      const idempotencyKey = getState('uuid');
      config.headers.set(
        'X-Idempotency-Key',
        idempotencyKey + config.url?.replace(/\//g, '-'),
      );
    }
    return config;
  },
  (error) => {
    console.error('Request configuration error:', error);
    return Promise.reject(error);
  },
);

// Refresh token logic - called automatically when a request fails with 401

apiClient.interceptors.response.use(
  (response) => {
    // check for auth error
    // if (response.data?.RESULT_CODE === 401) {
    //   throw new Error('ERROR:AUTHENTICATION');
    // }
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
