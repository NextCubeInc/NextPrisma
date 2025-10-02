import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

interface MetaCampaign {
  id: string;
  name: string;
  status: string;
  objective: string;
  daily_budget?: string;
  lifetime_budget?: string;
  start_time?: string;
  stop_time?: string;
  created_time: string;
  updated_time: string;
  account_id: string;
}

interface SyncJobRequest {
  platform_config_id: string;
  sync_type: 'campaigns' | 'adsets' | 'ads' | 'creatives' | 'metrics';
  filters?: Record<string, any>;
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

    const { platform_config_id, sync_type, filters }: SyncJobRequest = await req.json();

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
        sync_type,
        status: 'running',
        started_at: new Date().toISOString(),
        filters,
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
      // Sync campaigns from Meta API
      const campaigns = await syncMetaCampaigns(config.access_token, config.account_id, filters);
      
      // Update campaigns in database
      for (const campaign of campaigns) {
        await upsertCampaign(supabase, campaign, platform_config_id);
      }

      // Update sync job as completed
      await supabase
        .from('sync_jobs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          records_synced: campaigns.length,
        })
        .eq('id', syncJob.id);

      return new Response(JSON.stringify({
        success: true,
        job_id: syncJob.id,
        records_synced: campaigns.length,
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
    console.error('Sync error:', error);
    return new Response(JSON.stringify({ 
      error: 'Sync failed', 
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

async function syncMetaCampaigns(
  accessToken: string, 
  accountId: string, 
  filters?: Record<string, any>
): Promise<MetaCampaign[]> {
  const fields = [
    'id',
    'name',
    'status',
    'objective',
    'daily_budget',
    'lifetime_budget',
    'start_time',
    'stop_time',
    'created_time',
    'updated_time'
  ].join(',');

  let url = `https://graph.facebook.com/v18.0/act_${accountId}/campaigns?fields=${fields}&access_token=${accessToken}`;
  
  // Apply filters
  if (filters?.date_preset) {
    url += `&date_preset=${filters.date_preset}`;
  }
  if (filters?.time_range) {
    url += `&time_range=${JSON.stringify(filters.time_range)}`;
  }

  const campaigns: MetaCampaign[] = [];
  
  while (url) {
    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Meta API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    campaigns.push(...data.data);
    
    // Handle pagination
    url = data.paging?.next || null;
  }

  return campaigns;
}

async function upsertCampaign(
  supabase: any,
  metaCampaign: MetaCampaign,
  platformConfigId: string
) {
  const campaignData = {
    platform_id: metaCampaign.id,
    platform_config_id: platformConfigId,
    name: metaCampaign.name,
    status: mapMetaStatus(metaCampaign.status),
    objective: metaCampaign.objective,
    budget_type: metaCampaign.daily_budget ? 'daily' : 'lifetime',
    budget_amount: parseFloat(metaCampaign.daily_budget || metaCampaign.lifetime_budget || '0') / 100, // Convert from cents
    start_time: metaCampaign.start_time,
    end_time: metaCampaign.stop_time,
    platform_created_at: metaCampaign.created_time,
    platform_updated_at: metaCampaign.updated_time,
    last_synced_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('campaigns')
    .upsert(campaignData, {
      onConflict: 'platform_id,platform_config_id',
    });

  if (error) {
    console.error('Failed to upsert campaign:', error);
    throw error;
  }
}

function mapMetaStatus(metaStatus: string): string {
  const statusMap: Record<string, string> = {
    'ACTIVE': 'active',
    'PAUSED': 'paused',
    'DELETED': 'archived',
    'ARCHIVED': 'archived',
  };
  
  return statusMap[metaStatus] || 'paused';
}