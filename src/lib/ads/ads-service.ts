// Serviço principal para gerenciamento de anúncios multi-plataforma

import { supabase } from '@/lib/supabase';
import { 
  AdapterFactory, 
  BaseAdAdapter, 
  LimitChecker,
  CampaignCreateData,
  AdSetCreateData,
  AdCreateData,
  CreativeCreateData,
  MetricsQuery
} from './adapters/base';
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

export class AdsService {
  private adapters: Map<string, BaseAdAdapter> = new Map();
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  // Inicialização e configuração
  async initializePlatform(accountId: string, platform: AdPlatform): Promise<BaseAdAdapter> {
    const cacheKey = `${accountId}_${platform}`;
    
    if (this.adapters.has(cacheKey)) {
      return this.adapters.get(cacheKey)!;
    }

    try {
      // Buscar configuração da plataforma
      const config = await this.getPlatformConfig(accountId, platform);
      if (!config) {
        throw new Error(`Platform configuration not found for ${platform}`);
      }

      // Criar adaptador
      const adapter = await AdapterFactory.createAdapter(platform, accountId, config.api_config);
      
      // Validar configuração da API
      const isValid = await adapter.validateApiConfig();
      if (!isValid) {
        throw new Error(`Invalid API configuration for ${platform}`);
      }

      this.adapters.set(cacheKey, adapter);
      return adapter;
    } catch (error) {
      console.error(`Failed to initialize ${platform} adapter:`, error);
      throw error;
    }
  }

