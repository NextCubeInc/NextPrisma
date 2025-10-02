// Hooks React para gerenciamento de anúncios

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getAdsService } from '@/lib/ads/ads-service';
import { 
  AdPlatform, 
  Campaign, 
  AdSet, 
  Ad, 
  Creative, 
  AdMetrics,
  PlatformConfig,
  SyncJob,
  LimitCheckResult
} from '@/types/ads';
import {
  CampaignCreateData,
  AdSetCreateData,
  AdCreateData,
  CreativeCreateData,
  MetricsQuery
} from '@/lib/ads/adapters/base';

// Hook principal para gerenciamento de anúncios
export function useAds(accountId: string) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adsService = user ? getAdsService(user.id) : null;

  const handleAsync = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T | null> => {
    if (!adsService) {
      setError('User not authenticated');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await operation();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Ads operation error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [adsService]);

  return {
    adsService,
    isLoading,
    error,
    handleAsync,
    clearError: () => setError(null)
  };
}

// Hook para campanhas
export function useCampaigns(accountId: string, platform?: AdPlatform) {
  const { adsService, isLoading, error, handleAsync, clearError } = useAds(accountId);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCampaigns = useCallback(async () => {
    if (!adsService) return;

    setRefreshing(true);
    const result = await handleAsync(() => adsService.getCampaigns(accountId, platform));
    if (result) {
      setCampaigns(result);
    }
    setRefreshing(false);
  }, [adsService, accountId, platform, handleAsync]);

  const createCampaign = useCallback(async (
    platform: AdPlatform,
    data: CampaignCreateData
  ): Promise<Campaign | null> => {
    const result = await handleAsync(() => adsService!.createCampaign(accountId, platform, data));
    if (result) {
      setCampaigns(prev => [result, ...prev]);
    }
    return result;
  }, [adsService, accountId, handleAsync]);

  const updateCampaign = useCallback(async (
    campaignId: string,
    data: Partial<CampaignCreateData>
  ): Promise<Campaign | null> => {
    const result = await handleAsync(() => adsService!.updateCampaign(campaignId, data));
    if (result) {
      setCampaigns(prev => prev.map(c => c.id === campaignId ? result : c));
    }
    return result;
  }, [adsService, handleAsync]);

  const deleteCampaign = useCallback(async (campaignId: string): Promise<boolean> => {
    const result = await handleAsync(() => adsService!.deleteCampaign(campaignId));
    if (result) {
      setCampaigns(prev => prev.filter(c => c.id !== campaignId));
    }
    return result || false;
  }, [adsService, handleAsync]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return {
    campaigns,
    isLoading: isLoading || refreshing,
    error,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    refresh: fetchCampaigns,
    clearError
  };
}

// Hook para conjuntos de anúncios
export function useAdSets(campaignId?: string, accountId?: string, platform?: AdPlatform) {
  const { adsService, isLoading, error, handleAsync, clearError } = useAds(accountId || '');
  const [adSets, setAdSets] = useState<AdSet[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAdSets = useCallback(async () => {
    if (!adsService) return;

    setRefreshing(true);
    const result = await handleAsync(() => adsService.getAdSets(campaignId, accountId, platform));
    if (result) {
      setAdSets(result);
    }
    setRefreshing(false);
  }, [adsService, campaignId, accountId, platform, handleAsync]);

  const createAdSet = useCallback(async (
    accountId: string,
    platform: AdPlatform,
    data: AdSetCreateData
  ): Promise<AdSet | null> => {
    const result = await handleAsync(() => adsService!.createAdSet(accountId, platform, data));
    if (result) {
      setAdSets(prev => [result, ...prev]);
    }
    return result;
  }, [adsService, handleAsync]);

  useEffect(() => {
    fetchAdSets();
  }, [fetchAdSets]);

  return {
    adSets,
    isLoading: isLoading || refreshing,
    error,
    createAdSet,
    refresh: fetchAdSets,
    clearError
  };
}

// Hook para anúncios
export function useAdsList(adSetId?: string, accountId?: string, platform?: AdPlatform) {
  const { adsService, isLoading, error, handleAsync, clearError } = useAds(accountId || '');
  const [ads, setAds] = useState<Ad[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAds = useCallback(async () => {
    if (!adsService) return;

    setRefreshing(true);
    const result = await handleAsync(() => adsService.getAds(adSetId, accountId, platform));
    if (result) {
      setAds(result);
    }
    setRefreshing(false);
  }, [adsService, adSetId, accountId, platform, handleAsync]);

  const createAd = useCallback(async (
    accountId: string,
    platform: AdPlatform,
    data: AdCreateData
  ): Promise<Ad | null> => {
    const result = await handleAsync(() => adsService!.createAd(accountId, platform, data));
    if (result) {
      setAds(prev => [result, ...prev]);
    }
    return result;
  }, [adsService, handleAsync]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  return {
    ads,
    isLoading: isLoading || refreshing,
    error,
    createAd,
    refresh: fetchAds,
    clearError
  };
}

// Hook para criativos
export function useCreatives(accountId: string, platform?: AdPlatform) {
  const { adsService, isLoading, error, handleAsync, clearError } = useAds(accountId);
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCreatives = useCallback(async () => {
    if (!adsService) return;

    setRefreshing(true);
    const result = await handleAsync(() => adsService.getCreatives(accountId, platform));
    if (result) {
      setCreatives(result);
    }
    setRefreshing(false);
  }, [adsService, accountId, platform, handleAsync]);

  const createCreative = useCallback(async (
    platform: AdPlatform,
    data: CreativeCreateData
  ): Promise<Creative | null> => {
    const result = await handleAsync(() => adsService!.createCreative(accountId, platform, data));
    if (result) {
      setCreatives(prev => [result, ...prev]);
    }
    return result;
  }, [adsService, accountId, handleAsync]);

  useEffect(() => {
    fetchCreatives();
  }, [fetchCreatives]);

  return {
    creatives,
    isLoading: isLoading || refreshing,
    error,
    createCreative,
    refresh: fetchCreatives,
    clearError
  };
}

// Hook para métricas
export function useMetrics(
  accountId: string,
  platform: AdPlatform,
  query: MetricsQuery,
  entityId?: string,
  entityType?: 'campaign' | 'adset' | 'ad'
) {
  const { adsService, isLoading, error, handleAsync, clearError } = useAds(accountId);
  const [metrics, setMetrics] = useState<AdMetrics[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMetrics = useCallback(async () => {
    if (!adsService) return;

    setRefreshing(true);
    const result = await handleAsync(() => 
      adsService.getMetrics(accountId, platform, query, entityId, entityType)
    );
    if (result) {
      setMetrics(result);
    }
    setRefreshing(false);
  }, [adsService, accountId, platform, query, entityId, entityType, handleAsync]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    isLoading: isLoading || refreshing,
    error,
    refresh: fetchMetrics,
    clearError
  };
}

// Hook para configurações de plataforma
export function usePlatformConfig(accountId: string, platform: AdPlatform) {
  const { adsService, isLoading, error, handleAsync, clearError } = useAds(accountId);
  const [config, setConfig] = useState<PlatformConfig | null>(null);

  const fetchConfig = useCallback(async () => {
    if (!adsService) return;

    const result = await handleAsync(() => adsService.getPlatformConfig(accountId, platform));
    if (result) {
      setConfig(result);
    }
  }, [adsService, accountId, platform, handleAsync]);

  const saveConfig = useCallback(async (
    configData: Omit<PlatformConfig, 'id' | 'created_at' | 'updated_at'>
  ): Promise<PlatformConfig | null> => {
    const result = await handleAsync(() => adsService!.savePlatformConfig(configData));
    if (result) {
      setConfig(result);
    }
    return result;
  }, [adsService, handleAsync]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return {
    config,
    isLoading,
    error,
    saveConfig,
    refresh: fetchConfig,
    clearError
  };
}

// Hook para jobs de sincronização
export function useSyncJobs(accountId: string, platform?: AdPlatform) {
  const { adsService, isLoading, error, handleAsync, clearError } = useAds(accountId);
  const [syncJobs, setSyncJobs] = useState<SyncJob[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSyncJobs = useCallback(async () => {
    if (!adsService) return;

    setRefreshing(true);
    const result = await handleAsync(() => adsService.getSyncJobs(accountId, platform));
    if (result) {
      setSyncJobs(result);
    }
    setRefreshing(false);
  }, [adsService, accountId, platform, handleAsync]);

  const startSync = useCallback(async (
    platform: AdPlatform,
    syncType: 'full' | 'incremental' = 'incremental'
  ): Promise<SyncJob | null> => {
    const result = await handleAsync(() => adsService!.syncPlatformData(accountId, platform, syncType));
    if (result) {
      setSyncJobs(prev => [result, ...prev]);
    }
    return result;
  }, [adsService, accountId, handleAsync]);

  useEffect(() => {
    fetchSyncJobs();
  }, [fetchSyncJobs]);

  return {
    syncJobs,
    isLoading: isLoading || refreshing,
    error,
    startSync,
    refresh: fetchSyncJobs,
    clearError
  };
}

// Hook para verificação de limites
export function useLimits(accountId: string, platform: AdPlatform) {
  const { adsService, isLoading, error, handleAsync, clearError } = useAds(accountId);

  const checkLimits = useCallback(async (
    type: 'campaign' | 'adset' | 'ad' | 'creative'
  ): Promise<LimitCheckResult | null> => {
    if (!adsService) return null;
    return await handleAsync(() => adsService.checkLimits(accountId, platform, type));
  }, [adsService, accountId, platform, handleAsync]);

  return {
    checkLimits,
    isLoading,
    error,
    clearError
  };
}

// Hook para opções de targeting e configurações
export function useTargetingOptions(accountId: string, platform: AdPlatform) {
  const { adsService, isLoading, error, handleAsync, clearError } = useAds(accountId);
  const [objectives, setObjectives] = useState<string[]>([]);
  const [targetingOptions, setTargetingOptions] = useState<Record<string, any[]>>({});

  const getObjectives = useCallback(async () => {
    if (!adsService) return;

    const result = await handleAsync(() => adsService.getObjectives(platform));
    if (result) {
      setObjectives(result);
    }
  }, [adsService, platform, handleAsync]);

  const getOptimizationGoals = useCallback(async (objective: string): Promise<string[]> => {
    if (!adsService) return [];
    const result = await handleAsync(() => adsService.getOptimizationGoals(platform, objective));
    return result || [];
  }, [adsService, platform, handleAsync]);

  const getTargetingOptions = useCallback(async (type: string): Promise<any[]> => {
    if (!adsService) return [];
    
    // Verificar cache
    if (targetingOptions[type]) {
      return targetingOptions[type];
    }

    const result = await handleAsync(() => adsService.getTargetingOptions(accountId, platform, type));
    if (result) {
      setTargetingOptions(prev => ({ ...prev, [type]: result }));
      return result;
    }
    return [];
  }, [adsService, accountId, platform, targetingOptions, handleAsync]);

  useEffect(() => {
    getObjectives();
  }, [getObjectives]);

  return {
    objectives,
    getOptimizationGoals,
    getTargetingOptions,
    isLoading,
    error,
    clearError
  };
}