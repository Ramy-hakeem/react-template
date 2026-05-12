import moment from 'moment';
import type { Notification } from '../types';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckCheck, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const formatTime = (dateString: string): string => {
  const date = moment(dateString);
  const now = moment();

  if (now.diff(date, 'minutes') < 1) return 'Just now';
  if (now.diff(date, 'minutes') < 60)
    return `${now.diff(date, 'minutes')} min ago`;
  if (now.diff(date, 'hours') < 24)
    return `${now.diff(date, 'hours')} hour${now.diff(date, 'hours') > 1 ? 's' : ''} ago`;
  if (now.diff(date, 'days') === 1) return 'Yesterday';
  if (now.diff(date, 'days') < 7) return `${now.diff(date, 'days')} days ago`;
  if (now.diff(date, 'weeks') < 4)
    return `${now.diff(date, 'weeks')} week${now.diff(date, 'weeks') > 1 ? 's' : ''} ago`;
  if (now.diff(date, 'months') < 12) return date.format('MMM D');
  return date.format('MMM D, YYYY');
};

const NotificationItem: React.FC<{
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}> = ({ notification, onMarkAsRead }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative flex items-start gap-3 p-4 transition-all duration-200 cursor-pointer',
        'hover:bg-muted/50',
        !notification.isRead && 'bg-primary/5',
      )}
    >
      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-full" />
      )}

      {/* Status icon */}
      <div className="flex-shrink-0 mt-0.5">
        {!notification.isRead ? (
          <Circle className="h-3 w-3 text-primary fill-primary" />
        ) : (
          <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm leading-relaxed',
            !notification.isRead
              ? 'text-foreground font-medium'
              : 'text-muted-foreground',
          )}
        >
          {notification.message}
        </p>
        <span className="text-xs text-muted-foreground/70 mt-1 block">
          {formatTime(notification.CreatedAt)}
        </span>
      </div>

      {/* Actions - visible on hover */}
      <div
        className={cn(
          'flex items-center gap-1 transition-opacity duration-200',
          isHovered ? 'opacity-100' : 'opacity-0',
        )}
      >
        {!notification.isRead && (
          <Button
            onClick={handleMarkAsRead}
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            title="Mark as read"
          >
            <CheckCheck className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
