import { supabase } from '@/lib/supabase';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'campaign' | 'budget' | 'performance' | 'sync' | 'system';
  entityType?: 'campaign' | 'adset' | 'ad';
  entityId?: string;
  platformConfigId?: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface NotificationRule {
  id: string;
  name: string;
  description: string;
  category: Notification['category'];
  type: Notification['type'];
  priority: Notification['priority'];
  isActive: boolean;
  conditions: NotificationCondition[];
  actions: NotificationAction[];
  cooldownMinutes?: number;
  platformConfigId?: string;
}

export interface NotificationCondition {
  field: string;
  operator: 'gt' | 'lt' | 'gte' | 'lte' | 'eq' | 'ne' | 'contains' | 'not_contains';
  value: any;
  threshold?: number;
}

export interface NotificationAction {
  type: 'create_notification' | 'send_email' | 'send_webhook';
  config: Record<string, any>;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<Notification['type'], number>;
  byCategory: Record<Notification['category'], number>;
  byPriority: Record<Notification['priority'], number>;
}

class NotificationService {
  private static instance: NotificationService;
  private subscribers: Set<(notifications: Notification[]) => void> = new Set();
  private cache: Map<string, Notification[]> = new Map();
  private lastFetch: number = 0;
  private readonly CACHE_TTL = 30000; // 30 segundos

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Buscar notificações
  async getNotifications(filters?: {
    isRead?: boolean;
    type?: Notification['type'];
    category?: Notification['category'];
    priority?: Notification['priority'];
    platformConfigId?: string;
    limit?: number;
    offset?: number;
  }): Promise<Notification[]> {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.isRead !== undefined) {
        query = query.eq('is_read', filters.isRead);
      }

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }

      if (filters?.platformConfigId) {
        query = query.eq('platform_config_id', filters.platformConfigId);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(this.mapNotification) || [];
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      throw error;
    }
  }

  // Criar notificação
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Promise<Notification> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          title: notification.title,
          message: notification.message,
          type: notification.type,
          priority: notification.priority,
          category: notification.category,
          entity_type: notification.entityType,
          entity_id: notification.entityId,
          platform_config_id: notification.platformConfigId,
          data: notification.data,
          expires_at: notification.expiresAt,
          is_read: false
        })
        .select()
        .single();

      if (error) throw error;

      const newNotification = this.mapNotification(data);
      this.notifySubscribers();
      return newNotification;
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      throw error;
    }
  }

  // Marcar como lida
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      this.notifySubscribers();
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      throw error;
    }
  }

  // Marcar múltiplas como lidas
  async markMultipleAsRead(notificationIds: string[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .in('id', notificationIds);

      if (error) throw error;

      this.notifySubscribers();
    } catch (error) {
      console.error('Erro ao marcar notificações como lidas:', error);
      throw error;
    }
  }

  // Marcar todas como lidas
  async markAllAsRead(filters?: {
    category?: Notification['category'];
    platformConfigId?: string;
  }): Promise<void> {
    try {
      let query = supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.platformConfigId) {
        query = query.eq('platform_config_id', filters.platformConfigId);
      }

      const { error } = await query;

      if (error) throw error;

      this.notifySubscribers();
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
      throw error;
    }
  }

  // Deletar notificação
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      this.notifySubscribers();
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      throw error;
    }
  }

  // Limpar notificações expiradas
  async cleanupExpiredNotifications(): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .lt('expires_at', new Date().toISOString());

      if (error) throw error;

      this.notifySubscribers();
    } catch (error) {
      console.error('Erro ao limpar notificações expiradas:', error);
      throw error;
    }
  }

  // Estatísticas das notificações
  async getNotificationStats(platformConfigId?: string): Promise<NotificationStats> {
    try {
      let query = supabase
        .from('notifications')
        .select('type, category, priority, is_read');

      if (platformConfigId) {
        query = query.eq('platform_config_id', platformConfigId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const stats: NotificationStats = {
        total: data?.length || 0,
        unread: data?.filter(n => !n.is_read).length || 0,
        byType: {
          info: 0,
          warning: 0,
          error: 0,
          success: 0
        },
        byCategory: {
          campaign: 0,
          budget: 0,
          performance: 0,
          sync: 0,
          system: 0
        },
        byPriority: {
          low: 0,
          medium: 0,
          high: 0,
          critical: 0
        }
      };

      data?.forEach(notification => {
        stats.byType[notification.type as Notification['type']]++;
        stats.byCategory[notification.category as Notification['category']]++;
        stats.byPriority[notification.priority as Notification['priority']]++;
      });

      return stats;
    } catch (error) {
      console.error('Erro ao buscar estatísticas de notificações:', error);
      throw error;
    }
  }

  // Subscrever a atualizações em tempo real
  subscribe(callback: (notifications: Notification[]) => void): () => void {
    this.subscribers.add(callback);

    // Configurar subscription do Supabase
    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'notifications' },
        () => {
          this.notifySubscribers();
        }
      )
      .subscribe();

    return () => {
      this.subscribers.delete(callback);
      subscription.unsubscribe();
    };
  }

  // Verificar e criar alertas automáticos
  async checkAndCreateAlerts(
    entityType: 'campaign' | 'adset' | 'ad',
    entityId: string,
    metrics: Record<string, any>,
    platformConfigId: string
  ): Promise<void> {
    try {
      const rules = await this.getActiveNotificationRules(platformConfigId);

      for (const rule of rules) {
        if (this.evaluateConditions(rule.conditions, metrics)) {
          // Verificar cooldown
          if (await this.isInCooldown(rule.id, entityId)) {
            continue;
          }

          // Executar ações
          for (const action of rule.actions) {
            if (action.type === 'create_notification') {
              await this.createNotification({
                title: action.config.title || rule.name,
                message: action.config.message || rule.description,
                type: rule.type,
                priority: rule.priority,
                category: rule.category,
                entityType,
                entityId,
                platformConfigId,
                data: { metrics, ruleId: rule.id }
              });
            }
          }

          // Registrar cooldown
          await this.setCooldown(rule.id, entityId, rule.cooldownMinutes || 60);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar alertas automáticos:', error);
    }
  }

  // Métodos privados
  private mapNotification(data: any): Notification {
    return {
      id: data.id,
      title: data.title,
      message: data.message,
      type: data.type,
      priority: data.priority,
      category: data.category,
      entityType: data.entity_type,
      entityId: data.entity_id,
      platformConfigId: data.platform_config_id,
      data: data.data,
      isRead: data.is_read,
      createdAt: data.created_at,
      expiresAt: data.expires_at
    };
  }

  private async notifySubscribers(): Promise<void> {
    try {
      const notifications = await this.getNotifications({ limit: 50 });
      this.subscribers.forEach(callback => callback(notifications));
    } catch (error) {
      console.error('Erro ao notificar subscribers:', error);
    }
  }

  private async getActiveNotificationRules(platformConfigId: string): Promise<NotificationRule[]> {
    try {
      const { data, error } = await supabase
        .from('notification_rules')
        .select('*')
        .eq('is_active', true)
        .or(`platform_config_id.eq.${platformConfigId},platform_config_id.is.null`);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar regras de notificação:', error);
      return [];
    }
  }

  private evaluateConditions(conditions: NotificationCondition[], metrics: Record<string, any>): boolean {
    return conditions.every(condition => {
      const value = metrics[condition.field];
      if (value === undefined) return false;

      switch (condition.operator) {
        case 'gt': return value > condition.value;
        case 'lt': return value < condition.value;
        case 'gte': return value >= condition.value;
        case 'lte': return value <= condition.value;
        case 'eq': return value === condition.value;
        case 'ne': return value !== condition.value;
        case 'contains': return String(value).includes(String(condition.value));
        case 'not_contains': return !String(value).includes(String(condition.value));
        default: return false;
      }
    });
  }

  private async isInCooldown(ruleId: string, entityId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('notification_cooldowns')
        .select('expires_at')
        .eq('rule_id', ruleId)
        .eq('entity_id', entityId)
        .gt('expires_at', new Date().toISOString())
        .single();

      return !error && !!data;
    } catch (error) {
      return false;
    }
  }

  private async setCooldown(ruleId: string, entityId: string, minutes: number): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + minutes * 60 * 1000).toISOString();

      await supabase
        .from('notification_cooldowns')
        .upsert({
          rule_id: ruleId,
          entity_id: entityId,
          expires_at: expiresAt
        });
    } catch (error) {
      console.error('Erro ao definir cooldown:', error);
    }
  }
}

export const notificationService = NotificationService.getInstance();