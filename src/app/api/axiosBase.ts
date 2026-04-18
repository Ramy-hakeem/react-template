import UUID from '@/utils/generateUUID.ts';
import { addState, getState } from '@/utils/localStorageHandler';
import axios from 'axios';
import { createAuthRefresh } from 'axios-auth-refresh';
import { toast } from 'sonner';
import { msgs } from './messages.ts';
import { refreshAuthLogic } from './refreshToken.ts';

// create axios client
export const apiClient = axios.create({
  // Force same-origin in dev for cookies to work
  baseURL: import.meta.env.PROD ? import.meta.env.VITE_API_URL : '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const { store } = await import('../store');

    // If skipAuth is provided, remove it and DO NOT attach Bearer token
    const state = store.getState();
    const token = state.auth.token;
    if (config.headers?.skipAuth) {
      delete config.headers.skipAuth;
    } else {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (!getState('uuid')) {
      addState('uuid', UUID());
    }
    // Respect idempotency keys generated explicitly (e.g. refresh token)
    const existingKey = config.headers.get('X-Idempotency-Key');
    const idempotencyKey =
      existingKey || ` ${UUID()} + '-refresh-token-' + ${Date.now()}`;
    config.headers.set('X-Idempotency-Key', idempotencyKey);
    return config;
  },
  (error) => {
    console.error('Request configuration error:', error);
    return Promise.reject(error);
  },
);

createAuthRefresh(apiClient, refreshAuthLogic, {
  statusCodes: [401],
});

apiClient.interceptors.response.use(
  (response) => {
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
    // CRITICAL: Return the rejected promise so axios-auth-refresh can hook into the 401
    return Promise.reject(error);
  },
);

const { get, post, put, postForm, delete: del } = apiClient;

export { del, get, post, postForm, put };
