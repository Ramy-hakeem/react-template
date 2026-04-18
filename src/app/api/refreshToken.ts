import UUID from '@/utils/generateUUID';
import { apiClient } from './axiosBase';
import { logout, setToken } from '@/features/auth/authSlice';

let refreshPromise: Promise<string> | null = null;

export const executeTokenRefresh = async () => {
  if (refreshPromise) {
    return refreshPromise;
  }

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
      return newAccessToken;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

// Refresh token logic - called automatically when a request fails with 401
export const refreshAuthLogic = async (failedRequest: any) => {
  try {
    const newAccessToken = await executeTokenRefresh();
    const { store } = await import('../store');
    store.dispatch(setToken(newAccessToken));

    // CRITICAL: Update the failed request's Authorization header so the retry uses the new token
    if (failedRequest?.response?.config) {
      failedRequest.response.config.headers['Authorization'] =
        `Bearer ${newAccessToken}`;
    }
    return Promise.resolve();
  } catch (refreshError: unknown) {
    if (
      refreshError &&
      typeof refreshError === 'object' &&
      'response' in refreshError
    ) {
      const error = refreshError as { response?: { status?: number } };
      if (error.response?.status === 47) {
        return Promise.reject(refreshError);
      }
    }
    const { store } = await import('../store');
    console.log('refresh token failed, logging out');
    store.dispatch(logout());
    return Promise.reject(refreshError);
  }
};
