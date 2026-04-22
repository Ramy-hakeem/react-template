import { logout, setToken } from '@/features/auth/authSlice';
import UUID from '@/utils/generateUUID';
import { addState, getState } from '@/utils/localStorageHandler';
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
} from '@reduxjs/toolkit/query/react';

import { Mutex } from 'async-mutex';
import type { SuccessApiResponse } from './types';

// Create mutex to prevent multiple refresh token requests
const mutex = new Mutex();
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL ,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    headers.set('Content-Type', 'application/json');
    // Get token
    const state = getState() as { auth?: { token?: string } };
    const token = state.auth?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    // Add idempotency key for state-changing operations
    headers.set('X-Idempotency-Key', UUID());
    return headers;
  },
});
const baseQueryWithInterceptors: BaseQueryFn = async (
  args,
  api,
  extraOptions,
) => {
  await mutex.waitForUnlock();

  // Get the store dynamically (similar to your dynamic import)
  const modifiedArgs = typeof args === 'object' ? { ...args } : args;

  // Ensure headers object exists
  if (typeof modifiedArgs === 'object') {
    modifiedArgs.headers = modifiedArgs.headers || {};
  }
  // ====== REQUEST INTERCEPTOR LOGIC ======

  // Handle UUID logic
  if (!getState('uuid')) {
    addState('uuid', UUID());
  }

  // Handle Idempotency Key
  const existingKey = modifiedArgs.headers['X-Idempotency-Key'];
  const idempotencyKey = existingKey || `${UUID()}-refresh-token-${Date.now()}`;
  modifiedArgs.headers['X-Idempotency-Key'] = idempotencyKey;

  // Execute the request
  let result = await baseQuery(modifiedArgs, api, extraOptions);
  if (result.error) {
    if (result.error?.status === 401) {
      // Check if mutex is already locked (refresh in progress)
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();

        try {
          // Attempt to refresh the token
          const refreshResult = await baseQuery(
            {
              url: '/api/Authentication/RefreshToken',
              method: 'POST',
              body: {},
              headers: {
                'X-Idempotency-Key': `${UUID()}-refresh-token-${Date.now()}`,
              },
            },
            api,
            extraOptions,
          );

          if (refreshResult.data) {
            // Extract new token from response
            const newToken = (refreshResult.data as any)?.data?.token;

            if (newToken) {
              // Update Redux store with new token
              api.dispatch(setToken(newToken));

              // Retry the original request
              result = await baseQuery(modifiedArgs, api, extraOptions);
            } else {
              // No token in response - force logout
              api.dispatch(logout());
            }
          } else {
            // Refresh failed - logout user
            api.dispatch(logout());
          }
        } finally {
          release();
        }
      } else {
        // Another refresh is already in progress, wait for it
        await mutex.waitForUnlock();
        // Retry the original request with the new token
        result = await baseQuery(modifiedArgs, api, extraOptions);
      }
    }
    // return { error: response };
  }
  return result;
};

export const BaseAPI = createApi({
  reducerPath: 'baseAPI',
  baseQuery: baseQueryWithInterceptors,
  endpoints: () => ({}),
});
