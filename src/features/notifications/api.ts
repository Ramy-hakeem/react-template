import { BaseApi } from '@/app/api/baseApi';
import type { GetListPayload } from '@/types';
import type {
  Notification,
  NotificationApiResponse,
  NotificationsPayload,
} from './types';
import {
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType,
} from '@microsoft/signalr';
import UUID from '@/utils/generateUUID';
import { useAuthStore } from '../auth/hooks';

const enhancedApi = BaseApi.enhanceEndpoints({
  addTagTypes: ['notifications'],
});

export const notificationsApi = enhancedApi.injectEndpoints({
  endpoints: (build) => ({
    getAllNotifications: build.query<
      NotificationApiResponse,
      NotificationsPayload
    >({
      query: (body) => ({
        url: '/api/NotificationCenter/list',
        method: 'POST',
        body: { ...body, token: null },
      }),
      providesTags: ['notifications'],
      async onCacheEntryAdded(
        args,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        // Get the JWT token from your auth system
        const token = args.token;

        if (!token) {
          console.warn('No auth token found for SignalR connection');
        }

        const connection = new HubConnectionBuilder()
          .withUrl('/notificationHub', {
            accessTokenFactory: () => token,
            headers: {
              'X-Idempotency-Key': UUID(),
            },
            transport: HttpTransportType.WebSockets,
          })
          .configureLogging(LogLevel.Information)
          .withAutomaticReconnect()
          .build();

        try {
          // Register listeners BEFORE start()
          connection.on('ReceiveNotification', (notification: Notification) => {
            console.log('📨 New notification:', notification);
            updateCachedData((draft) => {
              if (draft?.data) {
                draft.data.unshift(notification);
                if (draft.totalCount !== undefined) {
                  draft.totalCount += 1;
                }
              }
            });
          });

          connection.onreconnecting((error) => {
            console.log('SignalR reconnecting:', error);
          });

          connection.onreconnected((connectionId) => {
            console.log('SignalR reconnected:', connectionId);
          });

          connection.onclose((error) => {
            console.log('SignalR closed:', error);
          });

          // Start connection
          await connection.start();
          console.log('✅ SignalR connected!');
          console.log('Connection state:', connection.state);
          console.log('Connection ID:', connection.connectionId);

          // Wait for initial cache
          await cacheDataLoaded;
          console.log('Cache loaded');
        } catch (error) {
          console.error('SignalR connection error:', error);
        }

        // Cleanup
        await cacheEntryRemoved;
        if (connection) {
          await connection.stop();
          console.log('SignalR stopped');
        }
      },
    }),
  }),
});

export const { useGetAllNotificationsQuery } = notificationsApi;
