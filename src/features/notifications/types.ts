import type { ApiResponse } from '@/app/api/types';
import type { GetListPayload } from '@/types';

export interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  CreatedAt: string;
}

export interface NotificationApiResponse extends ApiResponse<Notification[]> {
  unreadCount: number;
  data: Notification[];
}

export interface NotificationsPayload extends GetListPayload {
  token: string;
}
