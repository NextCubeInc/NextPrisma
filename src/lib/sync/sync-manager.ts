import { supabase } from '@/lib/supabase';

export interface SyncJob {
  id: string;
  platform_config_id: string;
  sync_type: 'campaigns' | 'adsets' | 'ads' | 'creatives' | 'metrics';
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at?: string;
  completed_at?: string;
  records_synced?: number;
  error_message?: string;
  filters?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SyncFilters {
  date_preset?: string;
  time_range?: {
    since: string;
    until: string;
  };
  entity_ids?: string[];
}

export class SyncManager {
  private static instance: SyncManager;

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  /**
   * Start a sync job for campaigns
   */
  async syncCampaigns(
    platformConfigId: string,
    filters?: SyncFilters
  ): Promise<{ jobId: string; success: boolean }> {
    try {
      const { data, error } = await supabase.functions.invoke('sync-meta-campaigns', {
        body: {
          platform_config_id: platformConfigId,
          sync_type: 'campaigns',
          filters,
        },
      });

      if (error) throw error;

      return {
        jobId: data.job_id,
        success: data.success,
      };
    } catch (error) {
      console.error('Failed to start campaign sync:', error);
      throw error;
    }
  }

  /**
   * Start a sync job for metrics
   */
  async syncMetrics(
    platformConfigId: string,
    entityType: 'campaign' | 'adset' | 'ad',
    dateRange: { since: string; until: string },
    entityIds?: string[]
  ): Promise<{ jobId: string; success: boolean }> {
    try {
      const { data, error } = await supabase.functions.invoke('sync-meta-metrics', {
        body: {
          platform_config_id: platformConfigId,
          entity_type: entityType,
          entity_ids: entityIds,
          date_range: dateRange,
        },
      });

      if (error) throw error;

      return {
        jobId: data.job_id,
        success: data.success,
      };
    } catch (error) {
      console.error('Failed to start metrics sync:', error);
      throw error;
    }
  }

  /**
   * Get sync job status
   */
  async getSyncJob(jobId: string): Promise<SyncJob | null> {
    try {
      const { data, error } = await supabase
        .from('sync_jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to get sync job:', error);
      return null;
    }
  }

  /**
   * Get recent sync jobs for a platform configuration
   */
  async getRecentSyncJobs(
    platformConfigId: string,
    limit: number = 10
  ): Promise<SyncJob[]> {
    try {
      const { data, error } = await supabase
        .from('sync_jobs')
        .select('*')
        .eq('platform_config_id', platformConfigId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get recent sync jobs:', error);
      return [];
    }
  }

  /**
   * Get sync jobs by status
   */
  async getSyncJobsByStatus(
    status: SyncJob['status'],
    platformConfigId?: string
  ): Promise<SyncJob[]> {
    try {
      let query = supabase
        .from('sync_jobs')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (platformConfigId) {
        query = query.eq('platform_config_id', platformConfigId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get sync jobs by status:', error);
      return [];
    }
  }

  /**
   * Cancel a running sync job
   */
  async cancelSyncJob(jobId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('sync_jobs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_message: 'Cancelled by user',
        })
        .eq('id', jobId)
        .eq('status', 'running');

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to cancel sync job:', error);
      return false;
    }
  }

  /**
   * Auto-sync campaigns for all active platform configurations
   */
  async autoSyncCampaigns(): Promise<void> {
    try {
      // Get all active platform configurations
      const { data: configs, error } = await supabase
        .from('platform_configurations')
        .select('id, platform')
        .eq('is_active', true);

      if (error) throw error;

      // Start sync jobs for each configuration
      for (const config of configs || []) {
        if (config.platform === 'meta') {
          await this.syncCampaigns(config.id, {
            date_preset: 'last_7_days',
          });
        }
        // Add other platforms as needed
      }
    } catch (error) {
      console.error('Failed to auto-sync campaigns:', error);
    }
  }

  /**
   * Auto-sync metrics for recent campaigns
   */
  async autoSyncMetrics(): Promise<void> {
    try {
      // Get all active platform configurations
      const { data: configs, error } = await supabase
        .from('platform_configurations')
        .select('id, platform')
        .eq('is_active', true);

      if (error) throw error;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateRange = {
        since: yesterday.toISOString().split('T')[0],
        until: yesterday.toISOString().split('T')[0],
      };

      // Start metrics sync for each configuration
      for (const config of configs || []) {
        if (config.platform === 'meta') {
          await this.syncMetrics(config.id, 'campaign', dateRange);
          await this.syncMetrics(config.id, 'adset', dateRange);
          await this.syncMetrics(config.id, 'ad', dateRange);
        }
        // Add other platforms as needed
      }
    } catch (error) {
      console.error('Failed to auto-sync metrics:', error);
    }
  }

  /**
   * Get sync statistics for dashboard
   */
  async getSyncStats(platformConfigId: string): Promise<{
    totalJobs: number;
    runningJobs: number;
    completedJobs: number;
    failedJobs: number;
    lastSyncAt?: string;
  }> {
    try {
      const { data: jobs, error } = await supabase
        .from('sync_jobs')
        .select('status, completed_at')
        .eq('platform_config_id', platformConfigId);

      if (error) throw error;

      const stats = {
        totalJobs: jobs?.length || 0,
        runningJobs: jobs?.filter(j => j.status === 'running').length || 0,
        completedJobs: jobs?.filter(j => j.status === 'completed').length || 0,
        failedJobs: jobs?.filter(j => j.status === 'failed').length || 0,
        lastSyncAt: undefined as string | undefined,
      };

      // Get last completed sync
      const completedJobs = jobs?.filter(j => j.status === 'completed' && j.completed_at);
      if (completedJobs && completedJobs.length > 0) {
        stats.lastSyncAt = completedJobs
          .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())[0]
          .completed_at!;
      }

      return stats;
    } catch (error) {
      console.error('Failed to get sync stats:', error);
      return {
        totalJobs: 0,
        runningJobs: 0,
        completedJobs: 0,
        failedJobs: 0,
      };
    }
  }

  /**
   * Subscribe to sync job updates
   */
  subscribeSyncJobs(
    platformConfigId: string,
    callback: (job: SyncJob) => void
  ): () => void {
    const subscription = supabase
      .channel('sync_jobs')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sync_jobs',
          filter: `platform_config_id=eq.${platformConfigId}`,
        },
        (payload) => {
          callback(payload.new as SyncJob);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }
}

export const syncManager = SyncManager.getInstance();