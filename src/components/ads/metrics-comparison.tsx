import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Calendar,
  BarChart3,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { useMultipleMetricsCache } from '@/hooks/use-metrics-cache';
import { MetricsAggregator, MetricsFormatter } from '@/lib/metrics/metrics-aggregator';
import { CacheKey } from '@/lib/cache/metrics-cache';

interface MetricsComparisonProps {
  entityType: 'campaign' | 'adset' | 'ad';
  entityId: string;
  platform: string;
  currentPeriod: {
    startDate: string;
    endDate: string;
    label: string;
  };
  comparisonPeriod: {
    startDate: string;
    endDate: string;
    label: string;
  };
  className?: string;
}

export function MetricsComparison({
  entityType,
  entityId,
  platform,
  currentPeriod,
  comparisonPeriod,
  className
}: MetricsComparisonProps) {
  const cacheKeys: CacheKey[] = [
    {
      entityType,
      entityId,
      platform,
      dateRange: {
        startDate: currentPeriod.startDate,
        endDate: currentPeriod.endDate
      }
    },
    {
      entityType,
      entityId,
      platform,
      dateRange: {
        startDate: comparisonPeriod.startDate,
        endDate: comparisonPeriod.endDate
      }
    }
  ];

  const {
    data,
    isLoading,
    isError,
    errors,
    refetchAll
  } = useMultipleMetricsCache(cacheKeys);

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Erro ao carregar dados de comparação.
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2"
            onClick={refetchAll}
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Tentar novamente
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <MetricsComparisonSkeleton />;
  }

  const [currentData, comparisonData] = data;

  if (!currentData || !comparisonData) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Dados insuficientes para comparação.
        </AlertDescription>
      </Alert>
    );
  }

  const comparison = MetricsAggregator.compare(currentData, comparisonData);

  const metrics = [
    {
      key: 'impressions',
      label: 'Impressões',
      current: MetricsFormatter.formatCompactNumber(comparison.current.impressions),
      previous: MetricsFormatter.formatCompactNumber(comparison.previous.impressions),
      change: comparison.changes.impressions
    },
    {
      key: 'clicks',
      label: 'Cliques',
      current: MetricsFormatter.formatCompactNumber(comparison.current.clicks),
      previous: MetricsFormatter.formatCompactNumber(comparison.previous.clicks),
      change: comparison.changes.clicks
    },
    {
      key: 'spend',
      label: 'Investimento',
      current: MetricsFormatter.formatCurrency(comparison.current.spend),
      previous: MetricsFormatter.formatCurrency(comparison.previous.spend),
      change: comparison.changes.spend
    },
    {
      key: 'conversions',
      label: 'Conversões',
      current: MetricsFormatter.formatNumber(comparison.current.conversions),
      previous: MetricsFormatter.formatNumber(comparison.previous.conversions),
      change: comparison.changes.conversions
    },
    {
      key: 'ctr',
      label: 'CTR',
      current: MetricsFormatter.formatPercentage(comparison.current.ctr),
      previous: MetricsFormatter.formatPercentage(comparison.previous.ctr),
      change: comparison.changes.ctr
    },
    {
      key: 'cpc',
      label: 'CPC',
      current: MetricsFormatter.formatCurrency(comparison.current.cpc),
      previous: MetricsFormatter.formatCurrency(comparison.previous.cpc),
      change: comparison.changes.cpc
    },
    {
      key: 'roas',
      label: 'ROAS',
      current: `${comparison.current.roas.toFixed(2)}x`,
      previous: `${comparison.previous.roas.toFixed(2)}x`,
      change: comparison.changes.roas
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Comparação de Períodos
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">{currentPeriod.label}</span>
            </div>
            <span>vs</span>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">{comparisonPeriod.label}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.map((metric) => (
              <ComparisonRow key={metric.key} {...metric} />
            ))}
          </div>
        </CardContent>
      </Card>

      {comparison.current.revenue > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Comparação de Receita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-2">
                  {currentPeriod.label}
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {MetricsFormatter.formatCurrency(comparison.current.revenue)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Taxa de conversão: {MetricsFormatter.formatPercentage(comparison.current.conversionRate)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">
                  {comparisonPeriod.label}
                </div>
                <div className="text-2xl font-bold text-gray-600">
                  {MetricsFormatter.formatCurrency(comparison.previous.revenue)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Taxa de conversão: {MetricsFormatter.formatPercentage(comparison.previous.conversionRate)}
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Variação da Receita</span>
                <ChangeIndicator change={comparison.changes.revenue} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <PerformanceSummary comparison={comparison} />
    </div>
  );
}

interface ComparisonRowProps {
  label: string;
  current: string;
  previous: string;
  change: { value: number; percentage: number };
}

function ComparisonRow({ label, current, previous, change }: ComparisonRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
      <div className="font-medium text-sm">{label}</div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="font-semibold">{current}</div>
          <div className="text-xs text-muted-foreground">{previous}</div>
        </div>
        <div className="w-20 text-right">
          <ChangeIndicator change={change} />
        </div>
      </div>
    </div>
  );
}

interface ChangeIndicatorProps {
  change: { value: number; percentage: number };
}

function ChangeIndicator({ change }: ChangeIndicatorProps) {
  const formatted = MetricsFormatter.formatChange(change);
  
  if (change.percentage === 0) {
    return (
      <div className="flex items-center text-muted-foreground">
        <Minus className="w-4 h-4 mr-1" />
        <span className="text-sm">0%</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${
      formatted.isPositive ? 'text-green-600' : 'text-red-600'
    }`}>
      {formatted.isPositive ? (
        <TrendingUp className="w-4 h-4 mr-1" />
      ) : (
        <TrendingDown className="w-4 h-4 mr-1" />
      )}
      <span className="text-sm font-medium">{formatted.formatted}</span>
    </div>
  );
}

interface PerformanceSummaryProps {
  comparison: ReturnType<typeof MetricsAggregator.compare>;
}

function PerformanceSummary({ comparison }: PerformanceSummaryProps) {
  const improvements: string[] = [];
  const concerns: string[] = [];

  // Analisar melhorias
  if (comparison.changes.roas.percentage > 10) {
    improvements.push('ROAS melhorou significativamente');
  }
  if (comparison.changes.ctr.percentage > 15) {
    improvements.push('Taxa de cliques aumentou');
  }
  if (comparison.changes.conversions.percentage > 20) {
    improvements.push('Conversões cresceram');
  }

  // Analisar preocupações
  if (comparison.changes.cpc.percentage > 20) {
    concerns.push('Custo por clique aumentou');
  }
  if (comparison.changes.roas.percentage < -15) {
    concerns.push('ROAS diminuiu');
  }
  if (comparison.changes.ctr.percentage < -10) {
    concerns.push('Taxa de cliques caiu');
  }

  if (improvements.length === 0 && concerns.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo de Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {improvements.length > 0 && (
            <div>
              <h4 className="font-medium text-green-700 mb-2">Melhorias</h4>
              <div className="space-y-1">
                {improvements.map((improvement, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                    {improvement}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {concerns.length > 0 && (
            <div>
              <h4 className="font-medium text-red-700 mb-2">Pontos de Atenção</h4>
              <div className="space-y-1">
                {concerns.map((concern, index) => (
                  <Badge key={index} variant="secondary" className="bg-red-100 text-red-800">
                    {concern}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MetricsComparisonSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <Skeleton className="h-4 w-20" />
                <div className="flex items-center gap-4">
                  <div className="text-right space-y-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}