import { BaseApi } from '@/app/api/baseApi';
import type { NotificationApiResponse, NotificationsPayload } from './types';
import UUID from '@/utils/generateUUID';

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
        let eventSource: EventSource | null = null;
        const token = args.token;

        if (!token) {
          console.warn('No auth token found for SSE connection');
        }

        try {
          // Wait for initial cache
          await cacheDataLoaded;
          console.log('Cache loaded');

          // Create SSE connection with token in URL
          const baseUrl = import.meta.env.PROD
            ? import.meta.env.VITE_API_URL
            : 'https://localhost:7260';

          const sseUrl = `${baseUrl}/event-center/sse?access_token=${token}&idempotencyKey=${UUID()}`;
          eventSource = new EventSource(sseUrl);
          console.log('Connecting to SSE:', sseUrl);

          eventSource = new EventSource(sseUrl);

          // Listen for notification events (adjust event name based on backend)
          eventSource.addEventListener(
            'DeleteNotification',
            (event: MessageEvent) => {
              try {
                const data = JSON.parse(event.data);
                console.log('📨 SSE message:', data);

                const notification = data;
                console.log('Parsed notification:', data);

                updateCachedData((draft) => {
                  if (draft?.data) {
                    const originalLength = draft.data.length;
                    draft.data = draft.data.filter(
                      (n) => n.id !== notification.id,
                    );

                    if (draft.totalCount !== undefined) {
                      const removedCount = originalLength - draft.data.length;
                      draft.totalCount -= removedCount;
                    }
                  }
                });
              } catch (error) {
                console.error('Error parsing SSE message:', error);
              }
            },
          );
          eventSource.addEventListener(
            'ReceiveNotification',
            (event: MessageEvent) => {
              try {
                const data = JSON.parse(event.data);
                console.log('📨 SSE message:', data);

                const notification = data;
                console.log('Parsed notification:', data);
                updateCachedData((draft) => {
                  if (draft?.data) {
                    // Check for duplicates
                    console.log('draft is here ');
                    const exists = draft.data.some(
                      (n) => n.id === notification.id,
                    );
                    if (!exists) {
                      draft.data.unshift(notification);
                      if (draft.totalCount !== undefined) {
                        draft.totalCount += 1;
                      }
                    }
                  }
                });
              } catch (error) {
                console.error('Error parsing SSE message:', error);
              }
            },
          );

          // Handle connection open
          eventSource.onopen = () => {
            console.log('✅ SSE connection established');
          };

          // Handle errors
          // Add more detailed error handling
          eventSource.onerror = (error) => {
            console.error('SSE connection error:', error);
            console.log('ReadyState:', eventSource?.readyState);
            // 0 = CONNECTING, 1 = OPEN, 2 = CLOSED

            if (eventSource?.readyState === 2) {
              console.log('Connection was closed');
            }

            if (eventSource) {
              eventSource.close();
            }
          };
        } catch (error) {
          console.error('SSE setup error:', error);
        }

        // Cleanup
        await cacheEntryRemoved;
        if (eventSource) {
          eventSource.close();
          console.log('SSE connection closed');
        }
      },
    }),
  }),
});

export const { useGetAllNotificationsQuery } = notificationsApi;
