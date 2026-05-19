import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthStore } from '@/features/auth/hooks';
import { useLazyGetAllUsersQuery } from '@/features/users/api';
import type { UserData } from '@/features/users/types';
import { cn } from '@/lib/utils';
import {
  Check,
  CheckCheck,
  Lock,
  MessageSquare,
  Search,
  Send,
  UserCheck,
  Users,
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useGetAllMessagesQuery, useSendMessage } from '../api';
import type { Message } from '../types';
import moment from 'moment';

export default function ChatPage() {
  const { token, userId } = useAuthStore();
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessageText, setNewMessageText] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [getAllUsers, { data: { data: users } = { data: [] } }] =
    useLazyGetAllUsersQuery();

  // Updated query to match the correct payload structure
  const { data: messages, isLoading: isLoadingMessages } =
    useGetAllMessagesQuery(
      {
        RecipientId: selectedUser?.id || '',
        pageNumber: 1,
        pageSize: 50,
        token: token || '',
        sorts: [{ propertyName: 'createdDate', direction: 'asc' }],
      },
      { skip: !selectedUser || !token },
    );
  const { sendMessage } = useSendMessage();

  // Fetch users on mount and when search changes
  useEffect(() => {
    getAllUsers({ pageNumber: 1, pageSize: 1000, searchTerm });
  }, [searchTerm, getAllUsers]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  const handleSelectUser = (user: UserData) => {
    setSelectedUser(user);
    // Clear any previous messages when switching users
    setNewMessageText('');
  };

  const handleSendMessage = async () => {
    if (
      !newMessageText.trim() ||
      !selectedUser ||
      !userId ||
      !token ||
      isSending
    )
      return;

    setIsSending(true);
    const messageText = newMessageText.trim();

    // Clear input immediately for better UX (optimistic update)
    setNewMessageText('');

    try {
      // Updated to match the correct SignalR signature: SendMessage(recipientId, { text: message }, attachmentIds)
      await sendMessage(
        selectedUser.id,
        { text: messageText },
        null, // No attachments for now
      );

      // The useGetAllMessagesQuery will automatically show the new message via WebSocket
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Failed to send message:', error);
      // Optionally show error message to user
      // Re-add the message text so user can retry
      setNewMessageText(messageText);

      // You could also show a toast notification here
      // toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isSending) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date | string) => {
    return moment(date).format('h:mm A');
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="flex h-full bg-linear-to-br from-slate-50 to-gray-100 p-4 md:p-6 font-sans ">
      <Card className="w-full max-w-7xl mx-auto  shadow-2xl border-0 flex flex-col md:flex-row h-full max-h-[90vh] ">
        {/* LEFT PANEL: User List */}
        <div className="w-full md:w-96 border-r border-gray-200 bg-white/80 backdrop-blur-sm flex flex-col">
          <CardHeader className="pb-3 border-b border-gray-100 bg-white">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="h-5 w-5 text-indigo-500" />
              <span>Contacts</span>
              <Badge variant="secondary" className="ml-auto">
                {users?.length || 0}
              </Badge>
            </CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-9 bg-gray-50 border-gray-200 focus:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="divide-y divide-gray-100">
              {users?.map((user: UserData) => {
                if (user.id === userId) return null;
                return (
                  <div
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className={cn(
                      'flex items-center gap-3 p-4 cursor-pointer transition-all duration-200 hover:bg-indigo-50/50',
                      selectedUser?.id === user.id &&
                        'bg-indigo-50 border-l-4 border-indigo-500',
                    )}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                        <AvatarFallback
                          className={cn(
                            'text-white font-medium',
                            user.userType === 'premium'
                              ? 'bg-linear-to-br from-amber-400 to-orange-500'
                              : user.userType === 'vip'
                                ? 'bg-linear-to-br from-purple-500 to-indigo-600'
                                : 'bg-linear-to-br from-blue-400 to-cyan-500',
                          )}
                        >
                          {getUserInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      {user.status === 'online' && (
                        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-green-500" />
                      )}
                      {user.status === 'away' && (
                        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-yellow-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-800 truncate">
                          {user.name}
                        </p>
                        <div className="flex items-center gap-1">
                          {user.locked && (
                            <Lock className="h-3 w-3 text-gray-400" />
                          )}
                          {!user.isActive && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1 py-0"
                            >
                              inactive
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {user.userName ? `@${user.userName}` : user.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0 capitalize"
                        >
                          {user.userType}
                        </Badge>
                        <span
                          className={cn(
                            'text-[10px] font-medium px-1.5 py-0 rounded-full',
                            getStatusColor(user.status),
                            'bg-opacity-20 text-gray-700',
                          )}
                        >
                          {user.status || 'offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {(!users || users.length === 0) && (
                <div className="p-8 text-center text-gray-400">
                  <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No users found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* RIGHT PANEL: Chat Area */}
        <div className="flex-1 flex flex-col bg-white h-full  min-h-0">
          {!selectedUser ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
              <div className="bg-gray-50 rounded-full p-6 mb-4">
                <MessageSquare className="h-12 w-12 text-indigo-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600">
                No conversation selected
              </h3>
              <p className="text-sm text-center max-w-xs mt-2">
                Choose a user from the left panel to start a one-to-one
                conversation
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="border-b border-gray-200 px-6 py-4 bg-white/90 backdrop-blur-sm flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback
                      className={cn(
                        'text-white',
                        selectedUser.userType === 'premium'
                          ? 'bg-amber-500'
                          : selectedUser.userType === 'vip'
                            ? 'bg-purple-600'
                            : 'bg-blue-500',
                      )}
                    >
                      {getUserInitials(selectedUser?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-bold text-gray-800">
                      {selectedUser.name}
                    </h2>
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={cn(
                          'w-2 h-2 rounded-full',
                          getStatusColor(selectedUser.status),
                        )}
                      />
                      <span className="text-gray-500 capitalize">
                        {selectedUser.status || 'offline'}
                      </span>
                      {selectedUser.locked && (
                        <Lock className="h-3 w-3 text-gray-400 ml-1" />
                      )}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="gap-1">
                  <UserCheck className="h-3 w-3" />
                  {selectedUser.userType}
                </Badge>
              </div>

              {/* Messages Area */}
              {isLoadingMessages || !messages || !Array.isArray(messages) ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-pulse text-gray-400">
                      Loading messages...
                    </div>
                  </div>
                </div>
              ) : (
                <ScrollArea className="flex-1 p-6 bg-linear-to-b from-gray-50 to-white min-h-0 ">
                  <div className="space-y-4 max-w-3xl mx-auto">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-400 py-8">
                        <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-30" />
                        <p>No messages yet. Start a conversation!</p>
                      </div>
                    ) : (
                      messages.map((msg: Message, idx: number) => {
                        const isCurrentUser = msg.isSentByMe;
                        return (
                          <div
                            key={msg.id || idx}
                            className={cn(
                              'flex',
                              isCurrentUser ? 'justify-end' : 'justify-start',
                            )}
                          >
                            <div
                              className={cn(
                                'max-w-[75%] rounded-2xl px-4 py-2 shadow-sm transition-all',
                                isCurrentUser
                                  ? 'bg-indigo-600 text-white rounded-br-sm'
                                  : 'bg-gray-100 text-gray-800 rounded-bl-sm',
                              )}
                            >
                              <p className="text-sm break-words whitespace-pre-wrap">
                                {msg.message}
                              </p>
                              <div
                                className={cn(
                                  'flex items-center gap-1 mt-1 text-[10px]',
                                  isCurrentUser
                                    ? 'text-indigo-200'
                                    : 'text-gray-400',
                                )}
                              >
                                <span>{formatTime(msg.createdDate)}</span>
                                {isCurrentUser &&
                                  (msg.isRead ? (
                                    <CheckCheck className="h-3 w-3" />
                                  ) : (
                                    <Check className="h-3 w-3" />
                                  ))}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={scrollRef} />
                  </div>
                </ScrollArea>
              )}

              {/* Message Input Area */}
              <div className="border-t border-gray-200 p-4 bg-white">
                <div className="flex gap-3 items-center max-w-3xl mx-auto">
                  <Input
                    placeholder={
                      isSending ? 'Sending...' : 'Type your message...'
                    }
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                    disabled={isSending}
                  />
                  <Button
                    size="icon"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full h-10 w-10 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSendMessage}
                    disabled={!newMessageText.trim() || isSending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

function getUserInitials(name: string) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
