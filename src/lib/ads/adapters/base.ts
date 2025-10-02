// Adaptador base para plataformas de anúncios

import { 
  AdPlatform, 
  Campaign, 
  AdSet, 
  Ad, 
  Creative, 
  AdMetrics,
  LimitCheckResult 
} from '@/types/ads';

export interface CampaignCreateData {
  name: string;
  objective: string;
  budget_type: 'DAILY' | 'LIFETIME';
  budget: number;
  start_time?: string;
  end_time?: string;
  special_ad_categories?: string[];
  config?: Record<string, any>;
}

export interface AdSetCreateData {
  campaign_id: string;
  name: string;
  targeting: Record<string, any>;
  budget_type: 'DAILY' | 'LIFETIME';
  budget: number;
  bid_amount?: number;
  optimization_goal?: string;
  start_time?: string;
  end_time?: string;
  config?: Record<string, any>;
}

export interface AdCreateData {
  adset_id: string;
  name: string;
  creative_id: string;
  config?: Record<string, any>;
}

export interface CreativeCreateData {
  name: string;
  type: 'IMAGE' | 'VIDEO' | 'CAROUSEL' | 'COLLECTION' | 'SLIDESHOW';
  title?: string;
  body?: string;
  call_to_action?: string;
  link_url?: string;
  image_url?: string;
  video_url?: string;
  assets?: Record<string, any>;
  config?: Record<string, any>;
}

export interface MetricsQuery {
  date_start: string;
  date_end: string;
  granularity?: 'hour' | 'day' | 'week' | 'month';
  metrics?: string[];
  breakdown?: string[];
}

export abstract class BaseAdAdapter {
  protected platform: AdPlatform;
  protected accountId: string;
  protected apiConfig: Record<string, any>;

  constructor(platform: AdPlatform, accountId: string, apiConfig: Record<string, any>) {
    this.platform = platform;
    this.accountId = accountId;
    this.apiConfig = apiConfig;
  }

  // Métodos abstratos que devem ser implementados por cada plataforma
  abstract validateApiConfig(): Promise<boolean>;
  
  // Campanhas
  abstract createCampaign(data: CampaignCreateData): Promise<Campaign>;
  abstract updateCampaign(campaignId: string, data: Partial<CampaignCreateData>): Promise<Campaign>;
  abstract deleteCampaign(campaignId: string): Promise<boolean>;
  abstract getCampaigns(): Promise<Campaign[]>;
  abstract getCampaign(campaignId: string): Promise<Campaign>;
  
  // Ad Sets
  abstract createAdSet(data: AdSetCreateData): Promise<AdSet>;
  abstract updateAdSet(adSetId: string, data: Partial<AdSetCreateData>): Promise<AdSet>;
  abstract deleteAdSet(adSetId: string): Promise<boolean>;
  abstract getAdSets(campaignId?: string): Promise<AdSet[]>;
  abstract getAdSet(adSetId: string): Promise<AdSet>;
  
  // Ads
  abstract createAd(data: AdCreateData): Promise<Ad>;
  abstract updateAd(adId: string, data: Partial<AdCreateData>): Promise<Ad>;
  abstract deleteAd(adId: string): Promise<boolean>;
  abstract getAds(adSetId?: string): Promise<Ad[]>;
  abstract getAd(adId: string): Promise<Ad>;
  
  // Criativos
  abstract createCreative(data: CreativeCreateData): Promise<Creative>;
  abstract updateCreative(creativeId: string, data: Partial<CreativeCreateData>): Promise<Creative>;
  abstract deleteCreative(creativeId: string): Promise<boolean>;
  abstract getCreatives(): Promise<Creative[]>;
  abstract getCreative(creativeId: string): Promise<Creative>;
  
  // Métricas
  abstract getMetrics(query: MetricsQuery, entityId?: string, entityType?: 'campaign' | 'adset' | 'ad'): Promise<AdMetrics[]>;
  
