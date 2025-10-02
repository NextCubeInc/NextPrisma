import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Bell, 
  BellRing, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  MoreVertical,
  Trash2,
  Check,
  CheckCheck,
  Filter,
  TrendingDown,
  DollarSign,
  Activity,
  RefreshCw,
  Settings
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useNotifications, useNotificationStats, useUnreadNotifications } from '@/hooks/use-notifications';
import { Notification } from '@/lib/notifications/notification-service';

interface NotificationsPanelProps {
  platformConfigId?: string;
  className?: string;
}

const NOTIFICATION_ICONS = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle
};

const NOTIFICATION_COLORS = {
  info: 'text-blue-500',
  warning: 'text-yellow-500',
  error: 'text-red-500',
  success: 'text-green-500'
};

const PRIORITY_COLORS = {
  low: 'border-gray-200',
  medium: 'border-blue-200',
  high: 'border-yellow-200',
  critical: 'border-red-200'
};

const CATEGORY_ICONS = {
  campaign: Activity,
  budget: DollarSign,
  performance: TrendingDown,
  sync: RefreshCw,
  system: Settings
};

function NotificationItem({ 
  notification, 
  onMarkAsRead, 
  onDelete 
}: { 
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const Icon = NOTIFICATION_ICONS[notification.type];
  const CategoryIcon = CATEGORY_ICONS[notification.category];

  return (
    <div className={cn(
      'p-4 border rounded-lg transition-colors',
      PRIORITY_COLORS[notification.priority],
      !notification.isRead && 'bg-blue-50/50'
    )}>
      <div className="flex items-start gap-3">
        <div className={cn('mt-0.5', NOTIFICATION_COLORS[notification.type])}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className={cn(
                'font-medium text-sm',
                !notification.isRead && 'font-semibold'
              )}>
                {notification.title}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {notification.message}
              </p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!notification.isRead && (
                  <DropdownMenuItem onClick={() => onMarkAsRead(notification.id)}>
                    <Check className="w-4 h-4 mr-2" />
                    Marcar como lida
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => onDelete(notification.id)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="outline" className="text-xs">
              <CategoryIcon className="w-3 h-3 mr-1" />
              {notification.category}
            </Badge>
            
            <Badge 
              variant={notification.priority === 'critical' ? 'destructive' : 'secondary'}
              className="text-xs"
            >
              {notification.priority}
            </Badge>
            
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(notification.createdAt), { 
                addSuffix: true, 
                locale: ptBR 
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationsList({ 
  notifications, 
  loading, 
  onMarkAsRead, 
  onDelete 
}: {
  notifications: Notification[];
  loading: boolean;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg animate-pulse">
            <div className="flex gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Nenhuma notificação encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export function NotificationsPanel({ platformConfigId, className }: NotificationsPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  
  const { 
    notifications, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications({ 
    platformConfigId,
    limit: 100 
  });
  
  const { stats } = useNotificationStats(platformConfigId);
  const { unreadCount, hasUnread } = useUnreadNotifications(platformConfigId);

  // Filtrar notificações
  const filteredNotifications = notifications.filter(notification => {
    if (selectedCategory !== 'all' && notification.category !== selectedCategory) {
      return false;
    }
    if (selectedType !== 'all' && notification.type !== selectedType) {
      return false;
    }
    return true;
  });

  const handleMarkAllAsRead = () => {
    markAllAsRead({ 
      category: selectedCategory !== 'all' ? selectedCategory as any : undefined,
      platformConfigId 
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {hasUnread ? (
              <BellRing className="w-5 h-5 text-blue-500" />
            ) : (
              <Bell className="w-5 h-5" />
            )}
            Notificações
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSelectedCategory('all')}>
                  Todas as categorias
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem onClick={() => setSelectedCategory('campaign')}>
                  <Activity className="w-4 h-4 mr-2" />
                  Campanhas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCategory('budget')}>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Orçamento
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCategory('performance')}>
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Performance
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCategory('sync')}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sincronização
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                <CheckCheck className="w-4 h-4 mr-2" />
                Marcar todas como lidas
              </Button>
            )}
          </div>
        </div>
        
        {stats && (
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Total: {stats.total}</span>
            <span>Não lidas: {stats.unread}</span>
            <span>Críticas: {stats.byPriority.critical}</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <Tabs value={selectedType} onValueChange={setSelectedType}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="error">Erros</TabsTrigger>
            <TabsTrigger value="warning">Avisos</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="success">Sucesso</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedType} className="mt-4">
            <ScrollArea className="h-[400px]">
              <NotificationsList
                notifications={filteredNotifications}
                loading={loading}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Componente compacto para mostrar notificações na barra superior
export function NotificationsBell({ platformConfigId }: { platformConfigId?: string }) {
  const { unreadCount, hasUnread, criticalNotifications } = useUnreadNotifications(platformConfigId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          {hasUnread ? (
            <BellRing className="w-5 h-5" />
          ) : (
            <Bell className="w-5 h-5" />
          )}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Notificações</DialogTitle>
        </DialogHeader>
        
        <NotificationsPanel platformConfigId={platformConfigId} />
      </DialogContent>
    </Dialog>
  );
}