import { useAuthStore } from '@/features/auth/authStore';
import { apiClient } from './axiosBase';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

const refreshAuthLogic = async () => {
  try {
    const response = await apiClient.post('/api/Authentication/RefreshToken');
    console.log('hello ya Bro', response.data.data.token);

    // Extract new access token from response (adjust based on your API response structure)
    const newAccessToken = response.data.data.token;

    if (!newAccessToken) {
      throw new Error('No access token received from refresh endpoint');
    }

    // Update Zustand store with new token
    useAuthStore.getState().setToken(newAccessToken);

    return Promise.resolve();
  } catch (refreshError) {
    // Refresh failed - likely refresh token expired or invalid
    console.error('Token refresh failed:', refreshError);

    // Clear auth state from Zustand
    useAuthStore.getState().setToken(null);

    // Redirect to login page
    // if (typeof window !== 'undefined') {
    //   window.location.href = '/login';
    // }

    return Promise.reject(refreshError);
  }
};

createAuthRefreshInterceptor(apiClient, refreshAuthLogic, {
  statusCodes: [401],
});