  async getPlatformConfig(accountId: string, platform: AdPlatform): Promise<PlatformConfig | null> {
    try {
      const { data, error } = await supabase
        .from('platform_configs')
        .select('*')
        .eq('account_id', accountId)
        .eq('platform', platform)
        .eq('status', 'ACTIVE')
        .single();

      if (error) {
        console.error('Error fetching platform config:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getPlatformConfig:', error);
      return null;
    }
  }

  async savePlatformConfig(config: Omit<PlatformConfig, 'id' | 'created_at' | 'updated_at'>): Promise<PlatformConfig> {
    try {
      const { data, error } = await supabase
        .from('platform_configs')
        .upsert({
          ...config,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'account_id,platform'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving platform config:', error);
      throw error;
    }
  }

  // Campanhas
  async createCampaign(
    accountId: string, 
    platform: AdPlatform, 
    data: CampaignCreateData
  ): Promise<Campaign> {
    // Verificar limites
    const limitCheck = await LimitChecker.checkLimits(this.userId, accountId, platform, 'campaign');
    if (!limitCheck.allowed) {
      throw new Error(`Campaign limit exceeded. Current: ${limitCheck.current}, Limit: ${limitCheck.limit}`);
    }

    const adapter = await this.initializePlatform(accountId, platform);
    
    try {
      // Criar campanha na plataforma
      const platformCampaign = await adapter.createCampaign(data);
      
      // Salvar no Supabase
      const { data: savedCampaign, error } = await supabase
        .from('ads_campaigns')
        .insert({
          account_id: accountId,
          platform,
          platform_campaign_id: platformCampaign.platform_campaign_id,
          name: platformCampaign.name,
          objective: platformCampaign.objective,
          status: platformCampaign.status,
          budget_type: platformCampaign.budget_type,
          budget: platformCampaign.budget,
          start_time: platformCampaign.start_time,
          end_time: platformCampaign.end_time,
          special_ad_categories: platformCampaign.special_ad_categories,
          buying_type: platformCampaign.buying_type,
          campaign_config: platformCampaign.campaign_config
        })
        .select()
        .single();

      if (error) throw error;
      return savedCampaign;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  async updateCampaign(
    campaignId: string,
    data: Partial<CampaignCreateData>
  ): Promise<Campaign> {
    try {
      // Buscar campanha
      const campaign = await this.getCampaign(campaignId);
      const adapter = await this.initializePlatform(campaign.account_id, campaign.platform);
      
      // Atualizar na plataforma
      const updatedCampaign = await adapter.updateCampaign(campaign.platform_campaign_id, data);
      
      // Atualizar no Supabase
      const { data: savedCampaign, error } = await supabase
        .from('ads_campaigns')
        .update({
          name: updatedCampaign.name,
          status: updatedCampaign.status,
          budget: updatedCampaign.budget,
          start_time: updatedCampaign.start_time,
          end_time: updatedCampaign.end_time,
          campaign_config: updatedCampaign.campaign_config,
          updated_at: new Date().toISOString()
        })
        .eq('id', campaignId)
        .select()
        .single();

      if (error) throw error;
      return savedCampaign;
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  }

  async deleteCampaign(campaignId: string): Promise<boolean> {
    try {
      const campaign = await this.getCampaign(campaignId);
      const adapter = await this.initializePlatform(campaign.account_id, campaign.platform);
      
      // Deletar na plataforma
      await adapter.deleteCampaign(campaign.platform_campaign_id);
      
      // Marcar como deletado no Supabase
      const { error } = await supabase
        .from('ads_campaigns')
        .update({
          status: 'DELETED',
          updated_at: new Date().toISOString()
        })
        .eq('id', campaignId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  }

  async getCampaign(campaignId: string): Promise<Campaign> {
    try {
      const { data, error } = await supabase
        .from('ads_campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting campaign:', error);
      throw error;
    }
  }

  async getCampaigns(accountId: string, platform?: AdPlatform): Promise<Campaign[]> {
    try {
      let query = supabase
        .from('ads_campaigns')
        .select('*')
        .eq('account_id', accountId)
        .neq('status', 'DELETED')
        .order('created_at', { ascending: false });

      if (platform) {
        query = query.eq('platform', platform);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting campaigns:', error);
      throw error;
    }
  }

  // Ad Sets
  async createAdSet(
    accountId: string,
    platform: AdPlatform,
    data: AdSetCreateData
  ): Promise<AdSet> {
    const limitCheck = await LimitChecker.checkLimits(this.userId, accountId, platform, 'adset');
    if (!limitCheck.allowed) {
      throw new Error(`Ad Set limit exceeded. Current: ${limitCheck.current}, Limit: ${limitCheck.limit}`);
    }

    const adapter = await this.initializePlatform(accountId, platform);
    
    try {
      const platformAdSet = await adapter.createAdSet(data);
      
      const { data: savedAdSet, error } = await supabase
        .from('ads_sets')
        .insert({
          account_id: accountId,
          platform,
          platform_adset_id: platformAdSet.platform_adset_id,
          campaign_id: data.campaign_id,
          name: platformAdSet.name,
          targeting: platformAdSet.targeting,
          status: platformAdSet.status,
          budget_type: platformAdSet.budget_type,
          budget: platformAdSet.budget,
          bid_amount: platformAdSet.bid_amount,
          optimization_goal: platformAdSet.optimization_goal,
          billing_event: platformAdSet.billing_event,
          start_time: platformAdSet.start_time,
          end_time: platformAdSet.end_time,
          adset_config: platformAdSet.adset_config
        })
        .select()
        .single();

      if (error) throw error;
      return savedAdSet;
    } catch (error) {
      console.error('Error creating ad set:', error);
      throw error;
    }
  }

  async getAdSets(campaignId?: string, accountId?: string, platform?: AdPlatform): Promise<AdSet[]> {
    try {
      let query = supabase
        .from('ads_sets')
        .select('*')
        .neq('status', 'DELETED')
        .order('created_at', { ascending: false });

      if (campaignId) {
        query = query.eq('campaign_id', campaignId);
      }
      if (accountId) {
        query = query.eq('account_id', accountId);
      }
      if (platform) {
        query = query.eq('platform', platform);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting ad sets:', error);
      throw error;
    }
  }

  // Ads
  async createAd(
    accountId: string,
    platform: AdPlatform,
    data: AdCreateData
  ): Promise<Ad> {
    const limitCheck = await LimitChecker.checkLimits(this.userId, accountId, platform, 'ad');
    if (!limitCheck.allowed) {
      throw new Error(`Ad limit exceeded. Current: ${limitCheck.current}, Limit: ${limitCheck.limit}`);
    }

    const adapter = await this.initializePlatform(accountId, platform);
    
    try {
      const platformAd = await adapter.createAd(data);
      
      const { data: savedAd, error } = await supabase
        .from('ads')
        .insert({
          account_id: accountId,
          platform,
          platform_ad_id: platformAd.platform_ad_id,
          adset_id: data.adset_id,
          creative_uuid: data.creative_id,
          name: platformAd.name,
          status: platformAd.status,
          ad_config: platformAd.ad_config
        })
        .select()
        .single();

      if (error) throw error;
      return savedAd;
    } catch (error) {
      console.error('Error creating ad:', error);
      throw error;
    }
  }

  async getAds(adSetId?: string, accountId?: string, platform?: AdPlatform): Promise<Ad[]> {
    try {
      let query = supabase
        .from('ads')
        .select('*')
        .neq('status', 'DELETED')
        .order('created_at', { ascending: false });

      if (adSetId) {
        query = query.eq('adset_id', adSetId);
      }
      if (accountId) {
        query = query.eq('account_id', accountId);
      }
      if (platform) {
        query = query.eq('platform', platform);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting ads:', error);
      throw error;
    }
  }

  // Criativos
  async createCreative(
    accountId: string,
    platform: AdPlatform,
    data: CreativeCreateData
  ): Promise<Creative> {
    const limitCheck = await LimitChecker.checkLimits(this.userId, accountId, platform, 'creative');
    if (!limitCheck.allowed) {
      throw new Error(`Creative limit exceeded. Current: ${limitCheck.current}, Limit: ${limitCheck.limit}`);
    }

    const adapter = await this.initializePlatform(accountId, platform);
    
    try {
      const platformCreative = await adapter.createCreative(data);
      
      const { data: savedCreative, error } = await supabase
        .from('ad_creatives')
        .insert({
          account_id: accountId,
          platform,
          platform_creative_id: platformCreative.platform_creative_id,
          name: platformCreative.name,
          type: platformCreative.type,
          format: platformCreative.format,
          title: platformCreative.title,
          body: platformCreative.body,
          call_to_action: platformCreative.call_to_action,
          link_url: platformCreative.link_url,
          image_url: platformCreative.image_url,
          video_url: platformCreative.video_url,
          assets: platformCreative.assets,
          platform_config: platformCreative.platform_config,
          status: platformCreative.status,
          approval_status: platformCreative.approval_status
        })
        .select()
        .single();

      if (error) throw error;
      return savedCreative;
    } catch (error) {
      console.error('Error creating creative:', error);
      throw error;
    }
  }

  async getCreatives(accountId: string, platform?: AdPlatform): Promise<Creative[]> {
    try {
      let query = supabase
        .from('ad_creatives')
        .select('*')
        .eq('account_id', accountId)
        .neq('status', 'DELETED')
        .order('created_at', { ascending: false });

      if (platform) {
        query = query.eq('platform', platform);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting creatives:', error);
      throw error;
    }
  }

  // Métricas
  async getMetrics(
    accountId: string,
    platform: AdPlatform,
    query: MetricsQuery,
    entityId?: string,
    entityType?: 'campaign' | 'adset' | 'ad'
  ): Promise<AdMetrics[]> {
    try {
      // Primeiro, tentar buscar métricas do cache (Supabase)
      const cachedMetrics = await this.getCachedMetrics(accountId, platform, query, entityId, entityType);
      
      // Se não houver métricas em cache ou estiverem desatualizadas, buscar da API
      if (cachedMetrics.length === 0 || this.shouldRefreshMetrics(cachedMetrics)) {
        const adapter = await this.initializePlatform(accountId, platform);
        const freshMetrics = await adapter.getMetrics(query, entityId, entityType);
        
        // Salvar métricas no cache
        await this.cacheMetrics(freshMetrics);
        
        return freshMetrics;
      }

      return cachedMetrics;
    } catch (error) {
      console.error('Error getting metrics:', error);
      throw error;
    }
  }

  private async getCachedMetrics(
    accountId: string,
    platform: AdPlatform,
    query: MetricsQuery,
    entityId?: string,
    entityType?: 'campaign' | 'adset' | 'ad'
  ): Promise<AdMetrics[]> {
    try {
      let supabaseQuery = supabase
        .from('ad_metrics')
        .select('*')
        .eq('account_id', accountId)
        .eq('platform', platform)
        .gte('date', query.date_start)
        .lte('date', query.date_end)
        .order('date', { ascending: false });

      if (entityId && entityType) {
        switch (entityType) {
          case 'campaign':
            supabaseQuery = supabaseQuery.eq('campaign_id', entityId);
            break;
          case 'adset':
            supabaseQuery = supabaseQuery.eq('adset_id', entityId);
            break;
          case 'ad':
            supabaseQuery = supabaseQuery.eq('ad_id', entityId);
            break;
        }
      }

      const { data, error } = await supabaseQuery;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting cached metrics:', error);
      return [];
    }
  }

  private async cacheMetrics(metrics: AdMetrics[]): Promise<void> {
    try {
      if (metrics.length === 0) return;

      const { error } = await supabase
        .from('ad_metrics')
        .upsert(metrics, {
          onConflict: 'account_id,platform,campaign_id,adset_id,ad_id,date'
        });

      if (error) {
        console.error('Error caching metrics:', error);
      }
    } catch (error) {
      console.error('Error in cacheMetrics:', error);
    }
  }

  private shouldRefreshMetrics(metrics: AdMetrics[]): boolean {
    if (metrics.length === 0) return true;
    
    // Verificar se as métricas são de hoje e foram atualizadas há mais de 1 hora
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    return metrics.some(metric => {
      const updatedAt = new Date(metric.updated_at);
      const isToday = metric.date === now.toISOString().split('T')[0];
      return isToday && updatedAt < oneHourAgo;
    });
  }

  // Sincronização
  async syncPlatformData(accountId: string, platform: AdPlatform, syncType: 'full' | 'incremental' = 'incremental'): Promise<SyncJob> {
    try {
      // Criar job de sincronização
      const { data: syncJob, error } = await supabase
        .from('ad_sync_jobs')
        .insert({
          account_id: accountId,
          platform,
          sync_type: syncType,
          status: 'PENDING',
          config: { sync_type: syncType }
        })
        .select()
        .single();

      if (error) throw error;

      // Executar sincronização via Edge Function
      try {
        const response = await fetch('/api/edge/meta-api-sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accountId,
            platform,
            syncType,
            jobId: syncJob.id
          })
        });

        if (!response.ok) {
          throw new Error('Failed to start sync job');
        }

        return syncJob;
      } catch (error) {
        // Atualizar job como falhou
        await supabase
          .from('ad_sync_jobs')
          .update({
            status: 'FAILED',
            error_message: error instanceof Error ? error.message : 'Unknown error',
            updated_at: new Date().toISOString()
          })
          .eq('id', syncJob.id);

        throw error;
      }
    } catch (error) {
      console.error('Error starting sync job:', error);
      throw error;
    }
  }

  async getSyncJobs(accountId: string, platform?: AdPlatform): Promise<SyncJob[]> {
    try {
      let query = supabase
        .from('ad_sync_jobs')
        .select('*')
        .eq('account_id', accountId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (platform) {
        query = query.eq('platform', platform);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting sync jobs:', error);
      throw error;
    }
  }

  // Targeting e configurações
  async getTargetingOptions(accountId: string, platform: AdPlatform, type: string): Promise<any[]> {
    try {
      const adapter = await this.initializePlatform(accountId, platform);
      return await adapter.getTargetingOptions(type);
    } catch (error) {
      console.error('Error getting targeting options:', error);
      throw error;
    }
  }

  async getObjectives(platform: AdPlatform): Promise<string[]> {
    try {
      // Criar adaptador temporário para obter objetivos
      const tempAdapter = await AdapterFactory.createAdapter(platform, 'temp', {});
      return await tempAdapter.getObjectives();
    } catch (error) {
      console.error('Error getting objectives:', error);
      return [];
    }
  }

  async getOptimizationGoals(platform: AdPlatform, objective: string): Promise<string[]> {
    try {
      const tempAdapter = await AdapterFactory.createAdapter(platform, 'temp', {});
      return await tempAdapter.getOptimizationGoals(objective);
    } catch (error) {
      console.error('Error getting optimization goals:', error);
      return [];
    }
  }

  // Verificação de limites
  async checkLimits(accountId: string, platform: AdPlatform, type: 'campaign' | 'adset' | 'ad' | 'creative'): Promise<LimitCheckResult> {
    return await LimitChecker.checkLimits(this.userId, accountId, platform, type);
  }

  // Limpeza de cache
  clearAdapterCache(): void {
    this.adapters.clear();
  }
}

// Instância singleton para uso global
let adsServiceInstance: AdsService | null = null;

export function getAdsService(userId: string): AdsService {
  if (!adsServiceInstance || adsServiceInstance['userId'] !== userId) {
    adsServiceInstance = new AdsService(userId);
  }
  return adsServiceInstance;
}