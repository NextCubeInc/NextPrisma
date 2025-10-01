import { BarChart3, TrendingUp, Eye, MousePointer } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const analyticsMetrics = [
  {
    title: "Visualizações",
    value: "45,231",
    change: "+18.2%",
    changeType: "positive" as const,
    icon: Eye,
    description: "últimos 30 dias",
  },
  {
    title: "Conversões",
    value: "1,847",
    change: "+12.1%",
    changeType: "positive" as const,
    icon: MousePointer,
    description: "este mês",
  },
  {
    title: "Taxa de Conversão",
    value: "4.08%",
    change: "+0.3%",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "média",
  },
  {
    title: "ROI",
    value: "324%",
    change: "+45%",
    changeType: "positive" as const,
    icon: BarChart3,
    description: "retorno",
  },
];

const channelData = [
  { name: "Google Ads", visitors: 18500, conversions: 847, rate: 4.6 },
  { name: "Facebook", visitors: 12300, conversions: 523, rate: 4.3 },
  { name: "LinkedIn", visitors: 8900, conversions: 287, rate: 3.2 },
  { name: "Organic", visitors: 5600, conversions: 190, rate: 3.4 },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">
          Acompanhe o desempenho das suas campanhas e otimize resultados
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {analyticsMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Performance by Channel */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Performance por Canal</CardTitle>
          <CardDescription>
            Análise detalhada do desempenho de cada canal de marketing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {channelData.map((channel, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">{channel.name}</h4>
                  <div className="text-sm text-muted-foreground">
                    {channel.conversions} conversões ({channel.rate}%)
                  </div>
                </div>
                <Progress 
                  value={(channel.conversions / 1000) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{channel.visitors.toLocaleString('pt-BR')} visitantes</span>
                  <span>Taxa: {channel.rate}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}