import type { LoginRequest, SignupPayload } from './type';
import { transformResponse } from '@/app/api/apiHelper';
import { logout } from './authSlice';
import { BaseApi } from '@/app/api/baseApi';
import setupSSE from '@/app/api/SSE';

const enhancedApi = BaseApi.enhanceEndpoints({
  addTagTypes: ['token'],
});
export const authApi = enhancedApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (credentials: LoginRequest) => ({
        url: '/api/Authentication/Login',
        method: 'POST',
        body: { ...credentials, forceLogin: true },
        transformResponse,
      }),
    }),
    signup: build.mutation({
      query: (credentials: SignupPayload) => ({
        url: '/api/Authentication/CreateUser',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: build.mutation({
      query: () => ({
        url: '/api/Authentication/Logout',
        method: 'POST',
      }),

      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const token = args.token;
        const eventSource = setupSSE(token);
        if (!token) {
          console.warn('No auth token found for SSE connection');
        } else {
          // Setup SSE connection

          // Listen for ForceLogout event
          eventSource.addEventListener('ForceLogout', (event) => {
            try {
              const data = JSON.parse(event.data);
              console.log('ForceLogout event received:', data);

              // Close SSE connection
              if (eventSource) {
                eventSource.close();
              }

              // Dispatch logout action
              dispatch(logout());

              // Optional: Show notification to user
              // dispatch(showNotification('You have been forcefully logged out', 'warning'));
            } catch (error) {
              console.error('Error processing ForceLogout event:', error);
            }
          });

          // Handle SSE connection errors
          eventSource.onerror = (error) => {
            console.error('SSE connection error:', error);
            if (eventSource) {
              eventSource.close();
            }
          };
        }

        try {
          // Wait for logout API call to complete
          await queryFulfilled;

          // Clean up SSE connection on successful logout
          if (eventSource) {
            eventSource.close();
          }

          dispatch(logout());
        } catch (error) {
          console.log('logout fail:', error);

          // Clean up SSE connection on error
          if (eventSource) {
            eventSource.close();
          }
        }
      },
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useLogoutMutation } =
  authApi;
