// Tipos base para o sistema de anúncios multi-plataforma

export type AdPlatform = 'META' | 'GOOGLE' | 'TIKTOK';

export type CampaignStatus = 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
export type AdSetStatus = 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
export type AdStatus = 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
export type CreativeStatus = 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';

export type BudgetType = 'DAILY' | 'LIFETIME';
export type BuyingType = 'AUCTION' | 'RESERVED';

// Interfaces base
export interface BaseCampaign {
  id: string;
  account_id: string;
  platform: AdPlatform;
  name: string;
  status: CampaignStatus;
  objective: string;
  budget_type: BudgetType;
  budget: number;
  buying_type?: BuyingType;
  start_time?: string;
  end_time?: string;
  special_ad_categories?: string[];
  campaign_config: Record<string, any>;
  
  // Métricas
  spend: number;
  impressions: number;
  reach: number;
  results: number;
  cost_per_result: number;
  
  created_at: string;
  updated_at: string;
}

export interface BaseAdSet {
  id: string;
  campaign_id: string;
  platform: AdPlatform;
  name: string;
  status: AdSetStatus;
  targeting: Record<string, any>;
  budget_type: BudgetType;
  budget: number;
  bid_amount?: number;
  optimization_goal?: string;
  billing_event?: string;
  bid_strategy?: string;
  start_time?: string;
  end_time?: string;
  adset_config: Record<string, any>;
  
  // Métricas
  spend: number;
  impressions: number;
  reach: number;
  results: number;
  ctr: number;
  
  created_at: string;
  updated_at: string;
}

export interface BaseAd {
  id: string;
  adset_id: string;
  platform: AdPlatform;
  name: string;
  status: AdStatus;
  format?: string;
  creative_id?: string;
  creative_uuid?: string;
  ad_config: Record<string, any>;
  
  // Métricas
  spend: number;
  impressions: number;
  reach: number;
  results: number;
  clicks: number;
  ctr: number;
  cpc: number;
  
  created_at: string;
  updated_at: string;
}

export interface BaseCreative {
  id: string;
  account_id: string;
  platform: AdPlatform;
  platform_creative_id?: string;
  name: string;
  type: 'IMAGE' | 'VIDEO' | 'CAROUSEL' | 'COLLECTION' | 'SLIDESHOW';
  format?: string;
  
  // Conteúdo
  title?: string;
  body?: string;
  call_to_action?: string;
  link_url?: string;
  display_link?: string;
  
  // Assets
  image_url?: string;
  video_url?: string;
  thumbnail_url?: string;
  assets: Record<string, any>;
  
  // Configurações
  platform_config: Record<string, any>;
  
  // Status
  status: CreativeStatus;
  approval_status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  
  created_at: string;
  updated_at: string;
}

// Interfaces específicas do Meta
export interface MetaCampaign extends BaseCampaign {
  platform: 'META';
  meta_campaign_id?: string;
  objective: 'AWARENESS' | 'TRAFFIC' | 'ENGAGEMENT' | 'LEADS' | 'APP_PROMOTION' | 'SALES';
  bid_strategy?: 'LOWEST_COST_WITHOUT_CAP' | 'LOWEST_COST_WITH_BID_CAP' | 'TARGET_COST';
}

export interface MetaAdSet extends BaseAdSet {
  platform: 'META';
  meta_adset_id?: string;
  optimization_goal?: 'REACH' | 'IMPRESSIONS' | 'CLICKS' | 'CONVERSIONS' | 'VALUE';
  billing_event?: 'IMPRESSIONS' | 'CLICKS' | 'CONVERSIONS';
}

export interface MetaAd extends BaseAd {
  platform: 'META';
  meta_ad_id?: string;
}

// Interfaces específicas do Google
export interface GoogleCampaign extends BaseCampaign {
  platform: 'GOOGLE';
  google_campaign_id?: string;
  objective: 'SEARCH' | 'DISPLAY' | 'SHOPPING' | 'VIDEO' | 'APP' | 'SMART' | 'PERFORMANCE_MAX';
}

export interface GoogleAdSet extends BaseAdSet {
  platform: 'GOOGLE';
  google_adgroup_id?: string;
}

export interface GoogleAd extends BaseAd {
  platform: 'GOOGLE';
  google_ad_id?: string;
}

// Interfaces específicas do TikTok
export interface TikTokCampaign extends BaseCampaign {
  platform: 'TIKTOK';
  tiktok_campaign_id?: string;
  objective: 'REACH' | 'TRAFFIC' | 'VIDEO_VIEWS' | 'CONVERSIONS' | 'APP_PROMOTION';
}

export interface TikTokAdSet extends BaseAdSet {
  platform: 'TIKTOK';
  tiktok_adgroup_id?: string;
}

export interface TikTokAd extends BaseAd {
  platform: 'TIKTOK';
  tiktok_ad_id?: string;
}

// Union types
export type Campaign = MetaCampaign | GoogleCampaign | TikTokCampaign;
export type AdSet = MetaAdSet | GoogleAdSet | TikTokAdSet;
export type Ad = MetaAd | GoogleAd | TikTokAd;
export type Creative = BaseCreative;

// Interfaces para métricas
export interface AdMetrics {
  id: string;
  campaign_id?: string;
  adset_id?: string;
  ad_id?: string;
  creative_id?: string;
  platform: AdPlatform;
  date_start: string;
  date_end: string;
  granularity: 'hour' | 'day' | 'week' | 'month';
  
  // Métricas básicas
  impressions: number;
  clicks: number;
  reach: number;
  frequency: number;
  
  // Métricas de custo
  spend: number;
  cpc: number;
  cpm: number;
  ctr: number;
  
  // Métricas de conversão
  conversions: number;
  conversion_rate: number;
  cost_per_conversion: number;
  
  // Métricas de vídeo
  video_views: number;
  video_view_rate: number;
  video_completions: number;
  
  // Engagement
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  
  // Métricas específicas da plataforma
  platform_metrics: Record<string, any>;
  
  created_at: string;
  updated_at: string;
}

// Interfaces para configurações de plataforma
export interface PlatformConfig {
  id: string;
  account_id: string;
  platform: AdPlatform;
  api_config: Record<string, any>;
  default_targeting: Record<string, any>;
  budget_settings: Record<string, any>;
  creative_settings: Record<string, any>;
  optimization_settings: Record<string, any>;
  reporting_settings: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Interfaces para jobs de sincronização
export interface SyncJob {
  id: string;
  account_id: string;
  platform: AdPlatform;
  sync_type: 'FULL' | 'INCREMENTAL' | 'METRICS_ONLY' | 'CAMPAIGNS_ONLY' | 'ADSETS_ONLY' | 'ADS_ONLY';
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  config: Record<string, any>;
  results: Record<string, any>;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// Interfaces para integração
export interface AdIntegration {
  id: string;
  account_id: string;
  integration_type: 'META-ADS' | 'GG-ADS' | 'TTK-ADS';
  integration_name: string;
  api_credentials: Record<string, any>;
  configuration: Record<string, any>;
  status: 'active' | 'inactive' | 'error' | 'pending';
  last_sync_at?: string;
  sync_frequency_hours: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

// Interfaces para limites de plano
export interface PlanLimits {
  campaigns: number;
  adsets: number;
  ads: number;
  creatives: number;
  platforms: AdPlatform[];
}

export interface LimitCheckResult {
  allowed: boolean;
  current: number;
  limit: number;
  remaining: number;
  platform: AdPlatform;
  type: 'campaign' | 'adset' | 'ad' | 'creative';
  error?: string;
}