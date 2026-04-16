import { addState, getState } from '@/utils/localStorageHandler';
import axios from 'axios';
import { msgs } from './messages.ts';
import { toast } from 'sonner';
import UUID from '@/utils/generateUUID.ts';
import { useAuthStore } from '@/features/auth/authStore.ts';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

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
  (config) => {
    // If skipAuth is provided, remove it and DO NOT attach Bearer token
    if (config.headers?.skipAuth) {
      delete config.headers.skipAuth;
    } else {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    const idempotentMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    const method = config.method?.toUpperCase();
    if (!getState('uuid')) {
      addState('uuid', UUID());
    }
    if (idempotentMethods.includes(method || '')) {
      // Respect idempotency keys generated explicitly (e.g. refresh token)
      const existingKey = config.headers.get('X-Idempotency-Key');
      const idempotencyKey =
        existingKey || getState('uuid') + config.url?.replace(/\//g, '-');
      config.headers.set('X-Idempotency-Key', idempotencyKey);
    }
    return config;
  },
  (error) => {
    console.error('Request configuration error:', error);
    return Promise.reject(error);
  },
);

let refreshPromise: Promise<string> | null = null;

export const executeTokenRefresh = async () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  // Must use skipAuth so the backend's GlobalExceptionMiddleware doesn't reject the expired JWT
  // Must use a unique idempotency key so the backend doesn't return a cached expired cookie
  refreshPromise = apiClient
    .post(
      '/api/Authentication/RefreshToken',
      {},
      {
        headers: {
          skipAuth: true,
          'X-Idempotency-Key': UUID() + '-refresh-token-' + Date.now(),
        },
      },
    )
    .then((response) => {
      const newAccessToken = response.data?.data?.token;
      if (!newAccessToken)
        throw new Error('No access token received from refresh endpoint');

      // Update Zustand store with new token
      useAuthStore.getState().setToken(newAccessToken);
      return newAccessToken;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

// Refresh token logic - called automatically when a request fails with 401
const refreshAuthLogic = async (failedRequest: any) => {
  try {
    const newAccessToken = await executeTokenRefresh();
    console.log('Token refreshed successfully');

    // CRITICAL: Update the failed request's Authorization header so the retry uses the new token
    if (failedRequest?.response?.config) {
      failedRequest.response.config.headers['Authorization'] =
        `Bearer ${newAccessToken}`;
    }
    return Promise.resolve();
  } catch (refreshError) {
    console.error('Token refresh failed:', refreshError);
    useAuthStore.getState().setToken(null);
    return Promise.reject(refreshError);
  }
};

createAuthRefreshInterceptor(apiClient, refreshAuthLogic, {
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

export { get, post, put, postForm, del };
