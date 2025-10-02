import { useState, useEffect, useCallback } from 'react';
import { notificationService, Notification, NotificationStats } from '@/lib/notifications/notification-service';

// Hook principal para notificações
export function useNotifications(filters?: {
  isRead?: boolean;
  type?: Notification['type'];
  category?: Notification['category'];
  priority?: Notification['priority'];
  platformConfigId?: string;
  limit?: number;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getNotifications(filters);
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar notificações');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao marcar como lida');
    }
  }, []);

  const markMultipleAsRead = useCallback(async (notificationIds: string[]) => {
    try {
      await notificationService.markMultipleAsRead(notificationIds);
      setNotifications(prev => 
        prev.map(n => notificationIds.includes(n.id) ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao marcar como lidas');
    }
  }, []);

  const markAllAsRead = useCallback(async (categoryFilter?: {
    category?: Notification['category'];
    platformConfigId?: string;
  }) => {
    try {
      await notificationService.markAllAsRead(categoryFilter);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao marcar todas como lidas');
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar notificação');
    }
  }, []);

  const createNotification = useCallback(async (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    try {
      const newNotification = await notificationService.createNotification(notification);
      setNotifications(prev => [newNotification, ...prev]);
      return newNotification;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar notificação');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    // Subscrever a atualizações em tempo real
    const unsubscribe = notificationService.subscribe((updatedNotifications) => {
      setNotifications(updatedNotifications);
    });

    return unsubscribe;
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    refetch: fetchNotifications,
    markAsRead,
    markMultipleAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification
  };
}

// Hook para estatísticas de notificações
export function useNotificationStats(platformConfigId?: string) {
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getNotificationStats(platformConfigId);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  }, [platformConfigId]);

  useEffect(() => {
    fetchStats();

    // Atualizar estatísticas quando notificações mudarem
    const unsubscribe = notificationService.subscribe(() => {
      fetchStats();
    });

    return unsubscribe;
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
}

// Hook para notificações não lidas
export function useUnreadNotifications(platformConfigId?: string) {
  const { notifications, loading, error, markAsRead, markAllAsRead } = useNotifications({
    isRead: false,
    platformConfigId,
    limit: 50
  });

  const unreadCount = notifications.length;
  const hasUnread = unreadCount > 0;

  const criticalNotifications = notifications.filter(n => n.priority === 'critical');
  const highPriorityNotifications = notifications.filter(n => n.priority === 'high');

  return {
    notifications,
    unreadCount,
    hasUnread,
    criticalNotifications,
    highPriorityNotifications,
    loading,
    error,
    markAsRead,
    markAllAsRead
  };
}

// Hook para notificações por categoria
export function useNotificationsByCategory(
  category: Notification['category'],
  platformConfigId?: string
) {
  const { notifications, loading, error, ...actions } = useNotifications({
    category,
    platformConfigId,
    limit: 100
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const byPriority = {
    critical: notifications.filter(n => n.priority === 'critical'),
    high: notifications.filter(n => n.priority === 'high'),
    medium: notifications.filter(n => n.priority === 'medium'),
    low: notifications.filter(n => n.priority === 'low')
  };

  return {
    notifications,
    unreadCount,
    byPriority,
    loading,
    error,
    ...actions
  };
}

// Hook para criar alertas automáticos
export function useNotificationAlerts() {
  const [isCreatingAlert, setIsCreatingAlert] = useState(false);

  const createPerformanceAlert = useCallback(async (
    entityType: 'campaign' | 'adset' | 'ad',
    entityId: string,
    metrics: Record<string, any>,
    platformConfigId: string
  ) => {
    try {
      setIsCreatingAlert(true);
      await notificationService.checkAndCreateAlerts(
        entityType,
        entityId,
        metrics,
        platformConfigId
      );
    } catch (error) {
      console.error('Erro ao criar alerta automático:', error);
    } finally {
      setIsCreatingAlert(false);
    }
  }, []);

  const createBudgetAlert = useCallback(async (
    campaignId: string,
    currentSpend: number,
    budgetLimit: number,
    platformConfigId: string
  ) => {
    const spendPercentage = (currentSpend / budgetLimit) * 100;
    
    if (spendPercentage >= 90) {
      return notificationService.createNotification({
        title: 'Orçamento Quase Esgotado',
        message: `A campanha gastou ${spendPercentage.toFixed(1)}% do orçamento disponível.`,
        type: 'warning',
        priority: spendPercentage >= 95 ? 'critical' : 'high',
        category: 'budget',
        entityType: 'campaign',
        entityId: campaignId,
        platformConfigId,
        data: { currentSpend, budgetLimit, spendPercentage }
      });
    }
  }, []);

  const createSyncAlert = useCallback(async (
    message: string,
    type: 'error' | 'warning' | 'success',
    platformConfigId: string,
    data?: Record<string, any>
  ) => {
    return notificationService.createNotification({
      title: 'Status de Sincronização',
      message,
      type,
      priority: type === 'error' ? 'high' : 'medium',
      category: 'sync',
      platformConfigId,
      data
    });
  }, []);

  return {
    isCreatingAlert,
    createPerformanceAlert,
    createBudgetAlert,
    createSyncAlert
  };
}

// Hook para limpeza automática
export function useNotificationCleanup() {
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  const cleanupExpired = useCallback(async () => {
    try {
      setIsCleaningUp(true);
      await notificationService.cleanupExpiredNotifications();
    } catch (error) {
      console.error('Erro ao limpar notificações expiradas:', error);
    } finally {
      setIsCleaningUp(false);
    }
  }, []);

  // Limpeza automática a cada 30 minutos
  useEffect(() => {
    const interval = setInterval(cleanupExpired, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [cleanupExpired]);

  return {
    isCleaningUp,
    cleanupExpired
  };
}