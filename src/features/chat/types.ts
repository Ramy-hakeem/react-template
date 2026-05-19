import type { GetListPayload } from '@/types';

export interface Message {
  id: string;
  recipientId: string;
  message: string;
  isRead: boolean;
  createdDate: Date | string;
  modifiedDate: Date | string;
  createById: string;
  modifiedById: string;
  lastModified: Date | string;
  isSentByMe: boolean; // Optional property to indicate if the message was sent by the current user
}

export interface chatPayload extends GetListPayload {
  RecipientId: string;
  token: string;
}

export interface SendMessagePayload {
  recipientId: string;
  message: string;
  token: string;
}
