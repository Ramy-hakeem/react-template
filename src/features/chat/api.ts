// Update your chatApi.ts file
import { BaseApi } from '@/app/api/baseApi';
import UUID from '@/utils/generateUUID';
import {
  HttpTransportType,
  HubConnectionBuilder,
  LogLevel,
  HubConnection,
} from '@microsoft/signalr';
import type { chatPayload, Message } from './types';
import { transformResponse } from '@/app/api/apiHelper';

// Create a singleton to store the connection
let signalRConnection: HubConnection | null = null;

const enhancedApi = BaseApi.enhanceEndpoints({
  addTagTypes: ['messages'],
});

export const chatApi = enhancedApi.injectEndpoints({
  endpoints: (build) => ({
    getAllMessages: build.query<Message[], chatPayload>({
      query: (body) => ({
        url: '/api/ChatCenter/history/list',
        method: 'POST',
        body: { ...body, token: null },
      }),
      transformResponse,

      providesTags: ['messages'],
      async onCacheEntryAdded(
        args,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const token = args.token;

        if (!token) {
          console.warn('No auth token found for SignalR connection');
        }

        const connection = new HubConnectionBuilder()
          .withUrl('/chatHub', {
            accessTokenFactory: () => token,
            headers: {
              'X-Idempotency-Key': UUID(),
            },
            transport: HttpTransportType.WebSockets,
          })
          .configureLogging(LogLevel.Information)
          .withAutomaticReconnect()
          .build();

        // Store connection globally
        signalRConnection = connection;

        try {
          // Register all event listeners based on working HTML example
          connection.on('ReceiveMessage', (data: any) => {
            console.log('📨 New message:', data);

            // Parse the message data - it might come in different formats
            let message: Message;
            if (typeof data === 'string') {
              try {
                message = JSON.parse(data);
              } catch {
                message = data as any;
              }
            } else {
              message = data as Message;
            }

            updateCachedData((draft) => {
              if (Array.isArray(draft)) {
                draft.push(message);
              }
            });
          });

          connection.on('GroupCreated', (data: any) => {
            console.log('👥 Group created:', data);
            // Handle group creation if needed
          });

          connection.on('ReceiveGroupHistory', (data: any) => {
            console.log('📜 Group history received:', data);
            // Handle group history if needed
          });

          connection.onreconnecting((error) => {
            console.log('SignalR reconnecting:', error);
          });

          connection.onreconnected((connectionId) => {
            console.log('SignalR reconnected:', connectionId);
          });

          connection.onclose((error) => {
            console.log('SignalR closed:', error);
            signalRConnection = null;
          });

          await connection.start();
          console.log('✅ SignalR connected!');
          console.log('Connection state:', connection.state);
          console.log('Connection ID:', connection.connectionId);

          await cacheDataLoaded;
          console.log('Cache loaded');
        } catch (error) {
          console.error('SignalR connection error:', error);
          signalRConnection = null;
        }

        await cacheEntryRemoved;
        if (connection) {
          await connection.stop();
          signalRConnection = null;
          console.log('SignalR stopped');
        }
      },
    }),
  }),
});

export const { useGetAllMessagesQuery } = chatApi;

// Updated useSendMessage hook based on working HTML implementation
export const useSendMessage = () => {
  const sendMessage = async (
    recipientId: string,
    messageContent: { text: string },
    attachmentIds: string[] | null = null,
  ): Promise<any> => {
    if (!signalRConnection) {
      console.error('SignalR connection not available');
      throw new Error(
        'SignalR connection not available. Please wait for connection to establish.',
      );
    }

    if (signalRConnection.state !== 'Connected') {
      console.error('SignalR connection state:', signalRConnection.state);
      throw new Error(
        `SignalR connection not connected. Current state: ${signalRConnection.state}`,
      );
    }

    try {
      // Match the exact signature from working HTML: connection.invoke("SendMessage", id, { text: text }, attachmentIds)
      const result = await signalRConnection.invoke(
        'SendMessage',
        recipientId,
        messageContent,
        attachmentIds,
      );
      console.log('Message sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  return { sendMessage };
};

// Add additional hooks for other SignalR methods based on working HTML
export const useBlockUser = () => {
  const blockUser = async (
    userId: string,
    shouldBlock: boolean,
  ): Promise<void> => {
    if (!signalRConnection || signalRConnection.state !== 'Connected') {
      throw new Error('SignalR connection not available');
    }

    try {
      await signalRConnection.invoke('BlockUser', userId, shouldBlock);
      console.log(`${shouldBlock ? 'Blocked' : 'Unblocked'} user:`, userId);
    } catch (error) {
      console.error('Error blocking/unblocking user:', error);
      throw error;
    }
  };

  return { blockUser };
};

export const useCreateGroup = () => {
  const createGroup = async (
    groupName: string,
    description: string,
    members: string[],
  ): Promise<any> => {
    if (!signalRConnection || signalRConnection.state !== 'Connected') {
      throw new Error('SignalR connection not available');
    }

    try {
      const result = await signalRConnection.invoke(
        'CreateGroup',
        groupName,
        description,
        members,
      );
      console.log('Group created:', result);
      return result;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  };

  return { createGroup };
};

export const useSendGroupMessage = () => {
  const sendGroupMessage = async (
    groupId: string,
    message: string,
    attachmentIds: string[] | null = null,
  ): Promise<any> => {
    if (!signalRConnection || signalRConnection.state !== 'Connected') {
      throw new Error('SignalR connection not available');
    }

    try {
      const result = await signalRConnection.invoke(
        'SendGroupMessage',
        groupId,
        message,
        attachmentIds,
      );
      console.log('Group message sent:', result);
      return result;
    } catch (error) {
      console.error('Error sending group message:', error);
      throw error;
    }
  };

  return { sendGroupMessage };
};

export const useGetGroupHistory = () => {
  const getGroupHistory = async (groupId: string): Promise<any> => {
    if (!signalRConnection || signalRConnection.state !== 'Connected') {
      throw new Error('SignalR connection not available');
    }

    try {
      const result = await signalRConnection.invoke('GetGroupHistory', groupId);
      console.log('Group history received:', result);
      return result;
    } catch (error) {
      console.error('Error getting group history:', error);
      throw error;
    }
  };

  return { getGroupHistory };
};

export const useUpdateGroupMembers = () => {
  const updateGroupMembers = async (
    groupId: string,
    usersToAdd: string[],
    usersToRemove: string[],
  ): Promise<void> => {
    if (!signalRConnection || signalRConnection.state !== 'Connected') {
      throw new Error('SignalR connection not available');
    }

    try {
      await signalRConnection.invoke(
        'UpdateGroupMembers',
        groupId,
        usersToAdd,
        usersToRemove,
      );
      console.log('Group members updated');
    } catch (error) {
      console.error('Error updating group members:', error);
      throw error;
    }
  };

  return { updateGroupMembers };
};

export const useTypingIndicator = () => {
  const sendTypingIndicator = async (
    recipientId: string,
    isTyping: boolean,
  ): Promise<void> => {
    if (!signalRConnection || signalRConnection.state !== 'Connected') {
      throw new Error('SignalR connection not available');
    }

    try {
      await signalRConnection.invoke(
        'SendTypingIndicator',
        recipientId,
        isTyping,
      );
      console.log('Typing indicator sent:', isTyping);
    } catch (error) {
      console.error('Error sending typing indicator:', error);
      throw error;
    }
  };

  return { sendTypingIndicator };
};
