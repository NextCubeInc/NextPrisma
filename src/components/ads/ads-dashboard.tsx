// Dashboard principal para gerenciamento de anúncios

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  MousePointer,
  Target,
  BarChart3,
  Settings,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Campaign,
  AdSet,
  Ad,
  Creative,
  AdPlatform,
  AdMetrics,
  SyncJob
} from '@/types/ads';
import {
  useCampaigns,
  useAdSets,
  useAdsList,
  useCreatives,
  useMetrics,
  useSyncJobs,
  useLimits
} from '@/hooks/use-ads';
import { PlatformSelector, PlatformBadge } from './platform-selector';
import { MetricCard } from './metrics-display';
import { AdsTable } from './ads-table';
import { CampaignForm } from './campaign-form';
import { AdSetForm } from './adset-form';
import { AdForm } from './ad-form';
import { CreativeLibrary } from './creative-library';
import { SyncStatus } from './sync-status';
import { DateRangePicker, useDateRangePicker } from './date-range-picker';
import { NotificationsBell } from './notifications-panel';
import { MetricsGrid } from './metrics-grid';
import { MetricsComparison } from './metrics-comparison';
import { PlatformModularityDemo } from './platform-specific-form';
import { useWorkspace } from '@/contexts/WorkspaceContext';

interface AdsDashboardProps {
  className?: string;
  clientId?: string;
}

