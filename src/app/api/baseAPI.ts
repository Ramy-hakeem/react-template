import { logout, login } from '@/features/auth/authSlice';
import UUID from '@/utils/generateUUID';
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
} from '@reduxjs/toolkit/query/react';

import { Mutex } from 'async-mutex';
import type { BaseQueryWithInterceptors } from './types';
const impotencyKeys: Record<string, string> = {};
// Create mutex to prevent multiple refresh token requests
const mutex = new Mutex();
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.PROD ? import.meta.env.VITE_API_URL : '',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    headers.set('Content-Type', 'application/json');
    // Get token
    const state = getState() as { auth?: { token?: string } };
    const token = state.auth?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithInterceptors: BaseQueryFn<
  BaseQueryWithInterceptors
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  const modifiedArgs = { ...args };
  modifiedArgs.headers = modifiedArgs.headers || {};
  const url = modifiedArgs.url;

  // ====== REQUEST INTERCEPTOR LOGIC ======

  if (!modifiedArgs.skipIdempotencyKey) {
    // Handle Idempotency Key
    const existingKey = impotencyKeys[url];
    if (existingKey) {
      modifiedArgs.headers['X-Idempotency-Key'] = existingKey;
    } else {
      const newKey = UUID();
      impotencyKeys[url] = newKey;
      modifiedArgs.headers['X-Idempotency-Key'] = newKey;
    }
  }

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
            },
            api,
            extraOptions,
          );

          if (refreshResult.data) {
            // Extract new token from response
            const { data } = refreshResult.data as {
              data?: { token?: string; userId: string };
            };
            const newToken = data?.token;
            const userId = data?.userId;
            if (newToken) {
              // Update Redux store with new token
              api.dispatch(
                login({
                  token: newToken,
                  userId: userId || '',
                }),
              );

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
  delete impotencyKeys[url];
  return result;
};

export const BaseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithInterceptors,
  endpoints: () => ({}),
});
