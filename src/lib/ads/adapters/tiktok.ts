// Adaptador para TikTok Ads

import { 
  BaseAdAdapter, 
  CampaignCreateData, 
  AdSetCreateData, 
  AdCreateData, 
  CreativeCreateData,
  MetricsQuery 
} from './base';
import { 
  Campaign, 
  AdSet, 
  Ad, 
  Creative, 
  AdMetrics,
  TikTokCampaign,
  TikTokAdSet,
  TikTokAd,
  TikTokCreative
} from '@/types/ads';

export class TikTokAdAdapter extends BaseAdAdapter {
  private accessToken: string;
  private advertiserId: string;
  private baseUrl: string;

  constructor(accountId: string, apiConfig: Record<string, any>) {
    super('TIKTOK', accountId, apiConfig);
    this.accessToken = apiConfig.access_token;
    this.advertiserId = apiConfig.advertiser_id;
    this.baseUrl = 'https://business-api.tiktok.com/open_api/v1.3';
  }

  async validateApiConfig(): Promise<boolean> {
    try {
      const response = await this.makeApiCall('/advertiser/info/', 'GET', {
        advertiser_ids: [this.advertiserId]
      });
      return response.code === 0 && response.data?.list?.length > 0;
    } catch (error) {
      console.error('TikTok Ads API validation failed:', error);
      return false;
    }
  }

