import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointer, 
  DollarSign, 
  Target,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { useMetricsCache } from '@/hooks/use-metrics-cache';
import { MetricsAggregator, MetricsFormatter } from '@/lib/metrics/metrics-aggregator';
import { CacheKey } from '@/lib/cache/metrics-cache';

interface MetricsGridProps {
  entityType: 'campaign' | 'adset' | 'ad';
  entityId: string;
  platform: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  comparisonDateRange?: {
    startDate: string;
    endDate: string;
  };
  className?: string;
}

export function MetricsGrid({
  entityType,
  entityId,
  platform,
  dateRange,
  comparisonDateRange,
  className
}: MetricsGridProps) {
  const cacheKey: CacheKey = {
    entityType,
    entityId,
    platform,
    dateRange
  };

  const comparisonCacheKey: CacheKey | null = comparisonDateRange ? {
    entityType,
    entityId,
    platform,
    dateRange: comparisonDateRange
  } : null;

  const {
    data: currentData,
    isLoading: isCurrentLoading,
    isError: isCurrentError,
    error: currentError,
    isStale: isCurrentStale,
    refetch: refetchCurrent
  } = useMetricsCache(cacheKey);

  const {
    data: comparisonData,
    isLoading: isComparisonLoading,
    isError: isComparisonError
  } = useMetricsCache(comparisonCacheKey);

  const isLoading = isCurrentLoading || (comparisonCacheKey && isComparisonLoading);
  const isError = isCurrentError || isComparisonError;

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Erro ao carregar métricas: {currentError?.message}
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2"
            onClick={refetchCurrent}
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Tentar novamente
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <MetricsGridSkeleton />;
  }

  const currentMetrics = currentData ? MetricsAggregator.aggregate(currentData) : null;
  const comparison = comparisonData && currentData ? 
    MetricsAggregator.compare(currentData, comparisonData) : null;

  if (!currentMetrics) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Nenhuma métrica encontrada para o período selecionado.
        </AlertDescription>
      </Alert>
    );
  }

  const metrics = [
    {
      title: 'Impressões',
      value: MetricsFormatter.formatCompactNumber(currentMetrics.impressions),
      icon: Eye,
      change: comparison?.changes.impressions,
      color: 'blue'
    },
    {
      title: 'Cliques',
      value: MetricsFormatter.formatCompactNumber(currentMetrics.clicks),
      icon: MousePointer,
      change: comparison?.changes.clicks,
      color: 'green'
    },
    {
      title: 'Investimento',
      value: MetricsFormatter.formatCurrency(currentMetrics.spend),
      icon: DollarSign,
      change: comparison?.changes.spend,
      color: 'red'
    },
    {
      title: 'Conversões',
      value: MetricsFormatter.formatNumber(currentMetrics.conversions),
      icon: Target,
      change: comparison?.changes.conversions,
      color: 'purple'
    },
    {
      title: 'CTR',
      value: MetricsFormatter.formatPercentage(currentMetrics.ctr),
      icon: TrendingUp,
      change: comparison?.changes.ctr,
      color: 'orange'
    },
    {
      title: 'CPC',
      value: MetricsFormatter.formatCurrency(currentMetrics.cpc),
      icon: DollarSign,
      change: comparison?.changes.cpc,
      color: 'yellow'
    },
    {
      title: 'CPM',
      value: MetricsFormatter.formatCurrency(currentMetrics.cpm),
      icon: DollarSign,
      change: comparison?.changes.cpm,
      color: 'indigo'
    },
    {
      title: 'ROAS',
      value: `${currentMetrics.roas.toFixed(2)}x`,
      icon: TrendingUp,
      change: comparison?.changes.roas,
      color: 'pink'
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {isCurrentStale && (
        <Alert>
          <RefreshCw className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            Os dados podem estar desatualizados.
            <Button variant="outline" size="sm" onClick={refetchCurrent}>
              Atualizar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {currentMetrics.revenue > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Métricas de Receita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {MetricsFormatter.formatCurrency(currentMetrics.revenue)}
                </div>
                <div className="text-sm text-muted-foreground">Receita Total</div>
                {comparison && (
                  <ChangeIndicator change={comparison.changes.revenue} />
                )}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {MetricsFormatter.formatPercentage(currentMetrics.conversionRate)}
                </div>
                <div className="text-sm text-muted-foreground">Taxa de Conversão</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {MetricsFormatter.formatCurrency(currentMetrics.costPerConversion)}
                </div>
                <div className="text-sm text-muted-foreground">Custo por Conversão</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <InsightsCard metrics={currentMetrics} />
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  change?: { value: number; percentage: number };
  color: string;
}

function MetricCard({ title, value, icon: Icon, change, color }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && <ChangeIndicator change={change} />}
          </div>
          <div className={`p-2 rounded-lg bg-${color}-100`}>
            <Icon className={`w-6 h-6 text-${color}-600`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ChangeIndicatorProps {
  change: { value: number; percentage: number };
}

function ChangeIndicator({ change }: ChangeIndicatorProps) {
  const formatted = MetricsFormatter.formatChange(change);
  
  return (
    <div className="flex items-center mt-1">
      {formatted.isPositive ? (
        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
      ) : formatted.isNegative ? (
        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
      ) : null}
      <span className={`text-sm ${
        formatted.isPositive ? 'text-green-600' : 
        formatted.isNegative ? 'text-red-600' : 
        'text-muted-foreground'
      }`}>
        {formatted.formatted}
      </span>
    </div>
  );
}

interface InsightsCardProps {
  metrics: ReturnType<typeof MetricsAggregator.aggregate>;
}

function InsightsCard({ metrics }: InsightsCardProps) {
  const insights = MetricsAggregator.getPerformanceInsights(metrics);

  if (insights.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Insights de Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {insights.map((insight, index) => (
            <Badge key={index} variant="secondary" className="mr-2 mb-2">
              {insight}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MetricsGridSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-10 w-10 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}