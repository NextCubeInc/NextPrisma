import { useState, useEffect, useCallback } from 'react';
import { syncManager, SyncJob, SyncFilters } from '@/lib/sync/sync-manager';
import { useToast } from '@/hooks/use-toast';

export function useSyncJobs(platformConfigId: string) {
  const [jobs, setJobs] = useState<SyncJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const recentJobs = await syncManager.getRecentSyncJobs(platformConfigId);
      setJobs(recentJobs);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sync jobs');
    } finally {
      setLoading(false);
    }
  }, [platformConfigId]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = syncManager.subscribeSyncJobs(platformConfigId, (job) => {
      setJobs(prev => {
        const index = prev.findIndex(j => j.id === job.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = job;
          return updated;
        } else {
          return [job, ...prev];
        }
      });

      // Show toast for completed/failed jobs
      if (job.status === 'completed') {
        toast({
          title: 'Sync Completed',
          description: `${job.sync_type} sync completed successfully. ${job.records_synced} records synced.`,
        });
      } else if (job.status === 'failed') {
        toast({
          title: 'Sync Failed',
          description: job.error_message || 'Sync job failed',
          variant: 'destructive',
        });
      }
    });

    return unsubscribe;
  }, [platformConfigId, toast]);

  const startCampaignSync = useCallback(async (filters?: SyncFilters) => {
    try {
      const result = await syncManager.syncCampaigns(platformConfigId, filters);
      toast({
        title: 'Sync Started',
        description: 'Campaign sync job has been started',
      });
      await fetchJobs(); // Refresh jobs list
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start sync';
      toast({
        title: 'Sync Failed',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  }, [platformConfigId, toast, fetchJobs]);

  const startMetricsSync = useCallback(async (
    entityType: 'campaign' | 'adset' | 'ad',
    dateRange: { since: string; until: string },
    entityIds?: string[]
  ) => {
    try {
      const result = await syncManager.syncMetrics(
        platformConfigId,
        entityType,
        dateRange,
        entityIds
      );
      toast({
        title: 'Metrics Sync Started',
        description: `${entityType} metrics sync job has been started`,
      });
      await fetchJobs(); // Refresh jobs list
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start metrics sync';
      toast({
        title: 'Sync Failed',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  }, [platformConfigId, toast, fetchJobs]);

  const cancelJob = useCallback(async (jobId: string) => {
    try {
      await syncManager.cancelSyncJob(jobId);
      toast({
        title: 'Job Cancelled',
        description: 'Sync job has been cancelled',
      });
      await fetchJobs(); // Refresh jobs list
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to cancel job';
      toast({
        title: 'Cancel Failed',
        description: message,
        variant: 'destructive',
      });
    }
  }, [toast, fetchJobs]);

  return {
    jobs,
    loading,
    error,
    startCampaignSync,
    startMetricsSync,
    cancelJob,
    refetch: fetchJobs,
  };
}

export function useSyncStats(platformConfigId: string) {
  const [stats, setStats] = useState({
    totalJobs: 0,
    runningJobs: 0,
    completedJobs: 0,
    failedJobs: 0,
    lastSyncAt: undefined as string | undefined,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const syncStats = await syncManager.getSyncStats(platformConfigId);
      setStats(syncStats);
    } catch (err) {
      console.error('Failed to fetch sync stats:', err);
    } finally {
      setLoading(false);
    }
  }, [platformConfigId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    refetch: fetchStats,
  };
}

export function useAutoSync() {
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);
  const { toast } = useToast();

  const startAutoSync = useCallback(async () => {
    try {
      setIsAutoSyncing(true);
      await syncManager.autoSyncCampaigns();
      await syncManager.autoSyncMetrics();
      toast({
        title: 'Auto Sync Started',
        description: 'Automatic synchronization has been initiated for all platforms',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Auto sync failed';
      toast({
        title: 'Auto Sync Failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsAutoSyncing(false);
    }
  }, [toast]);

  return {
    isAutoSyncing,
    startAutoSync,
  };
}

export function useSyncJob(jobId: string | null) {
  const [job, setJob] = useState<SyncJob | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!jobId) {
      setJob(null);
      return;
    }

    const fetchJob = async () => {
      setLoading(true);
      try {
        const syncJob = await syncManager.getSyncJob(jobId);
        setJob(syncJob);
      } catch (err) {
        console.error('Failed to fetch sync job:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();

    // Poll for updates if job is running
    const interval = setInterval(() => {
      if (job?.status === 'running') {
        fetchJob();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId, job?.status]);

  return {
    job,
    loading,
  };
}