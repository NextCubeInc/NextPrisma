import { Eye, TrendingUp, DollarSign, Target, Plus, MoreHorizontal, ExternalLink } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const competitorMetrics = [
  {
    title: "Market Share",
    value: "23.4%",
    change: "+2.1%",
    changeType: "positive" as const,
    icon: Target,
    description: "vs. Q anterior",
  },
  {
    title: "Volume de Anúncios",
    value: "1,247",
    change: "+18.2%",
    changeType: "positive" as const,
    icon: Eye,
    description: "últimos 30 dias",
  },
  {
    title: "Investimento Est.",
    value: "R$ 127k",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "este mês",
  },
  {
    title: "Crescimento",
    value: "+15.8%",
    change: "+3.2%",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "taxa",
  },
];

const competitorsData = [
  { 
    name: "Concorrente Alpha", 
    domain: "alpha.com.br",
    marketShare: 18.5, 
    adsVolume: 342, 
    estimatedBudget: 45000,
    growth: "+12.3%",
    status: "monitoring",
    lastUpdate: "2h ago"
  },
  { 
    name: "Beta Solutions", 
    domain: "betasol.com",
    marketShare: 15.2, 
    adsVolume: 287, 
    estimatedBudget: 38000,
    growth: "+8.7%",
    status: "monitoring",
    lastUpdate: "4h ago"
  },
  { 
    name: "Gamma Corp", 
    domain: "gammacorp.com.br",
    marketShare: 22.1, 
    adsVolume: 456, 
    estimatedBudget: 62000,
    growth: "+19.4%",
    status: "alert",
    lastUpdate: "1h ago"
  },
];

const statusColors = {
  monitoring: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  alert: "bg-red-500/10 text-red-400 border-red-500/20",
  inactive: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export default function Competitors() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Análise de Concorrência</h1>
          <p className="text-muted-foreground">
            Monitore seus principais concorrentes e acompanhe tendências de mercado
          </p>
        </div>
        <Button className="bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-glow">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Concorrente
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {competitorMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Competitors Table */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Concorrentes Monitorados</CardTitle>
          <CardDescription>
            Lista de concorrentes sendo acompanhados com métricas em tempo real
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-foreground font-medium">Nome</TableHead>
                <TableHead className="text-foreground font-medium">Market Share</TableHead>
                <TableHead className="text-foreground font-medium">Volume Anúncios</TableHead>
                <TableHead className="text-foreground font-medium">Orçamento Est.</TableHead>
                <TableHead className="text-foreground font-medium">Crescimento</TableHead>
                <TableHead className="text-foreground font-medium">Status</TableHead>
                <TableHead className="text-foreground font-medium">Última Atualização</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitorsData.map((competitor, index) => (
                <TableRow key={index} className="border-border/50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">{competitor.name}</div>
                      <div className="text-sm text-muted-foreground">{competitor.domain}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">{competitor.marketShare}%</TableCell>
                  <TableCell className="text-foreground">{competitor.adsVolume}</TableCell>
                  <TableCell className="text-foreground">
                    {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format(competitor.estimatedBudget)}
                  </TableCell>
                  <TableCell className="text-foreground font-medium text-green-400">
                    {competitor.growth}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[competitor.status]}>
                      {competitor.status === 'monitoring' ? 'Monitorando' : 'Alerta'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{competitor.lastUpdate}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem className="text-foreground hover:bg-accent/50">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground hover:bg-accent/50">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visitar Site
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground hover:bg-accent/50">
                          <Target className="w-4 h-4 mr-2" />
                          Analisar Anúncios
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}