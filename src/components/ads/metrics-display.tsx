// Componente para exibição de métricas de anúncios

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointer, 
  DollarSign, 
  Target,
  Users,
  Play,
  Heart,
  Share,
  MessageCircle
} from 'lucide-react';
import { AdMetrics } from '@/types/ads';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  description?: string;
  loading?: boolean;
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  description,
  loading = false,
  className = ''
}: MetricCardProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-24" />
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = () => {
    if (change === undefined) return null;
    
    if (changeType === 'positive') {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (changeType === 'negative') {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-green-600';
    if (changeType === 'negative') return 'text-red-600';
    return 'text-muted-foreground';
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(change !== undefined || description) && (
          <div className="flex items-center gap-2 text-xs">
            {change !== undefined && (
              <div className={`flex items-center gap-1 ${getChangeColor()}`}>
                {getTrendIcon()}
                <span>{change > 0 ? '+' : ''}{change}%</span>
              </div>
            )}
            {description && (
              <span className="text-muted-foreground">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface MetricsGridProps {
  metrics: AdMetrics[];
  loading?: boolean;
  className?: string;
}

export function MetricsGrid({ metrics, loading = false, className = '' }: MetricsGridProps) {
  // Calcular métricas agregadas
  const aggregatedMetrics = React.useMemo(() => {
    if (metrics.length === 0) {
      return {
        impressions: 0,
        clicks: 0,
        spend: 0,
        conversions: 0,
        ctr: 0,
        cpc: 0,
        cpm: 0,
        roas: 0
      };
    }

    const totals = metrics.reduce((acc, metric) => ({
      impressions: acc.impressions + (metric.impressions || 0),
      clicks: acc.clicks + (metric.clicks || 0),
      spend: acc.spend + (metric.spend || 0),
      conversions: acc.conversions + (metric.conversions || 0),
      video_views: acc.video_views + (metric.video_views || 0),
      engagement: acc.engagement + (metric.engagement || 0)
    }), {
      impressions: 0,
      clicks: 0,
      spend: 0,
      conversions: 0,
      video_views: 0,
      engagement: 0
    });

    const ctr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;
    const cpc = totals.clicks > 0 ? totals.spend / totals.clicks : 0;
    const cpm = totals.impressions > 0 ? (totals.spend / totals.impressions) * 1000 : 0;
    const roas = totals.spend > 0 ? (totals.conversions * 50) / totals.spend : 0; // Assumindo valor médio de conversão

    return {
      ...totals,
      ctr,
      cpc,
      cpm,
      roas
    };
  }, [metrics]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 ${className}`}>
      <MetricCard
        title="Impressões"
        value={formatNumber(aggregatedMetrics.impressions)}
        icon={<Eye className="w-4 h-4" />}
        loading={loading}
      />
      
      <MetricCard
        title="Cliques"
        value={formatNumber(aggregatedMetrics.clicks)}
        icon={<MousePointer className="w-4 h-4" />}
        loading={loading}
      />
      
      <MetricCard
        title="Gasto"
        value={formatCurrency(aggregatedMetrics.spend)}
        icon={<DollarSign className="w-4 h-4" />}
        loading={loading}
      />
      
      <MetricCard
        title="Conversões"
        value={formatNumber(aggregatedMetrics.conversions)}
        icon={<Target className="w-4 h-4" />}
        loading={loading}
      />
      
      <MetricCard
        title="CTR"
        value={formatPercentage(aggregatedMetrics.ctr)}
        description="Taxa de cliques"
        loading={loading}
      />
      
      <MetricCard
        title="CPC"
        value={formatCurrency(aggregatedMetrics.cpc)}
        description="Custo por clique"
        loading={loading}
      />
      
      <MetricCard
        title="CPM"
        value={formatCurrency(aggregatedMetrics.cpm)}
        description="Custo por mil"
        loading={loading}
      />
      
      <MetricCard
        title="ROAS"
        value={`${aggregatedMetrics.roas.toFixed(2)}x`}
        description="Retorno do investimento"
        loading={loading}
      />
    </div>
  );
}

interface DetailedMetricsProps {
  metrics: AdMetrics[];
  loading?: boolean;
  showVideoMetrics?: boolean;
  showEngagementMetrics?: boolean;
  className?: string;
}

export function DetailedMetrics({ 
  metrics, 
  loading = false,
  showVideoMetrics = false,
  showEngagementMetrics = false,
  className = '' 
}: DetailedMetricsProps) {
  const aggregatedMetrics = React.useMemo(() => {
    if (metrics.length === 0) return null;

    return metrics.reduce((acc, metric) => ({
      impressions: acc.impressions + (metric.impressions || 0),
      clicks: acc.clicks + (metric.clicks || 0),
      spend: acc.spend + (metric.spend || 0),
      conversions: acc.conversions + (metric.conversions || 0),
      video_views: acc.video_views + (metric.video_views || 0),
      video_25_percent_views: acc.video_25_percent_views + (metric.video_25_percent_views || 0),
      video_50_percent_views: acc.video_50_percent_views + (metric.video_50_percent_views || 0),
      video_75_percent_views: acc.video_75_percent_views + (metric.video_75_percent_views || 0),
      video_100_percent_views: acc.video_100_percent_views + (metric.video_100_percent_views || 0),
      engagement: acc.engagement + (metric.engagement || 0),
      likes: acc.likes + (metric.likes || 0),
      shares: acc.shares + (metric.shares || 0),
      comments: acc.comments + (metric.comments || 0)
    }), {
      impressions: 0,
      clicks: 0,
      spend: 0,
      conversions: 0,
      video_views: 0,
      video_25_percent_views: 0,
      video_50_percent_views: 0,
      video_75_percent_views: 0,
      video_100_percent_views: 0,
      engagement: 0,
      likes: 0,
      shares: 0,
      comments: 0
    });
  }, [metrics]);

  if (!aggregatedMetrics) return null;

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Métricas principais */}
      <MetricsGrid metrics={metrics} loading={loading} />

      {/* Métricas de vídeo */}
      {showVideoMetrics && aggregatedMetrics.video_views > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Métricas de Vídeo</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <MetricCard
              title="Visualizações"
              value={formatNumber(aggregatedMetrics.video_views)}
              icon={<Play className="w-4 h-4" />}
              loading={loading}
            />
            
            <MetricCard
              title="25% Assistido"
              value={formatNumber(aggregatedMetrics.video_25_percent_views)}
              loading={loading}
            />
            
            <MetricCard
              title="50% Assistido"
              value={formatNumber(aggregatedMetrics.video_50_percent_views)}
              loading={loading}
            />
            
            <MetricCard
              title="75% Assistido"
              value={formatNumber(aggregatedMetrics.video_75_percent_views)}
              loading={loading}
            />
            
            <MetricCard
              title="100% Assistido"
              value={formatNumber(aggregatedMetrics.video_100_percent_views)}
              loading={loading}
            />
          </div>
        </div>
      )}

      {/* Métricas de engajamento */}
      {showEngagementMetrics && aggregatedMetrics.engagement > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Métricas de Engajamento</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="Engajamento Total"
              value={formatNumber(aggregatedMetrics.engagement)}
              icon={<Users className="w-4 h-4" />}
              loading={loading}
            />
            
            <MetricCard
              title="Curtidas"
              value={formatNumber(aggregatedMetrics.likes)}
              icon={<Heart className="w-4 h-4" />}
              loading={loading}
            />
            
            <MetricCard
              title="Compartilhamentos"
              value={formatNumber(aggregatedMetrics.shares)}
              icon={<Share className="w-4 h-4" />}
              loading={loading}
            />
            
            <MetricCard
              title="Comentários"
              value={formatNumber(aggregatedMetrics.comments)}
              icon={<MessageCircle className="w-4 h-4" />}
              loading={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para comparação de métricas
interface MetricsComparisonProps {
  currentMetrics: AdMetrics[];
  previousMetrics: AdMetrics[];
  loading?: boolean;
  className?: string;
}

export function MetricsComparison({
  currentMetrics,
  previousMetrics,
  loading = false,
  className = ''
}: MetricsComparisonProps) {
  const comparison = React.useMemo(() => {
    const current = currentMetrics.reduce((acc, m) => ({
      impressions: acc.impressions + (m.impressions || 0),
      clicks: acc.clicks + (m.clicks || 0),
      spend: acc.spend + (m.spend || 0),
      conversions: acc.conversions + (m.conversions || 0)
    }), { impressions: 0, clicks: 0, spend: 0, conversions: 0 });

    const previous = previousMetrics.reduce((acc, m) => ({
      impressions: acc.impressions + (m.impressions || 0),
      clicks: acc.clicks + (m.clicks || 0),
      spend: acc.spend + (m.spend || 0),
      conversions: acc.conversions + (m.conversions || 0)
    }), { impressions: 0, clicks: 0, spend: 0, conversions: 0 });

    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    return {
      impressions: calculateChange(current.impressions, previous.impressions),
      clicks: calculateChange(current.clicks, previous.clicks),
      spend: calculateChange(current.spend, previous.spend),
      conversions: calculateChange(current.conversions, previous.conversions)
    };
  }, [currentMetrics, previousMetrics]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const currentTotals = currentMetrics.reduce((acc, m) => ({
    impressions: acc.impressions + (m.impressions || 0),
    clicks: acc.clicks + (m.clicks || 0),
    spend: acc.spend + (m.spend || 0),
    conversions: acc.conversions + (m.conversions || 0)
  }), { impressions: 0, clicks: 0, spend: 0, conversions: 0 });

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      <MetricCard
        title="Impressões"
        value={formatNumber(currentTotals.impressions)}
        change={comparison.impressions}
        changeType={comparison.impressions >= 0 ? 'positive' : 'negative'}
        icon={<Eye className="w-4 h-4" />}
        loading={loading}
      />
      
      <MetricCard
        title="Cliques"
        value={formatNumber(currentTotals.clicks)}
        change={comparison.clicks}
        changeType={comparison.clicks >= 0 ? 'positive' : 'negative'}
        icon={<MousePointer className="w-4 h-4" />}
        loading={loading}
      />
      
      <MetricCard
        title="Gasto"
        value={formatCurrency(currentTotals.spend)}
        change={comparison.spend}
        changeType={comparison.spend <= 0 ? 'positive' : 'negative'}
        icon={<DollarSign className="w-4 h-4" />}
        loading={loading}
      />
      
      <MetricCard
        title="Conversões"
        value={formatNumber(currentTotals.conversions)}
        change={comparison.conversions}
        changeType={comparison.conversions >= 0 ? 'positive' : 'negative'}
        icon={<Target className="w-4 h-4" />}
        loading={loading}
      />
    </div>
  );
}