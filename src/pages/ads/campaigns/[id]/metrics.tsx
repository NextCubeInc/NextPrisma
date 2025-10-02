// Página de métricas de uma campanha específica

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { useCampaigns, useMetrics } from '@/hooks/use-ads';
import { MetricsGrid, MetricsComparison } from '@/components/ads/metrics-display';
import { addDays, subDays } from 'date-fns';

export default function CampaignMetricsPage() {
  const router = useRouter();
  const { id } = router.query;
  const campaignId = id as string;

  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { campaigns } = useCampaigns();
  const campaign = campaigns.find(c => c.id === campaignId);

  const { 
    metrics, 
    loading, 
    refreshMetrics,
    exportMetrics 
  } = useMetrics({
    entityType: 'campaign',
    entityId: campaignId,
    dateRange,
  });

  const handleExport = async () => {
    try {
      await exportMetrics('csv');
    } catch (error) {
      console.error('Erro ao exportar métricas:', error);
    }
  };

  if (!campaign) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Campanha não encontrada</h1>
          <Button 
            variant="outline" 
            onClick={() => router.push('/ads/campaigns')}
            className="mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para campanhas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/ads/campaigns')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{campaign.name}</h1>
            <p className="text-muted-foreground">
              Métricas e performance da campanha
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DatePickerWithRange
            date={dateRange}
            onDateChange={setDateRange}
          />
          
          <Button
            variant="outline"
            size="sm"
            onClick={refreshMetrics}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Informações da campanha */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da campanha</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Plataforma</p>
              <p className="text-lg font-semibold">{campaign.platform}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Objetivo</p>
              <p className="text-lg font-semibold">{campaign.objective}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p className="text-lg font-semibold">{campaign.status}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Orçamento</p>
              <p className="text-lg font-semibold">
                R$ {campaign.budget?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo de orçamento</p>
              <p className="text-lg font-semibold">{campaign.budget_type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Data de criação</p>
              <p className="text-lg font-semibold">
                {new Date(campaign.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas principais */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas principais</CardTitle>
          <CardDescription>
            Performance da campanha no período selecionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MetricsGrid 
            metrics={metrics}
            loading={loading}
            showComparison={true}
          />
        </CardContent>
      </Card>

      {/* Comparação de períodos */}
      <Card>
        <CardHeader>
          <CardTitle>Comparação de períodos</CardTitle>
          <CardDescription>
            Compare a performance atual com o período anterior
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MetricsComparison
            currentMetrics={metrics}
            previousMetrics={metrics} // TODO: Implementar métricas do período anterior
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Gráficos de tendência */}
      <Card>
        <CardHeader>
          <CardTitle>Tendências</CardTitle>
          <CardDescription>
            Evolução das métricas ao longo do tempo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Gráficos de tendência serão implementados em breve
          </div>
        </CardContent>
      </Card>
    </div>
  );
}