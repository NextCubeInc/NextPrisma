import { Metrics } from '@/types/ads';

export interface AggregatedMetrics {
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  revenue: number;
  ctr: number;
  cpc: number;
  cpm: number;
  roas: number;
  conversionRate: number;
  costPerConversion: number;
  revenuePerClick: number;
  period: {
    startDate: string;
    endDate: string;
  };
  dataPoints: number;
}

export interface MetricsTrend {
  date: string;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  revenue: number;
  ctr: number;
  cpc: number;
  cpm: number;
  roas: number;
}

export interface MetricsComparison {
  current: AggregatedMetrics;
  previous: AggregatedMetrics;
  changes: {
    impressions: { value: number; percentage: number };
    clicks: { value: number; percentage: number };
    spend: { value: number; percentage: number };
    conversions: { value: number; percentage: number };
    revenue: { value: number; percentage: number };
    ctr: { value: number; percentage: number };
    cpc: { value: number; percentage: number };
    cpm: { value: number; percentage: number };
    roas: { value: number; percentage: number };
  };
}

export class MetricsAggregator {
  static aggregate(metrics: Metrics[]): AggregatedMetrics {
    if (metrics.length === 0) {
      return this.getEmptyMetrics();
    }

    const totals = metrics.reduce(
      (acc, metric) => ({
        impressions: acc.impressions + (metric.impressions || 0),
        clicks: acc.clicks + (metric.clicks || 0),
        spend: acc.spend + (metric.spend || 0),
        conversions: acc.conversions + (metric.conversions || 0),
        revenue: acc.revenue + (metric.revenue || 0)
      }),
      { impressions: 0, clicks: 0, spend: 0, conversions: 0, revenue: 0 }
    );

    const dates = metrics.map(m => m.date).sort();
    const startDate = dates[0];
    const endDate = dates[dates.length - 1];

    return {
      ...totals,
      ctr: this.calculateCTR(totals.clicks, totals.impressions),
      cpc: this.calculateCPC(totals.spend, totals.clicks),
      cpm: this.calculateCPM(totals.spend, totals.impressions),
      roas: this.calculateROAS(totals.revenue, totals.spend),
      conversionRate: this.calculateConversionRate(totals.conversions, totals.clicks),
      costPerConversion: this.calculateCostPerConversion(totals.spend, totals.conversions),
      revenuePerClick: this.calculateRevenuePerClick(totals.revenue, totals.clicks),
      period: { startDate, endDate },
      dataPoints: metrics.length
    };
  }

