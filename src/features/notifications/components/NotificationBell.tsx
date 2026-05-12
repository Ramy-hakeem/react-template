import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Bell, BellOff, CheckCheck, CheckCircle2 } from 'lucide-react';
import moment from 'moment';
import React, { useState } from 'react';
import NotificationItem from './NotificationItem';
import type { Notification } from '../types';

// Dummy data
const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    message: "Welcome to the platform! We're glad to have you.",
    isRead: false,
    CreatedAt: moment().subtract(5, 'minutes').toISOString(),
  },
  {
    id: '2',
    message: 'Your profile has been successfully updated.',
    isRead: false,
    CreatedAt: moment().subtract(30, 'minutes').toISOString(),
  },
  {
    id: '3',
    message: 'New user John Doe has registered on the platform.',
    isRead: false,
    CreatedAt: moment().subtract(2, 'hours').toISOString(),
  },
  {
    id: '4',
    message: 'System maintenance scheduled for tonight at 2 AM.',
    isRead: true,
    CreatedAt: moment().subtract(1, 'day').toISOString(),
  },
  {
    id: '5',
    message: 'Your password will expire in 3 days. Please update it.',
    isRead: true,
    CreatedAt: moment().subtract(3, 'days').toISOString(),
  },
  {
    id: '6',
    message: 'New feature released: Check out the new dashboard!',
    isRead: false,
    CreatedAt: moment().subtract(10, 'minutes').toISOString(),
  },
  {
    id: '7',
    message: 'You have a new message from support team.',
    isRead: true,
    CreatedAt: moment().subtract(5, 'days').toISOString(),
  },
  {
    id: '8',
    message: 'Your subscription will renew tomorrow.',
    isRead: false,
    CreatedAt: moment().subtract(45, 'minutes').toISOString(),
  },
  {
    id: '9',
    message: 'Security alert: New login detected from Chrome on Windows.',
    isRead: false,
    CreatedAt: moment().subtract(15, 'minutes').toISOString(),
  },
  {
    id: '10',
    message: 'Your report is ready for download.',
    isRead: true,
    CreatedAt: moment().subtract(2, 'days').toISOString(),
  },
];

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<Notification[]>(DUMMY_NOTIFICATIONS);
  const [isAnimating, setIsAnimating] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const displayedNotifications = notifications.slice(0, 10);
  const hasMore = notifications.length > 10;

  // Mark a single notification as read
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif,
      ),
    );
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true })),
    );
  };

  // Simulate real-time notification (for demo)
  const addDemoNotification = () => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      message: `New notification at ${moment().format('HH:mm:ss')}`,
      isRead: false,
      CreatedAt: moment().toISOString(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full"
        >
          <Bell className="h-5 w-5" />

          {/* Unread count badge */}
          {unreadCount > 0 && (
            <Badge
              className={cn(
                'absolute -top-1 -right-1 h-5 min-w-[20px] px-1 bg-destructive text-white text-xs font-medium rounded-full flex items-center justify-center',
                isAnimating && 'animate-pulse',
              )}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[420px] p-0 max-w-[calc(100vw-2rem)]"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="font-semibold text-base">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {unreadCount} unread{' '}
                {unreadCount === 1 ? 'notification' : 'notifications'}
              </p>
            )}
            {unreadCount === 0 && notifications.length > 0 && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                All caught up
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Demo button to add new notification (for testing) */}
            <Button
              variant="outline"
              size="sm"
              onClick={addDemoNotification}
              className="h-8 text-xs"
            >
              Add Demo
            </Button>

            {notifications.length > 0 && unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="h-8 gap-1 text-xs"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Notifications List */}
        {notifications.length === 0 ? (
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
          <>
            <ScrollArea className="max-h-[460px]">
              <div className="divide-y">
                {displayedNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))}
              </div>
            </ScrollArea>

            {/* View all link */}
            {hasMore && (
              <>
                <Separator />
                <div className="p-3">
                  <Button
                    variant="ghost"
                    className="w-full text-sm"
                    onClick={() => {
                      console.log('View all notifications');
                      setIsOpen(false);
                    }}
                  >
                    View all {notifications.length} notifications →
                  </Button>
                </div>
              </>
            )}
          </>
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