  // Campanhas
  async createCampaign(data: CampaignCreateData): Promise<Campaign> {
    this.validateRequiredFields(data, ['name', 'objective']);

    const campaignData = {
      advertiser_id: this.advertiserId,
      campaign_name: data.name,
      objective_type: this.mapObjectiveToTikTok(data.objective),
      budget_mode: data.budget_type === 'DAILY' ? 'BUDGET_MODE_DAY' : 'BUDGET_MODE_TOTAL',
      budget: data.budget,
      operation_status: 'DISABLE'
    };

    try {
      const response = await this.makeApiCall('/campaign/create/', 'POST', campaignData);
      
      if (response.code !== 0) {
        throw new Error(response.message || 'Failed to create campaign');
      }

      const campaignId = response.data.campaign_id;

      const campaign: TikTokCampaign = {
        id: campaignId,
        account_id: this.accountId,
        platform: 'TIKTOK',
        platform_campaign_id: campaignId,
        name: data.name,
        objective: data.objective,
        status: 'PAUSED',
        budget_type: data.budget_type,
        budget: data.budget,
        start_time: data.start_time,
        end_time: data.end_time,
        special_ad_categories: data.special_ad_categories,
        buying_type: 'AUCTION',
        campaign_config: data.config || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return campaign;
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  async updateCampaign(campaignId: string, data: Partial<CampaignCreateData>): Promise<Campaign> {
    const updateData: Record<string, any> = {
      advertiser_id: this.advertiserId,
      campaign_id: campaignId
    };

    if (data.name) updateData.campaign_name = data.name;
    if (data.budget) updateData.budget = data.budget;

    try {
      const response = await this.makeApiCall('/campaign/update/', 'POST', updateData);
      
      if (response.code !== 0) {
        throw new Error(response.message || 'Failed to update campaign');
      }

      return await this.getCampaign(campaignId);
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  async deleteCampaign(campaignId: string): Promise<boolean> {
    try {
      const response = await this.makeApiCall('/campaign/update/', 'POST', {
        advertiser_id: this.advertiserId,
        campaign_id: campaignId,
        operation_status: 'DELETE'
      });

      return response.code === 0;
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  async getCampaigns(): Promise<Campaign[]> {
    try {
      const response = await this.makeApiCall('/campaign/get/', 'GET', {
        advertiser_id: this.advertiserId,
        fields: ['campaign_id', 'campaign_name', 'objective_type', 'operation_status', 'budget_mode', 'budget', 'create_time', 'modify_time']
      });

      if (response.code !== 0) {
        throw new Error(response.message || 'Failed to get campaigns');
      }

      return response.data?.list?.map((campaign: any) => this.mapTikTokCampaign(campaign)) || [];
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  async getCampaign(campaignId: string): Promise<Campaign> {
    try {
      const response = await this.makeApiCall('/campaign/get/', 'GET', {
        advertiser_id: this.advertiserId,
        campaign_ids: [campaignId],
        fields: ['campaign_id', 'campaign_name', 'objective_type', 'operation_status', 'budget_mode', 'budget', 'create_time', 'modify_time']
      });

      if (response.code !== 0 || !response.data?.list?.length) {
        throw new Error('Campaign not found');
      }

      return this.mapTikTokCampaign(response.data.list[0]);
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  // Ad Groups (equivalente a Ad Sets)
  async createAdSet(data: AdSetCreateData): Promise<AdSet> {
    this.validateRequiredFields(data, ['campaign_id', 'name']);

    const adGroupData = {
      advertiser_id: this.advertiserId,
      campaign_id: data.campaign_id,
      adgroup_name: data.name,
      placement_type: 'PLACEMENT_TYPE_AUTOMATIC',
      budget_mode: data.budget_type === 'DAILY' ? 'BUDGET_MODE_DAY' : 'BUDGET_MODE_TOTAL',
      budget: data.budget,
      bid_type: 'BID_TYPE_NO_BID',
      operation_status: 'DISABLE',
      targeting: data.targeting || {}
    };

    try {
      const response = await this.makeApiCall('/adgroup/create/', 'POST', adGroupData);
      
      if (response.code !== 0) {
        throw new Error(response.message || 'Failed to create ad group');
      }

      const adGroupId = response.data.adgroup_id;

      const adSet: TikTokAdSet = {
        id: adGroupId,
        account_id: this.accountId,
        platform: 'TIKTOK',
        platform_adset_id: adGroupId,
        campaign_id: data.campaign_id,
        name: data.name,
        targeting: data.targeting || {},
        status: 'PAUSED',
        budget_type: data.budget_type,
        budget: data.budget,
        bid_amount: data.bid_amount,
        optimization_goal: data.optimization_goal,
        billing_event: 'IMPRESSIONS',
        start_time: data.start_time,
        end_time: data.end_time,
        adset_config: data.config || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return adSet;
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  async updateAdSet(adSetId: string, data: Partial<AdSetCreateData>): Promise<AdSet> {
    const updateData: Record<string, any> = {
      advertiser_id: this.advertiserId,
      adgroup_id: adSetId
    };

    if (data.name) updateData.adgroup_name = data.name;
    if (data.budget) updateData.budget = data.budget;
    if (data.targeting) updateData.targeting = data.targeting;

    try {
      const response = await this.makeApiCall('/adgroup/update/', 'POST', updateData);
      
      if (response.code !== 0) {
        throw new Error(response.message || 'Failed to update ad group');
      }

      return await this.getAdSet(adSetId);
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  async deleteAdSet(adSetId: string): Promise<boolean> {
    try {
      const response = await this.makeApiCall('/adgroup/update/', 'POST', {
        advertiser_id: this.advertiserId,
        adgroup_id: adSetId,
        operation_status: 'DELETE'
      });

      return response.code === 0;
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  async getAdSets(campaignId?: string): Promise<AdSet[]> {
    try {
      const params: Record<string, any> = {
        advertiser_id: this.advertiserId,
        fields: ['adgroup_id', 'campaign_id', 'adgroup_name', 'operation_status', 'budget_mode', 'budget', 'create_time', 'modify_time']
      };

      if (campaignId) {
        params.campaign_ids = [campaignId];
      }

      const response = await this.makeApiCall('/adgroup/get/', 'GET', params);

      if (response.code !== 0) {
        throw new Error(response.message || 'Failed to get ad groups');
      }

      return response.data?.list?.map((adGroup: any) => this.mapTikTokAdSet(adGroup)) || [];
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  async getAdSet(adSetId: string): Promise<AdSet> {
    try {
      const response = await this.makeApiCall('/adgroup/get/', 'GET', {
        advertiser_id: this.advertiserId,
        adgroup_ids: [adSetId],
        fields: ['adgroup_id', 'campaign_id', 'adgroup_name', 'operation_status', 'budget_mode', 'budget', 'create_time', 'modify_time']
      });

      if (response.code !== 0 || !response.data?.list?.length) {
        throw new Error('Ad group not found');
      }

      return this.mapTikTokAdSet(response.data.list[0]);
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  // Ads
  async createAd(data: AdCreateData): Promise<Ad> {
    this.validateRequiredFields(data, ['adset_id', 'name', 'creative_id']);

    const adData = {
      advertiser_id: this.advertiserId,
      adgroup_id: data.adset_id,
      ad_name: data.name,
      creative_material_mode: 'CUSTOM',
      ad_format: 'SINGLE_VIDEO',
      creatives: [{
        creative_id: data.creative_id
      }],
      operation_status: 'DISABLE'
    };

    try {
      const response = await this.makeApiCall('/ad/create/', 'POST', adData);
      
      if (response.code !== 0) {
        throw new Error(response.message || 'Failed to create ad');
      }

      const adId = response.data.ad_id;

      const ad: TikTokAd = {
        id: adId,
        account_id: this.accountId,
        platform: 'TIKTOK',
        platform_ad_id: adId,
        adset_id: data.adset_id,
        creative_uuid: data.creative_id,
        name: data.name,
        status: 'PAUSED',
        ad_config: data.config || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return ad;
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  async updateAd(adId: string, data: Partial<AdCreateData>): Promise<Ad> {
    const updateData: Record<string, any> = {
      advertiser_id: this.advertiserId,
      ad_id: adId
    };

    if (data.name) updateData.ad_name = data.name;

    try {
      const response = await this.makeApiCall('/ad/update/', 'POST', updateData);
      
      if (response.code !== 0) {
        throw new Error(response.message || 'Failed to update ad');
      }

      return await this.getAd(adId);
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  async deleteAd(adId: string): Promise<boolean> {
    try {
      const response = await this.makeApiCall('/ad/update/', 'POST', {
        advertiser_id: this.advertiserId,
        ad_id: adId,
        operation_status: 'DELETE'
      });

      return response.code === 0;
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  async getAds(adSetId?: string): Promise<Ad[]> {
    try {
      const params: Record<string, any> = {
        advertiser_id: this.advertiserId,
        fields: ['ad_id', 'adgroup_id', 'ad_name', 'operation_status', 'create_time', 'modify_time']
      };

      if (adSetId) {
        params.adgroup_ids = [adSetId];
      }

      const response = await this.makeApiCall('/ad/get/', 'GET', params);

      if (response.code !== 0) {
        throw new Error(response.message || 'Failed to get ads');
      }

      return response.data?.list?.map((ad: any) => this.mapTikTokAd(ad)) || [];
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  async getAd(adId: string): Promise<Ad> {
    try {
      const response = await this.makeApiCall('/ad/get/', 'GET', {
        advertiser_id: this.advertiserId,
        ad_ids: [adId],
        fields: ['ad_id', 'adgroup_id', 'ad_name', 'operation_status', 'create_time', 'modify_time']
      });

      if (response.code !== 0 || !response.data?.list?.length) {
        throw new Error('Ad not found');
      }

      return this.mapTikTokAd(response.data.list[0]);
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  // Criativos
  async createCreative(data: CreativeCreateData): Promise<Creative> {
    // TikTok requer upload de mídia primeiro
    throw new Error('TikTok creative creation requires media upload - not implemented yet');
  }

  async updateCreative(creativeId: string, data: Partial<CreativeCreateData>): Promise<Creative> {
    throw new Error('TikTok creative update not implemented yet');
  }

  async deleteCreative(creativeId: string): Promise<boolean> {
    throw new Error('TikTok creative deletion not implemented yet');
  }

  async getCreatives(): Promise<Creative[]> {
    return [];
  }

  async getCreative(creativeId: string): Promise<Creative> {
    throw new Error('TikTok creative retrieval not implemented yet');
  }

  // Métricas
  async getMetrics(query: MetricsQuery, entityId?: string, entityType?: 'campaign' | 'adset' | 'ad'): Promise<AdMetrics[]> {
    try {
      const params: Record<string, any> = {
        advertiser_id: this.advertiserId,
        data_level: this.mapEntityTypeToDataLevel(entityType),
        start_date: query.date_start,
        end_date: query.date_end,
        metrics: query.metrics || ['impressions', 'clicks', 'spend', 'cpc', 'cpm', 'ctr', 'conversions']
      };

      if (entityId) {
        switch (entityType) {
          case 'campaign':
            params.campaign_ids = [entityId];
            break;
          case 'adset':
            params.adgroup_ids = [entityId];
            break;
          case 'ad':
            params.ad_ids = [entityId];
            break;
        }
      }

      const response = await this.makeApiCall('/report/integrated/get/', 'GET', params);

      if (response.code !== 0) {
        throw new Error(response.message || 'Failed to get metrics');
      }

      return response.data?.list?.map((metric: any) => this.mapTikTokMetrics(metric, entityId, entityType)) || [];
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  // Targeting
  async getTargetingOptions(type: string): Promise<any[]> {
    try {
      const response = await this.makeApiCall('/tool/targeting/get/', 'GET', {
        advertiser_id: this.advertiserId,
        type: type
      });

      if (response.code !== 0) {
        throw new Error(response.message || 'Failed to get targeting options');
      }

      return response.data?.list || [];
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  async validateTargeting(targeting: Record<string, any>): Promise<boolean> {
    // TikTok não tem endpoint específico de validação
    return true;
  }

  // Objetivos
  async getObjectives(): Promise<string[]> {
    return [
      'REACH',
      'TRAFFIC',
      'VIDEO_VIEWS',
      'CONVERSIONS',
      'APP_PROMOTION',
      'LEAD_GENERATION'
    ];
  }

  async getOptimizationGoals(objective: string): Promise<string[]> {
    const goalMap: Record<string, string[]> = {
      'REACH': ['REACH', 'IMPRESSIONS'],
      'TRAFFIC': ['CLICK', 'LANDING_PAGE_VIEW'],
      'VIDEO_VIEWS': ['VIDEO_VIEW', 'VIDEO_PLAY'],
      'CONVERSIONS': ['CONVERSION', 'VALUE'],
      'APP_PROMOTION': ['INSTALL', 'APP_EVENT'],
      'LEAD_GENERATION': ['LEAD', 'COMPLETE_PAYMENT']
    };

    return goalMap[objective] || ['CLICK'];
  }

  // Métodos auxiliares
  private async makeApiCall(
    endpoint: string, 
    method: 'GET' | 'POST', 
    data?: any
  ): Promise<any> {
    let url = `${this.baseUrl}${endpoint}`;

    const options: RequestInit = {
      method,
      headers: {
        'Access-Token': this.accessToken,
        'Content-Type': 'application/json',
      }
    };

    if (method === 'GET' && data) {
      const params = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          params.append(key, JSON.stringify(value));
        } else {
          params.append(key, String(value));
        }
      });
      url += `?${params.toString()}`;
    } else if (method === 'POST' && data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
  }

  private mapObjectiveToTikTok(objective: string): string {
    const objectiveMap: Record<string, string> = {
      'REACH': 'REACH',
      'TRAFFIC': 'TRAFFIC',
      'VIDEO_VIEWS': 'VIDEO_VIEWS',
      'CONVERSIONS': 'CONVERSIONS',
      'APP_PROMOTION': 'APP_PROMOTION',
      'LEAD_GENERATION': 'LEAD_GENERATION'
    };

    return objectiveMap[objective] || 'TRAFFIC';
  }

  private mapEntityTypeToDataLevel(entityType?: 'campaign' | 'adset' | 'ad'): string {
    const levelMap: Record<string, string> = {
      'campaign': 'AUCTION_CAMPAIGN',
      'adset': 'AUCTION_ADGROUP',
      'ad': 'AUCTION_AD'
    };

    return levelMap[entityType || 'campaign'] || 'AUCTION_CAMPAIGN';
  }

  private mapTikTokCampaign(campaign: any): TikTokCampaign {
    return {
      id: campaign.campaign_id,
      account_id: this.accountId,
      platform: 'TIKTOK',
      platform_campaign_id: campaign.campaign_id,
      name: campaign.campaign_name,
      objective: campaign.objective_type,
      status: this.normalizeStatus(campaign.operation_status),
      budget_type: campaign.budget_mode === 'BUDGET_MODE_DAY' ? 'DAILY' : 'LIFETIME',
      budget: campaign.budget || 0,
      buying_type: 'AUCTION',
      campaign_config: {},
      created_at: campaign.create_time,
      updated_at: campaign.modify_time
    };
  }

  private mapTikTokAdSet(adGroup: any): TikTokAdSet {
    return {
      id: adGroup.adgroup_id,
      account_id: this.accountId,
      platform: 'TIKTOK',
      platform_adset_id: adGroup.adgroup_id,
      campaign_id: adGroup.campaign_id,
      name: adGroup.adgroup_name,
      targeting: {},
      status: this.normalizeStatus(adGroup.operation_status),
      budget_type: adGroup.budget_mode === 'BUDGET_MODE_DAY' ? 'DAILY' : 'LIFETIME',
      budget: adGroup.budget || 0,
      billing_event: 'IMPRESSIONS',
      adset_config: {},
      created_at: adGroup.create_time,
      updated_at: adGroup.modify_time
    };
  }

  private mapTikTokAd(ad: any): TikTokAd {
    return {
      id: ad.ad_id,
      account_id: this.accountId,
      platform: 'TIKTOK',
      platform_ad_id: ad.ad_id,
      adset_id: ad.adgroup_id,
      name: ad.ad_name,
      status: this.normalizeStatus(ad.operation_status),
      ad_config: {},
      created_at: ad.create_time,
      updated_at: ad.modify_time
    };
  }

  private mapTikTokMetrics(metric: any, entityId?: string, entityType?: 'campaign' | 'adset' | 'ad'): AdMetrics {
    return {
      id: `${entityId || 'account'}_${metric.stat_time_day}`,
      account_id: this.accountId,
      platform: 'TIKTOK',
      campaign_id: entityType === 'campaign' ? entityId : undefined,
      adset_id: entityType === 'adset' ? entityId : undefined,
      ad_id: entityType === 'ad' ? entityId : undefined,
      date: metric.stat_time_day,
      impressions: parseInt(metric.impressions || '0'),
      clicks: parseInt(metric.clicks || '0'),
      spend: parseFloat(metric.spend || '0'),
      conversions: parseInt(metric.conversions || '0'),
      cpc: parseFloat(metric.cpc || '0'),
      cpm: parseFloat(metric.cpm || '0'),
      ctr: parseFloat(metric.ctr || '0'),
      video_views: parseInt(metric.video_views || '0'),
      platform_metrics: metric,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
}