  // Targeting
  abstract getTargetingOptions(type: string): Promise<any[]>;
  abstract validateTargeting(targeting: Record<string, any>): Promise<boolean>;
  
  // Objetivos específicos da plataforma
  abstract getObjectives(): Promise<string[]>;
  abstract getOptimizationGoals(objective: string): Promise<string[]>;
  
  // Métodos utilitários
  getPlatform(): AdPlatform {
    return this.platform;
  }

  getAccountId(): string {
    return this.accountId;
  }

  // Método para formatar erros da API
  protected formatApiError(error: any): Error {
    if (error.response?.data?.error) {
      return new Error(`${this.platform} API Error: ${error.response.data.error.message || error.message}`);
    }
    return new Error(`${this.platform} API Error: ${error.message || 'Unknown error'}`);
  }

  // Método para validar dados obrigatórios
  protected validateRequiredFields(data: Record<string, any>, requiredFields: string[]): void {
    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
  }

  // Método para normalizar status entre plataformas
  protected normalizeStatus(platformStatus: string): 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED' {
    const statusMap: Record<string, 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED'> = {
      // Meta
      'ACTIVE': 'ACTIVE',
      'PAUSED': 'PAUSED',
      'DELETED': 'DELETED',
      'ARCHIVED': 'ARCHIVED',
      
      // Google
      'ENABLED': 'ACTIVE',
      'PAUSED': 'PAUSED',
      'REMOVED': 'DELETED',
      
      // TikTok
      'ENABLE': 'ACTIVE',
      'DISABLE': 'PAUSED',
      'DELETE': 'DELETED'
    };

    return statusMap[platformStatus.toUpperCase()] || 'PAUSED';
  }

  // Método para converter status para a plataforma
  protected convertStatusToPlatform(status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED'): string {
    const statusMap: Record<string, Record<string, string>> = {
      'META': {
        'ACTIVE': 'ACTIVE',
        'PAUSED': 'PAUSED',
        'DELETED': 'DELETED',
        'ARCHIVED': 'ARCHIVED'
      },
      'GOOGLE': {
        'ACTIVE': 'ENABLED',
        'PAUSED': 'PAUSED',
        'DELETED': 'REMOVED',
        'ARCHIVED': 'REMOVED'
      },
      'TIKTOK': {
        'ACTIVE': 'ENABLE',
        'PAUSED': 'DISABLE',
        'DELETED': 'DELETE',
        'ARCHIVED': 'DELETE'
      }
    };

    return statusMap[this.platform]?.[status] || 'PAUSED';
  }
}

// Factory para criar adaptadores
export class AdapterFactory {
  static async createAdapter(
    platform: AdPlatform, 
    accountId: string, 
    apiConfig: Record<string, any>
  ): Promise<BaseAdAdapter> {
    switch (platform) {
      case 'META':
        const { MetaAdAdapter } = await import('./meta');
        return new MetaAdAdapter(accountId, apiConfig);
      
      case 'GOOGLE':
        const { GoogleAdAdapter } = await import('./google');
        return new GoogleAdAdapter(accountId, apiConfig);
      
      case 'TIKTOK':
        const { TikTokAdAdapter } = await import('./tiktok');
        return new TikTokAdAdapter(accountId, apiConfig);
      
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }
}

// Serviço para verificar limites
export class LimitChecker {
  static async checkLimits(
    userId: string,
    accountId: string,
    platform: AdPlatform,
    type: 'campaign' | 'adset' | 'ad' | 'creative'
  ): Promise<LimitCheckResult> {
    try {
      const response = await fetch('/api/edge/check-campaign-limits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          accountId,
          platform,
          type
        })
      });

      if (!response.ok) {
        throw new Error('Failed to check limits');
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking limits:', error);
      return {
        allowed: false,
        current: 0,
        limit: 0,
        remaining: 0,
        platform,
        type,
        error: 'Failed to check limits'
      };
    }
  }
}