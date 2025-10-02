// Adaptador para Meta Ads (Facebook/Instagram)

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
  MetaCampaign,
  MetaAdSet,
  MetaAd,
  MetaCreative
} from '@/types/ads';

export class MetaAdAdapter extends BaseAdAdapter {
  private accessToken: string;
  private apiVersion: string;
  private baseUrl: string;

  constructor(accountId: string, apiConfig: Record<string, any>) {
    super('META', accountId, apiConfig);
    this.accessToken = apiConfig.access_token;
    this.apiVersion = apiConfig.api_version || 'v18.0';
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
  }

  async validateApiConfig(): Promise<boolean> {
    try {
      const response = await this.makeApiCall(`/me`, 'GET');
      return !!response.id;
    } catch (error) {
      console.error('Meta API validation failed:', error);
      return false;
    }
  }

  // Campanhas
  async createCampaign(data: CampaignCreateData): Promise<Campaign> {
    this.validateRequiredFields(data, ['name', 'objective']);

    const campaignData = {
      name: data.name,
      objective: data.objective,
      status: 'PAUSED',
      special_ad_categories: data.special_ad_categories || [],
      buying_type: 'AUCTION'
    };

    try {
      const response = await this.makeApiCall(`/act_${this.accountId}/campaigns`, 'POST', campaignData);
      
      const campaign: MetaCampaign = {
        id: response.id,
        account_id: this.accountId,
        platform: 'META',
        platform_campaign_id: response.id,
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
    const updateData: Record<string, any> = {};
    
    if (data.name) updateData.name = data.name;
    if (data.budget) updateData.daily_budget = data.budget;
    if (data.start_time) updateData.start_time = data.start_time;
    if (data.end_time) updateData.end_time = data.end_time;

    try {
      await this.makeApiCall(`/${campaignId}`, 'POST', updateData);
      return await this.getCampaign(campaignId);
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  async deleteCampaign(campaignId: string): Promise<boolean> {
    try {
      await this.makeApiCall(`/${campaignId}`, 'POST', { status: 'DELETED' });
      return true;
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  async getCampaigns(): Promise<Campaign[]> {
    try {
      const response = await this.makeApiCall(
        `/act_${this.accountId}/campaigns`,
        'GET',
        null,
        {
          fields: 'id,name,objective,status,daily_budget,lifetime_budget,start_time,end_time,special_ad_categories,buying_type,created_time,updated_time'
        }
      );

      return response.data.map((campaign: any) => this.mapMetaCampaign(campaign));
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  async getCampaign(campaignId: string): Promise<Campaign> {
    try {
      const response = await this.makeApiCall(
        `/${campaignId}`,
        'GET',
        null,
        {
          fields: 'id,name,objective,status,daily_budget,lifetime_budget,start_time,end_time,special_ad_categories,buying_type,created_time,updated_time'
        }
      );

      return this.mapMetaCampaign(response);
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  // Ad Sets
  async createAdSet(data: AdSetCreateData): Promise<AdSet> {
    this.validateRequiredFields(data, ['campaign_id', 'name', 'targeting']);

    const adSetData = {
      campaign_id: data.campaign_id,
      name: data.name,
      targeting: data.targeting,
      status: 'PAUSED',
      daily_budget: data.budget_type === 'DAILY' ? data.budget : undefined,
      lifetime_budget: data.budget_type === 'LIFETIME' ? data.budget : undefined,
      optimization_goal: data.optimization_goal || 'LINK_CLICKS',
      billing_event: 'IMPRESSIONS',
      bid_amount: data.bid_amount,
      start_time: data.start_time,
      end_time: data.end_time
    };

    try {
      const response = await this.makeApiCall(`/act_${this.accountId}/adsets`, 'POST', adSetData);
      
      const adSet: MetaAdSet = {
        id: response.id,
        account_id: this.accountId,
        platform: 'META',
        platform_adset_id: response.id,
        campaign_id: data.campaign_id,
        name: data.name,
        targeting: data.targeting,
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
    const updateData: Record<string, any> = {};
    
    if (data.name) updateData.name = data.name;
    if (data.targeting) updateData.targeting = data.targeting;
    if (data.budget) {
      if (data.budget_type === 'DAILY') {
        updateData.daily_budget = data.budget;
      } else {
        updateData.lifetime_budget = data.budget;
      }
    }

    try {
      await this.makeApiCall(`/${adSetId}`, 'POST', updateData);
      return await this.getAdSet(adSetId);
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  async deleteAdSet(adSetId: string): Promise<boolean> {
    try {
      await this.makeApiCall(`/${adSetId}`, 'POST', { status: 'DELETED' });
      return true;
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  async getAdSets(campaignId?: string): Promise<AdSet[]> {
    try {
      const endpoint = campaignId 
        ? `/${campaignId}/adsets`
        : `/act_${this.accountId}/adsets`;

      const response = await this.makeApiCall(
        endpoint,
        'GET',
        null,
        {
          fields: 'id,campaign_id,name,targeting,status,daily_budget,lifetime_budget,optimization_goal,billing_event,bid_amount,start_time,end_time,created_time,updated_time'
        }
      );

      return response.data.map((adSet: any) => this.mapMetaAdSet(adSet));
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  async getAdSet(adSetId: string): Promise<AdSet> {
    try {
      const response = await this.makeApiCall(
        `/${adSetId}`,
        'GET',
        null,
        {
          fields: 'id,campaign_id,name,targeting,status,daily_budget,lifetime_budget,optimization_goal,billing_event,bid_amount,start_time,end_time,created_time,updated_time'
        }
      );

      return this.mapMetaAdSet(response);
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  // Ads
  async createAd(data: AdCreateData): Promise<Ad> {
    this.validateRequiredFields(data, ['adset_id', 'name', 'creative_id']);

    const adData = {
      adset_id: data.adset_id,
      name: data.name,
      creative: { creative_id: data.creative_id },
      status: 'PAUSED'
    };

    try {
      const response = await this.makeApiCall(`/act_${this.accountId}/ads`, 'POST', adData);
      
      const ad: MetaAd = {
        id: response.id,
        account_id: this.accountId,
        platform: 'META',
        platform_ad_id: response.id,
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
    const updateData: Record<string, any> = {};
    
    if (data.name) updateData.name = data.name;
    if (data.creative_id) updateData.creative = { creative_id: data.creative_id };

    try {
      await this.makeApiCall(`/${adId}`, 'POST', updateData);
      return await this.getAd(adId);
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  async deleteAd(adId: string): Promise<boolean> {
    try {
      await this.makeApiCall(`/${adId}`, 'POST', { status: 'DELETED' });
      return true;
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  async getAds(adSetId?: string): Promise<Ad[]> {
    try {
      const endpoint = adSetId 
        ? `/${adSetId}/ads`
        : `/act_${this.accountId}/ads`;

      const response = await this.makeApiCall(
        endpoint,
        'GET',
        null,
        {
          fields: 'id,adset_id,name,status,creative{id},created_time,updated_time'
        }
      );

      return response.data.map((ad: any) => this.mapMetaAd(ad));
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  async getAd(adId: string): Promise<Ad> {
    try {
      const response = await this.makeApiCall(
        `/${adId}`,
        'GET',
        null,
        {
          fields: 'id,adset_id,name,status,creative{id},created_time,updated_time'
        }
      );

      return this.mapMetaAd(response);
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  // Criativos
  async createCreative(data: CreativeCreateData): Promise<Creative> {
    this.validateRequiredFields(data, ['name', 'type']);

    const creativeData = {
      name: data.name,
      object_story_spec: this.buildObjectStorySpec(data),
      degrees_of_freedom_spec: {
        creative_features_spec: {
          standard_enhancements: {
            enroll_status: 'OPT_IN'
          }
        }
      }
    };

    try {
      const response = await this.makeApiCall(`/act_${this.accountId}/adcreatives`, 'POST', creativeData);
      
      const creative: MetaCreative = {
        id: response.id,
        account_id: this.accountId,
        platform: 'META',
        platform_creative_id: response.id,
        name: data.name,
        type: data.type,
        format: data.type,
        title: data.title,
        body: data.body,
        call_to_action: data.call_to_action,
        link_url: data.link_url,
        image_url: data.image_url,
        video_url: data.video_url,
        assets: data.assets || {},
        platform_config: data.config || {},
        status: 'ACTIVE',
        approval_status: 'PENDING',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return creative;
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  async updateCreative(creativeId: string, data: Partial<CreativeCreateData>): Promise<Creative> {
    // Meta não permite atualizar criativos, apenas criar novos
    throw new Error('Meta does not support updating creatives. Create a new creative instead.');
  }

  async deleteCreative(creativeId: string): Promise<boolean> {
    try {
      await this.makeApiCall(`/${creativeId}`, 'DELETE');
      return true;
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  async getCreatives(): Promise<Creative[]> {
    try {
      const response = await this.makeApiCall(
        `/act_${this.accountId}/adcreatives`,
        'GET',
        null,
        {
          fields: 'id,name,object_story_spec,status,created_time,updated_time'
        }
      );

      return response.data.map((creative: any) => this.mapMetaCreative(creative));
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  async getCreative(creativeId: string): Promise<Creative> {
    try {
      const response = await this.makeApiCall(
        `/${creativeId}`,
        'GET',
        null,
        {
          fields: 'id,name,object_story_spec,status,created_time,updated_time'
        }
      );

      return this.mapMetaCreative(response);
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  // Métricas
  async getMetrics(query: MetricsQuery, entityId?: string, entityType?: 'campaign' | 'adset' | 'ad'): Promise<AdMetrics[]> {
    try {
      let endpoint = `/act_${this.accountId}/insights`;
      
      if (entityId && entityType) {
        endpoint = `/${entityId}/insights`;
      }

      const params = {
        time_range: {
          since: query.date_start,
          until: query.date_end
        },
        time_increment: this.mapGranularity(query.granularity || 'day'),
        fields: query.metrics?.join(',') || 'impressions,clicks,spend,cpc,cpm,ctr,reach,frequency',
        breakdowns: query.breakdown?.join(',')
      };

      const response = await this.makeApiCall(endpoint, 'GET', null, params);

      return response.data.map((metric: any) => this.mapMetaMetrics(metric, entityId, entityType));
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  // Targeting
  async getTargetingOptions(type: string): Promise<any[]> {
    try {
      const response = await this.makeApiCall(
        `/act_${this.accountId}/targetingsearch`,
        'GET',
        null,
        {
          type: type,
          limit: 100
        }
      );

      return response.data;
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  async validateTargeting(targeting: Record<string, any>): Promise<boolean> {
    try {
      const response = await this.makeApiCall(
        `/act_${this.accountId}/targetingvalidation`,
        'POST',
        { targeting }
      );

      return response.is_valid;
    } catch (error) {
      console.error('Targeting validation failed:', error);
      return false;
    }
  }

  // Objetivos
  async getObjectives(): Promise<string[]> {
    return [
      'OUTCOME_AWARENESS',
      'OUTCOME_TRAFFIC',
      'OUTCOME_ENGAGEMENT',
      'OUTCOME_LEADS',
      'OUTCOME_APP_PROMOTION',
      'OUTCOME_SALES'
    ];
  }

  async getOptimizationGoals(objective: string): Promise<string[]> {
    const goalMap: Record<string, string[]> = {
      'OUTCOME_AWARENESS': ['REACH', 'IMPRESSIONS'],
      'OUTCOME_TRAFFIC': ['LINK_CLICKS', 'LANDING_PAGE_VIEWS'],
      'OUTCOME_ENGAGEMENT': ['POST_ENGAGEMENT', 'PAGE_LIKES'],
      'OUTCOME_LEADS': ['LEAD_GENERATION', 'CONVERSATIONS'],
      'OUTCOME_APP_PROMOTION': ['APP_INSTALLS', 'APP_EVENTS'],
      'OUTCOME_SALES': ['CONVERSIONS', 'VALUE']
    };

    return goalMap[objective] || ['LINK_CLICKS'];
  }

  // Métodos auxiliares
  private async makeApiCall(
    endpoint: string, 
    method: 'GET' | 'POST' | 'DELETE', 
    data?: any,
    params?: Record<string, any>
  ): Promise<any> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append('access_token', this.accessToken);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (typeof value === 'object') {
          url.searchParams.append(key, JSON.stringify(value));
        } else {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url.toString(), options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }

    return await response.json();
  }

  private mapMetaCampaign(campaign: any): MetaCampaign {
    return {
      id: campaign.id,
      account_id: this.accountId,
      platform: 'META',
      platform_campaign_id: campaign.id,
      name: campaign.name,
      objective: campaign.objective,
      status: this.normalizeStatus(campaign.status),
      budget_type: campaign.daily_budget ? 'DAILY' : 'LIFETIME',
      budget: campaign.daily_budget || campaign.lifetime_budget || 0,
      start_time: campaign.start_time,
      end_time: campaign.end_time,
      special_ad_categories: campaign.special_ad_categories || [],
      buying_type: campaign.buying_type || 'AUCTION',
      campaign_config: {},
      created_at: campaign.created_time,
      updated_at: campaign.updated_time
    };
  }

  private mapMetaAdSet(adSet: any): MetaAdSet {
    return {
      id: adSet.id,
      account_id: this.accountId,
      platform: 'META',
      platform_adset_id: adSet.id,
      campaign_id: adSet.campaign_id,
      name: adSet.name,
      targeting: adSet.targeting || {},
      status: this.normalizeStatus(adSet.status),
      budget_type: adSet.daily_budget ? 'DAILY' : 'LIFETIME',
      budget: adSet.daily_budget || adSet.lifetime_budget || 0,
      bid_amount: adSet.bid_amount,
      optimization_goal: adSet.optimization_goal,
      billing_event: adSet.billing_event,
      start_time: adSet.start_time,
      end_time: adSet.end_time,
      adset_config: {},
      created_at: adSet.created_time,
      updated_at: adSet.updated_time
    };
  }

  private mapMetaAd(ad: any): MetaAd {
    return {
      id: ad.id,
      account_id: this.accountId,
      platform: 'META',
      platform_ad_id: ad.id,
      adset_id: ad.adset_id,
      creative_uuid: ad.creative?.id,
      name: ad.name,
      status: this.normalizeStatus(ad.status),
      ad_config: {},
      created_at: ad.created_time,
      updated_at: ad.updated_time
    };
  }

  private mapMetaCreative(creative: any): MetaCreative {
    const objectStory = creative.object_story_spec || {};
    
    return {
      id: creative.id,
      account_id: this.accountId,
      platform: 'META',
      platform_creative_id: creative.id,
      name: creative.name,
      type: 'IMAGE', // Determinar baseado no object_story_spec
      format: 'IMAGE',
      title: objectStory.link_data?.name,
      body: objectStory.link_data?.description,
      call_to_action: objectStory.link_data?.call_to_action?.type,
      link_url: objectStory.link_data?.link,
      image_url: objectStory.link_data?.picture,
      assets: {},
      platform_config: {},
      status: 'ACTIVE',
      approval_status: 'APPROVED',
      created_at: creative.created_time,
      updated_at: creative.updated_time
    };
  }

  private mapMetaMetrics(metric: any, entityId?: string, entityType?: 'campaign' | 'adset' | 'ad'): AdMetrics {
    return {
      id: `${entityId || 'account'}_${metric.date_start}_${metric.date_stop}`,
      account_id: this.accountId,
      platform: 'META',
      campaign_id: entityType === 'campaign' ? entityId : undefined,
      adset_id: entityType === 'adset' ? entityId : undefined,
      ad_id: entityType === 'ad' ? entityId : undefined,
      date: metric.date_start,
      impressions: parseInt(metric.impressions || '0'),
      clicks: parseInt(metric.clicks || '0'),
      spend: parseFloat(metric.spend || '0'),
      conversions: parseInt(metric.conversions || '0'),
      cpc: parseFloat(metric.cpc || '0'),
      cpm: parseFloat(metric.cpm || '0'),
      ctr: parseFloat(metric.ctr || '0'),
      reach: parseInt(metric.reach || '0'),
      frequency: parseFloat(metric.frequency || '0'),
      video_views: parseInt(metric.video_views || '0'),
      engagement: parseInt(metric.post_engagements || '0'),
      platform_metrics: metric,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  private buildObjectStorySpec(data: CreativeCreateData): any {
    return {
      page_id: this.apiConfig.page_id,
      link_data: {
        name: data.title,
        description: data.body,
        link: data.link_url,
        picture: data.image_url,
        call_to_action: data.call_to_action ? {
          type: data.call_to_action
        } : undefined
      }
    };
  }

  private mapGranularity(granularity: string): string {
    const granularityMap: Record<string, string> = {
      'hour': '1',
      'day': '1',
      'week': '7',
      'month': 'monthly'
    };

    return granularityMap[granularity] || '1';
  }
}