import { BaseApi } from '@/app/api/baseApi';
import type { ApiResponse } from '@/app/api/types';
import { transformErrorResponse } from '@/app/api/apiHelper';
import type { GetListPayload } from '@/types';
import type { Notification } from './types';

const enhancedApi = BaseApi.enhanceEndpoints({
  addTagTypes: ['notifications'],
});

export const notificationsApi = enhancedApi.injectEndpoints({
  endpoints: (build) => ({
    getAllNotifications: build.query<
      ApiResponse<Notification[]>,
      GetListPayload
    >({
      query: (body) => ({
        url: '/api/NotificationCenter/list',
        method: 'POST',
        body,
      }),
      providesTags: ['notifications'],
      transformErrorResponse,
    }),
  }),
});

export const { useGetAllNotificationsQuery } = notificationsApi;
