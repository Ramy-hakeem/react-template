import { logout, setToken } from '@/features/auth/authSlice';
import UUID from '@/utils/generateUUID';
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
} from '@reduxjs/toolkit/query/react';

import { Mutex } from 'async-mutex';
import type { BaseQueryWithInterceptors } from './types';

const impotencyKeys: Record<string, string> = {};
const mutex = new Mutex();

const AUTH_ENDPOINTS = [
  '/api/Authentication/Login',
  '/api/Authentication/RefreshToken',
  '/api/Authentication/Logout',
];

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.PROD ? import.meta.env.VITE_API_URL : '',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    headers.set('Content-Type', 'application/json');

    const state = getState() as { auth?: { token?: string | null } };
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

  if (!modifiedArgs.skipIdempotencyKey) {
    const existingKey = impotencyKeys[url];

    if (existingKey) {
      modifiedArgs.headers['X-Idempotency-Key'] = existingKey;
    } else {
      const newKey = UUID();
      impotencyKeys[url] = newKey;
      modifiedArgs.headers['X-Idempotency-Key'] = newKey;
    }
  }

  let result = await baseQuery(modifiedArgs, api, extraOptions);

  if (result.error) {
    const state = api.getState() as { auth?: { token?: string | null } };
    const hasAccessToken = Boolean(state.auth?.token);
    const isAuthEndpoint = AUTH_ENDPOINTS.includes(url);

    const shouldTryRefresh =
      result.error.status === 401 && hasAccessToken && !isAuthEndpoint;

    if (shouldTryRefresh) {
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();

        try {
          const refreshResult = await baseQuery(
            {
              url: '/api/Authentication/RefreshToken',
              method: 'POST',
              body: {},
              headers: {
                'X-Idempotency-Key': UUID(),
              },
            },
            api,
            extraOptions,
          );

          const newToken = (refreshResult.data as any)?.data?.token;

          if (newToken) {
            api.dispatch(setToken(newToken));
            result = await baseQuery(modifiedArgs, api, extraOptions);
          } else {
            api.dispatch(logout());
          }
        } finally {
          release();
        }
      } else {
        await mutex.waitForUnlock();
        result = await baseQuery(modifiedArgs, api, extraOptions);
      }
    }
  }

  delete impotencyKeys[url];
  return result;
};

export const BaseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithInterceptors,
  endpoints: () => ({}),
});
