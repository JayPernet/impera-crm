import { Bell, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  Notification,
} from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

function NotificationItem({
  notification,
  onRead,
}: {
  notification: Notification;
  onRead: () => void;
}) {
  const navigate = useNavigate();
  const markRead = useMarkNotificationRead();

  const handleClick = () => {
    if (!notification.read) {
      markRead.mutate(notification.id);
    }
    if (notification.link_url) {
      navigate(notification.link_url);
    }
    onRead();
  };

  const typeColors = {
    success: "bg-green-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full text-left p-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0",
        !notification.read && "bg-primary/5"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Unread indicator */}
        <div className="pt-1.5">
          {!notification.read ? (
            <div className={cn("w-2 h-2 rounded-full", typeColors[notification.type])} />
          ) : (
            <div className="w-2 h-2" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn("text-sm", !notification.read && "font-semibold")}>
            {notification.title}
          </p>
          {notification.message && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
              {notification.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(notification.created_at), {
              addSuffix: true,
              locale: ptBR,
            })}
          </p>
        </div>
      </div>
    </button>
  );
}

export function NotificationsPopover() {
  const { notifications, unreadCount, isLoading } = useNotifications();
  const markAllRead = useMarkAllNotificationsRead();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          <h4 className="font-semibold text-sm">Notificações</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
            >
              <CheckCheck className="w-3.5 h-3.5 mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </div>

        {/* Notifications list */}
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Carregando...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                Nenhuma notificação
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={() => {}}
              />
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
