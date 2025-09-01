import { TrendingUp, DollarSign, ShoppingCart, Users, Eye, MousePointer } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const storeMetrics = [
  {
    title: "Vendas do Mês",
    value: "R$ 42.3k",
    change: "+23.1%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "vs. mês anterior",
  },
  {
    title: "Ticket Médio",
    value: "R$ 187",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: ShoppingCart,
    description: "por transação",
  },
  {
    title: "Leads Convertidos",
    value: "226",
    change: "+15.4%",
    changeType: "positive" as const,
    icon: Users,
    description: "este mês",
  },
  {
    title: "Taxa de Conversão",
    value: "3.8%",
    change: "+0.6%",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "lead para venda",
  },
];

const channelPerformance = [
  { channel: "Landing Page", leads: 234, conversions: 76, revenue: 14212, conversionRate: 32.5 },
  { channel: "Meta Ads", leads: 189, conversions: 45, revenue: 8415, conversionRate: 23.8 },
  { channel: "Google Ads", leads: 123, conversions: 16, revenue: 2992, conversionRate: 13.0 },
  { channel: "GTikTok Ads", leads: 123, conversions: 16, revenue: 2992, conversionRate: 13.0 },
  { channel: "Linkedin Ads", leads: 123, conversions: 16, revenue: 2992, conversionRate: 13.0 },
];

const salesFunnel = [
  { stage: "Visitantes", count: 10, percentage: 1, color: "bg-blue-500" },
  { stage: "Leads", count: 70, percentage: 100, color: "bg-green-500" },
  { stage: "Qualificados", count: 348, percentage: 2.8, color: "bg-yellow-500" },
  { stage: "Propostas", count: 156, percentage: 1.2, color: "bg-orange-500" },
  { stage: "Vendas", count: 89, percentage: 0.7, color: "bg-purple-500" },
];

export default function StoreAnalytics() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics da Loja</h1>
        <p className="text-muted-foreground">
          Análise detalhada de performance e conversão da sua loja
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {storeMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">Tráfego Hoje</h3>
              <Eye className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-foreground">1,247</div>
              <div className="text-sm text-muted-foreground">visitantes únicos</div>
              <div className="text-xs text-green-400">+18% vs ontem</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">Tempo na Página</h3>
              <MousePointer className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-foreground">3m 42s</div>
              <div className="text-sm text-muted-foreground">tempo médio</div>
              <div className="text-xs text-green-400">+12% vs média</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">Taxa de Rejeição</h3>
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-foreground">34.2%</div>
              <div className="text-sm text-muted-foreground">bounce rate</div>
              <div className="text-xs text-red-400">-5% vs média</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Funnel & Channel Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales Funnel */}
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Funil de Conversão</CardTitle>
            <CardDescription>
              Jornada completa do visitante até a venda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesFunnel.map((stage, index) => (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{stage.stage}</span>
                    <div className="text-right">
                      <div className="font-medium text-foreground">{stage.count.toLocaleString('pt-BR')}</div>
                      <div className="text-xs text-muted-foreground">{stage.percentage}%</div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-accent/20 rounded-full h-3">
                      <div 
                        className={`${stage.color} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${stage.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  {index < salesFunnel.length - 1 && (
                    <div className="text-xs text-muted-foreground text-center">
                      ↓ {((salesFunnel[index + 1].count / stage.count) * 100).toFixed(1)}% conversão
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Channel Performance */}
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Performance por Canal</CardTitle>
            <CardDescription>
              Comparativo de conversão entre canais de aquisição
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {channelPerformance.map((channel, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">{channel.channel}</h4>
                    <div className="text-sm text-muted-foreground">
                      {channel.conversions} vendas ({channel.conversionRate}%)
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Leads</div>
                      <div className="font-medium text-foreground">{channel.leads}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Vendas</div>
                      <div className="font-medium text-foreground">{channel.conversions}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Receita</div>
                      <div className="font-medium text-foreground">
                        {new Intl.NumberFormat('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        }).format(channel.revenue)}
                      </div>
                    </div>
                  </div>
                  
                  <Progress 
                    value={channel.conversionRate} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}