import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

interface MetaInsights {
  impressions: string;
  clicks: string;
  spend: string;
  reach?: string;
  frequency?: string;
  ctr: string;
  cpc: string;
  cpm: string;
  cpp?: string;
  actions?: Array<{
    action_type: string;
    value: string;
  }>;
  video_play_actions?: Array<{
    action_type: string;
    value: string;
  }>;
  date_start: string;
  date_stop: string;
}

interface SyncMetricsRequest {
  platform_config_id: string;
  entity_type: 'campaign' | 'adset' | 'ad';
  entity_ids?: string[];
  date_range: {
    since: string;
    until: string;
  };
}

Deno.serve(async (req: Request) => {
  try {
    // CORS headers
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      });
    }

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { platform_config_id, entity_type, entity_ids, date_range }: SyncMetricsRequest = await req.json();

    // Get platform configuration
    const { data: config, error: configError } = await supabase
      .from('platform_configurations')
      .select('*')
      .eq('id', platform_config_id)
      .eq('platform', 'meta')
      .single();

    if (configError || !config) {
      return new Response(JSON.stringify({ error: 'Platform configuration not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create sync job record
    const { data: syncJob, error: jobError } = await supabase
      .from('sync_jobs')
      .insert({
        platform_config_id,
        sync_type: 'metrics',
        status: 'running',
        started_at: new Date().toISOString(),
        filters: { entity_type, entity_ids, date_range },
      })
      .select()
      .single();

    if (jobError) {
      return new Response(JSON.stringify({ error: 'Failed to create sync job' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      let totalRecords = 0;

      // Get entities to sync metrics for
      const entities = await getEntitiesForMetrics(supabase, platform_config_id, entity_type, entity_ids);

      for (const entity of entities) {
        const insights = await getMetaInsights(
          config.access_token,
          entity.platform_id,
          entity_type,
          date_range
        );

        for (const insight of insights) {
          await upsertMetrics(supabase, entity, insight, entity_type);
          totalRecords++;
        }
      }

      // Update sync job as completed
      await supabase
        .from('sync_jobs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          records_synced: totalRecords,
        })
        .eq('id', syncJob.id);

      return new Response(JSON.stringify({
        success: true,
        job_id: syncJob.id,
        records_synced: totalRecords,
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

    } catch (error) {
      // Update sync job as failed
      await supabase
        .from('sync_jobs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_message: error.message,
        })
        .eq('id', syncJob.id);

      throw error;
    }

  } catch (error) {
    console.error('Metrics sync error:', error);
    return new Response(JSON.stringify({ 
      error: 'Metrics sync failed', 
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});

async function getEntitiesForMetrics(
  supabase: any,
  platformConfigId: string,
  entityType: string,
  entityIds?: string[]
) {
  const tableName = entityType === 'campaign' ? 'campaigns' : 
                   entityType === 'adset' ? 'ad_sets' : 'ads';

  let query = supabase
    .from(tableName)
    .select('id, platform_id')
    .eq('platform_config_id', platformConfigId);

  if (entityIds && entityIds.length > 0) {
    query = query.in('platform_id', entityIds);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to get entities: ${error.message}`);
  }

  return data || [];
}

async function getMetaInsights(
  accessToken: string,
  entityId: string,
  entityType: string,
  dateRange: { since: string; until: string }
): Promise<MetaInsights[]> {
  const fields = [
    'impressions',
    'clicks',
    'spend',
    'reach',
    'frequency',
    'ctr',
    'cpc',
    'cpm',
    'cpp',
    'actions',
    'video_play_actions'
  ].join(',');

  const timeRange = JSON.stringify({
    since: dateRange.since,
    until: dateRange.until
  });

  const url = `https://graph.facebook.com/v18.0/${entityId}/insights?fields=${fields}&time_range=${timeRange}&access_token=${accessToken}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Meta API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.data || [];
}

async function upsertMetrics(
  supabase: any,
  entity: any,
  insight: MetaInsights,
  entityType: string
) {
  // Extract conversion metrics
  const conversions = insight.actions?.find(action => 
    action.action_type === 'purchase' || action.action_type === 'complete_registration'
  )?.value || '0';

  const videoViews = insight.video_play_actions?.find(action => 
    action.action_type === 'video_view'
  )?.value || '0';

  const metricsData = {
    entity_type: entityType,
    entity_id: entity.id,
    date: insight.date_start,
    impressions: parseInt(insight.impressions || '0'),
    clicks: parseInt(insight.clicks || '0'),
    spend: parseFloat(insight.spend || '0'),
    reach: parseInt(insight.reach || '0'),
    frequency: parseFloat(insight.frequency || '0'),
    ctr: parseFloat(insight.ctr || '0'),
    cpc: parseFloat(insight.cpc || '0'),
    cpm: parseFloat(insight.cpm || '0'),
    cpp: parseFloat(insight.cpp || '0'),
    conversions: parseInt(conversions),
    video_views: parseInt(videoViews),
    roas: calculateROAS(parseFloat(insight.spend || '0'), parseInt(conversions)),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('metrics')
    .upsert(metricsData, {
      onConflict: 'entity_type,entity_id,date',
    });

  if (error) {
    console.error('Failed to upsert metrics:', error);
    throw error;
  }
}

function calculateROAS(spend: number, conversions: number): number {
  if (spend === 0) return 0;
  // Assuming average order value of $50 for demo purposes
  // In real implementation, this should come from actual conversion values
  const revenue = conversions * 50;
  return revenue / spend;
}