export function AdsDashboard({ className = '', clientId }: AdsDashboardProps) {
  const { activeClient } = useWorkspace();
  const [selectedPlatform, setSelectedPlatform] = useState<AdPlatform>('META');
  const [activeTab, setActiveTab] = useState('overview');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createType, setCreateType] = useState<'campaign' | 'adset' | 'ad' | 'creative'>('campaign');
  
  // Date picker state
  const { 
    dateRange, 
    setDateRange, 
    comparisonRange, 
    setComparisonRange 
  } = useDateRangePicker();

  // Hooks para dados - usando activeClient.id como accountId
  const accountId = activeClient?.id || clientId;
  const { campaigns, isLoading: campaignsLoading, refresh: refetchCampaigns } = useCampaigns(selectedPlatform, accountId);
  const { adSets, isLoading: adSetsLoading, refresh: refetchAdSets } = useAdSets(selectedPlatform, accountId);
  const { ads, isLoading: adsLoading, refresh: refetchAds } = useAdsList(selectedPlatform, accountId);
  const { creatives, isLoading: creativesLoading, refresh: refetchCreatives } = useCreatives(selectedPlatform, accountId);
  const { metrics, isLoading: metricsLoading, refresh: refetchMetrics } = useMetrics(selectedPlatform, accountId, `${dateRange.startDate}_${dateRange.endDate}`);
  const { syncJobs, isLoading: syncJobsLoading } = useSyncJobs(selectedPlatform, accountId);
  const { checkLimits } = useLimits();

  const [limitsData, setLimitsData] = useState<any>(null);

  // Verificar limites ao carregar
  useEffect(() => {
    const loadLimits = async () => {
      const [campaignLimits, adSetLimits, adLimits, creativeLimits] = await Promise.all([
        checkLimits('campaigns', selectedPlatform),
        checkLimits('adsets', selectedPlatform),
        checkLimits('ads', selectedPlatform),
        checkLimits('creatives', selectedPlatform)
      ]);

      setLimitsData({
        campaigns: campaignLimits,
        adsets: adSetLimits,
        ads: adLimits,
        creatives: creativeLimits
      });
    };

    loadLimits();
  }, [selectedPlatform, checkLimits]);

  // Atualizar dados quando a plataforma mudar
  useEffect(() => {
    refetchCampaigns();
    refetchAdSets();
    refetchAds();
    refetchCreatives();
    refetchMetrics();
  }, [selectedPlatform]);

  const handleRefreshAll = async () => {
    await Promise.all([
      refetchCampaigns(),
      refetchAdSets(),
      refetchAds(),
      refetchCreatives(),
      refetchMetrics()
    ]);
  };

  const handleCreateNew = (type: 'campaign' | 'adset' | 'ad' | 'creative') => {
    setCreateType(type);
    setCreateDialogOpen(true);
  };

  const getStatusCounts = (items: any[]) => {
    return items.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const campaignStatusCounts = getStatusCounts(campaigns);
  const adSetStatusCounts = getStatusCounts(adSets);
  const adStatusCounts = getStatusCounts(ads);



  const OverviewCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Campanhas</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{campaigns.length}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {campaignStatusCounts.ACTIVE || 0} ativas
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {campaignStatusCounts.PAUSED || 0} pausadas
            </Badge>
          </div>
          {limitsData?.campaigns && (
            <Progress 
              value={(campaigns.length / limitsData.campaigns.limit) * 100} 
              className="mt-2"
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conjuntos de Anúncios</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{adSets.length}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {adSetStatusCounts.ACTIVE || 0} ativos
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {adSetStatusCounts.PAUSED || 0} pausados
            </Badge>
          </div>
          {limitsData?.adsets && (
            <Progress 
              value={(adSets.length / limitsData.adsets.limit) * 100} 
              className="mt-2"
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Anúncios</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{ads.length}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {adStatusCounts.ACTIVE || 0} ativos
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {adStatusCounts.PAUSED || 0} pausados
            </Badge>
          </div>
          {limitsData?.ads && (
            <Progress 
              value={(ads.length / limitsData.ads.limit) * 100} 
              className="mt-2"
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Criativos</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{creatives.length}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {creatives.filter(c => c.status === 'APPROVED').length} aprovados
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {creatives.filter(c => c.status === 'PENDING').length} pendentes
            </Badge>
          </div>
          {limitsData?.creatives && (
            <Progress 
              value={(creatives.length / limitsData.creatives.limit) * 100} 
              className="mt-2"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );



  return (
    <div className={`space-y-6 ${className}`}>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Anúncios</h1>
          <p className="text-muted-foreground">
            Gerencie suas campanhas, anúncios e criativos em todas as plataformas
          </p>
        </div>

        <div className="flex items-center gap-4">
          <NotificationsBell platformConfigId={selectedPlatform} />
          
          <PlatformSelector
            value={selectedPlatform}
            onChange={setSelectedPlatform}
            variant="select"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Criar novo
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleCreateNew('campaign')}>
                <Target className="w-4 h-4 mr-2" />
                Campanha
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCreateNew('adset')}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Conjunto de anúncios
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCreateNew('ad')}>
                <Eye className="w-4 h-4 mr-2" />
                Anúncio
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleCreateNew('creative')}>
                <Zap className="w-4 h-4 mr-2" />
                Criativo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Alertas de limite */}
      {limitsData && Object.values(limitsData).some((limit: any) => limit && !limit.allowed) && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Você atingiu alguns limites do seu plano atual. 
            Considere fazer upgrade para criar mais conteúdo.
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs principais */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="adsets">Conjuntos</TabsTrigger>
          <TabsTrigger value="ads">Anúncios</TabsTrigger>
          <TabsTrigger value="creatives">Criativos</TabsTrigger>
          <TabsTrigger value="modular">UI Modular</TabsTrigger>
          <TabsTrigger value="sync">Sincronização</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="flex items-center justify-between">
            <OverviewCards />
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              comparisonValue={comparisonRange}
              onComparisonChange={setComparisonRange}
              comparison
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Performance</CardTitle>
                  <CardDescription>
                    Últimos {dateRange === '7d' ? '7 dias' : dateRange === '30d' ? '30 dias' : '90 dias'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MetricsGrid 
                    platformConfigId={selectedPlatform}
                    dateRange={dateRange}
                    refreshInterval={30000}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <SyncStatus />
              
              {comparisonRange && (
                <Card>
                  <CardHeader>
                    <CardTitle>Comparação de Períodos</CardTitle>
                    <CardDescription>
                      Compare métricas entre diferentes períodos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MetricsComparison
                      platformConfigId={selectedPlatform}
                      currentPeriod={dateRange}
                      previousPeriod={comparisonRange}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="campaigns">
          <AdsTable
            type="campaigns"
            data={campaigns}
            loading={campaignsLoading}
            onEdit={(campaign) => {
              // Implementar edição
            }}
            onDelete={(campaign) => {
              // Implementar exclusão
            }}
            onDuplicate={(campaign) => {
              // Implementar duplicação
            }}
          />
        </TabsContent>

        <TabsContent value="adsets">
          <AdsTable
            type="adsets"
            data={adSets}
            loading={adSetsLoading}
            onEdit={(adSet) => {
              // Implementar edição
            }}
            onDelete={(adSet) => {
              // Implementar exclusão
            }}
            onDuplicate={(adSet) => {
              // Implementar duplicação
            }}
          />
        </TabsContent>

        <TabsContent value="ads">
          <AdsTable
            type="ads"
            data={ads}
            loading={adsLoading}
            onEdit={(ad) => {
              // Implementar edição
            }}
            onDelete={(ad) => {
              // Implementar exclusão
            }}
            onDuplicate={(ad) => {
              // Implementar duplicação
            }}
          />
        </TabsContent>

        <TabsContent value="creatives">
          <CreativeLibrary
            creatives={creatives}
            onUpload={async (files, metadata) => {
              // Implementar upload
            }}
            onEdit={(creative) => {
              // Implementar edição
            }}
            onDelete={(creative) => {
              // Implementar exclusão
            }}
            onPreview={(creative) => {
              // Implementar preview
            }}
            loading={creativesLoading}
          />
        </TabsContent>

        <TabsContent value="modular" className="space-y-6">
          <PlatformModularityDemo />
        </TabsContent>

        <TabsContent value="sync">
          <SyncStatus platformConfigId={selectedPlatform} />
        </TabsContent>
      </Tabs>

      {/* Dialog de criação */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Criar {createType === 'campaign' ? 'Campanha' : 
                     createType === 'adset' ? 'Conjunto de Anúncios' :
                     createType === 'ad' ? 'Anúncio' : 'Criativo'}
            </DialogTitle>
            <DialogDescription>
              Configure as informações para criar um novo {createType === 'campaign' ? 'campanha' : 
                                                           createType === 'adset' ? 'conjunto de anúncios' :
                                                           createType === 'ad' ? 'anúncio' : 'criativo'}
            </DialogDescription>
          </DialogHeader>

          {createType === 'campaign' && (
            <CampaignForm
              platform={selectedPlatform}
              onSubmit={async (data) => {
                // Implementar criação de campanha
                setCreateDialogOpen(false);
              }}
              onCancel={() => setCreateDialogOpen(false)}
            />
          )}

          {createType === 'adset' && (
            <AdSetForm
              campaigns={campaigns}
              platform={selectedPlatform}
              onSubmit={async (data) => {
                // Implementar criação de conjunto
                setCreateDialogOpen(false);
              }}
              onCancel={() => setCreateDialogOpen(false)}
            />
          )}

          {createType === 'ad' && (
            <AdForm
              adSets={adSets}
              creatives={creatives}
              platform={selectedPlatform}
              onSubmit={async (data) => {
                // Implementar criação de anúncio
                setCreateDialogOpen(false);
              }}
              onCancel={() => setCreateDialogOpen(false)}
            />
          )}

          {createType === 'creative' && (
            <div className="p-4">
              <CreativeLibrary
                creatives={[]}
                onUpload={async (files, metadata) => {
                  // Implementar upload de criativo
                  setCreateDialogOpen(false);
                }}
                onEdit={() => {}}
                onDelete={() => {}}
                onPreview={() => {}}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}