  static generateTrend(metrics: Metrics[]): MetricsTrend[] {
    const groupedByDate = metrics.reduce((acc, metric) => {
      const date = metric.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(metric);
      return acc;
    }, {} as Record<string, Metrics[]>);

    return Object.entries(groupedByDate)
      .map(([date, dayMetrics]) => {
        const aggregated = this.aggregate(dayMetrics);
        return {
          date,
          impressions: aggregated.impressions,
          clicks: aggregated.clicks,
          spend: aggregated.spend,
          conversions: aggregated.conversions,
          revenue: aggregated.revenue,
          ctr: aggregated.ctr,
          cpc: aggregated.cpc,
          cpm: aggregated.cpm,
          roas: aggregated.roas
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  static compare(currentMetrics: Metrics[], previousMetrics: Metrics[]): MetricsComparison {
    const current = this.aggregate(currentMetrics);
    const previous = this.aggregate(previousMetrics);

    const calculateChange = (currentValue: number, previousValue: number) => {
      const value = currentValue - previousValue;
      const percentage = previousValue === 0 ? 0 : (value / previousValue) * 100;
      return { value, percentage };
    };

    return {
      current,
      previous,
      changes: {
        impressions: calculateChange(current.impressions, previous.impressions),
        clicks: calculateChange(current.clicks, previous.clicks),
        spend: calculateChange(current.spend, previous.spend),
        conversions: calculateChange(current.conversions, previous.conversions),
        revenue: calculateChange(current.revenue, previous.revenue),
        ctr: calculateChange(current.ctr, previous.ctr),
        cpc: calculateChange(current.cpc, previous.cpc),
        cpm: calculateChange(current.cpm, previous.cpm),
        roas: calculateChange(current.roas, previous.roas)
      }
    };
  }

  static getTopPerformers(
    metrics: Metrics[],
    groupBy: 'entity_id' | 'campaign_id' | 'adset_id',
    sortBy: keyof AggregatedMetrics = 'revenue',
    limit: number = 10
  ): Array<{ id: string; metrics: AggregatedMetrics }> {
    const grouped = metrics.reduce((acc, metric) => {
      const key = metric[groupBy];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(metric);
      return acc;
    }, {} as Record<string, Metrics[]>);

    return Object.entries(grouped)
      .map(([id, entityMetrics]) => ({
        id,
        metrics: this.aggregate(entityMetrics)
      }))
      .sort((a, b) => {
        const aValue = a.metrics[sortBy] as number;
        const bValue = b.metrics[sortBy] as number;
        return bValue - aValue;
      })
      .slice(0, limit);
  }

  static getPerformanceInsights(metrics: AggregatedMetrics): string[] {
    const insights: string[] = [];

    // CTR insights
    if (metrics.ctr > 2) {
      insights.push('Excelente taxa de cliques (CTR > 2%)');
    } else if (metrics.ctr < 0.5) {
      insights.push('Taxa de cliques baixa - considere otimizar criativos');
    }

    // ROAS insights
    if (metrics.roas > 4) {
      insights.push('Excelente retorno sobre investimento (ROAS > 4x)');
    } else if (metrics.roas < 1) {
      insights.push('ROAS baixo - revisar estratégia de lances e segmentação');
    }

    // CPC insights
    if (metrics.cpc > 2) {
      insights.push('Custo por clique alto - considere otimizar palavras-chave');
    }

    // Conversion rate insights
    if (metrics.conversionRate > 5) {
      insights.push('Excelente taxa de conversão (> 5%)');
    } else if (metrics.conversionRate < 1) {
      insights.push('Taxa de conversão baixa - otimizar landing page');
    }

    // Volume insights
    if (metrics.impressions < 1000) {
      insights.push('Volume de impressões baixo - considere expandir alcance');
    }

    return insights;
  }

  private static calculateCTR(clicks: number, impressions: number): number {
    return impressions === 0 ? 0 : (clicks / impressions) * 100;
  }

  private static calculateCPC(spend: number, clicks: number): number {
    return clicks === 0 ? 0 : spend / clicks;
  }

  private static calculateCPM(spend: number, impressions: number): number {
    return impressions === 0 ? 0 : (spend / impressions) * 1000;
  }

  private static calculateROAS(revenue: number, spend: number): number {
    return spend === 0 ? 0 : revenue / spend;
  }

  private static calculateConversionRate(conversions: number, clicks: number): number {
    return clicks === 0 ? 0 : (conversions / clicks) * 100;
  }

  private static calculateCostPerConversion(spend: number, conversions: number): number {
    return conversions === 0 ? 0 : spend / conversions;
  }

  private static calculateRevenuePerClick(revenue: number, clicks: number): number {
    return clicks === 0 ? 0 : revenue / clicks;
  }

  private static getEmptyMetrics(): AggregatedMetrics {
    return {
      impressions: 0,
      clicks: 0,
      spend: 0,
      conversions: 0,
      revenue: 0,
      ctr: 0,
      cpc: 0,
      cpm: 0,
      roas: 0,
      conversionRate: 0,
      costPerConversion: 0,
      revenuePerClick: 0,
      period: { startDate: '', endDate: '' },
      dataPoints: 0
    };
  }
}

// Utilitários para formatação
export class MetricsFormatter {
  static formatCurrency(value: number, currency: string = 'BRL'): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency
    }).format(value);
  }

  static formatPercentage(value: number, decimals: number = 2): string {
    return `${value.toFixed(decimals)}%`;
  }

  static formatNumber(value: number, decimals: number = 0): string {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }

  static formatCompactNumber(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      notation: 'compact',
      compactDisplay: 'short'
    }).format(value);
  }

  static formatChange(change: { value: number; percentage: number }): {
    formatted: string;
    isPositive: boolean;
    isNegative: boolean;
  } {
    const isPositive = change.percentage > 0;
    const isNegative = change.percentage < 0;
    const sign = isPositive ? '+' : '';
    const formatted = `${sign}${change.percentage.toFixed(1)}%`;

    return {
      formatted,
      isPositive,
      isNegative
    };
  }
}