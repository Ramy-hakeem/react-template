import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Bell, BellOff } from 'lucide-react';
import moment from 'moment';
import React, { useState } from 'react';
import NotificationItem from './NotificationItem';
import { useGetAllNotificationsQuery } from '../api';
import { useAuthStore } from '@/features/auth/hooks';

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const token = useAuthStore().token;
  const { data: notifications, isLoading } = useGetAllNotificationsQuery({
    pageNumber: 1,
    pageSize: 10,
    searchTerm: '',
    filters: [],
    sorts: [],
    token,
  });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  const notificationList = notifications?.data || [];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full"
        >
          <Bell className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[420px] p-0 max-w-[calc(100vw-2rem)]"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Notifications</span>
            {notificationList.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {notificationList.length}
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        {/* Notifications List */}
        {notificationList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="bg-muted rounded-full p-3 mb-3">
              <BellOff className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              No notifications
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              You're all caught up!
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-[460px]">
            <div className="divide-y">
              {notificationList.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => {}} // Empty handler since we're not implementing reading
                />
              ))}
            </div>
          </ScrollArea>
        )}

        <Separator />

        {/* Footer with status */}
        <div className="px-4 py-2 bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Real-time updates
          </span>
          <span>{moment().format('HH:mm')}</span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
