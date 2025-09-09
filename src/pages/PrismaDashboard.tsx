import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Store,
  MoreHorizontal,
  Eye,
  MessageCircle,
  Crown,
  ArrowUpRight,
  Settings
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

// Mock data - Dados agregados de todas as lojas
const aggregatedMetrics = [
  {
    title: "Total de Leads",
    value: "23.847",
    change: "+15.2%",
    changeType: "positive" as const,
    icon: Users,
    description: "todas as lojas",
  },
  {
    title: "Revenue Total",
    value: "R$ 89.430",
    change: "+22.1%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "este mês",
  },
  {
    title: "ROI Médio",
    value: "324%",
    change: "+45%",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "todas campanhas",
  },
  {
    title: "Lojas Ativas",
    value: "5/5",
    change: "100%",
    changeType: "positive" as const,
    icon: Store,
    description: "operacionais",
  },
];

// Mock data - Performance por loja
const storePerformance = [
  {
    name: "Loja Premium",
    leads: 8420,
    roi: 385,
    revenue: 34500,
    whatsapp: "12.5k/25k",
    plan: "Enterprise",
    status: "active",
    growth: "+18%",
  },
  {
    name: "Tech Store",
    leads: 6230,
    roi: 298,
    revenue: 28900,
    whatsapp: "8.2k/15k",
    plan: "Pro",
    status: "active",
    growth: "+12%",
  },
  {
    name: "Fashion Hub",
    leads: 4890,
    roi: 267,
    revenue: 19800,
    whatsapp: "5.8k/10k",
    plan: "Basic",
    status: "active",
    growth: "+8%",
  },
  {
    name: "Digital Shop",
    leads: 3127,
    roi: 198,
    revenue: 12400,
    whatsapp: "3.1k/5k",
    plan: "Basic",
    status: "active",
    growth: "+5%",
  },
  {
    name: "Outlet Store",
    leads: 1180,
    roi: 156,
    revenue: 5830,
    whatsapp: "1.2k/5k",
    plan: "Starter",
    status: "warning",
    growth: "-2%",
  },
];

const planColors = {
  Enterprise: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Pro: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Basic: "bg-green-500/10 text-green-400 border-green-500/20",
  Starter: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const statusColors = {
  active: "bg-green-500/10 text-green-400 border-green-500/20",
  warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  inactive: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function PrismaDashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Dashboard Consolidado
          </h1>
          <p className="text-lg text-muted-foreground">
            Visão geral completa de todas as suas lojas e campanhas
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 transition-smooth shadow-glow">
          <ArrowUpRight className="w-4 h-4 mr-2" />
          Relatório Detalhado
        </Button>
      </div>

      {/* Aggregated Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {aggregatedMetrics.map((metric, index) => (
          <GlassCard key={index} {...metric} glowEffect={index === 1} />
        ))}
      </div>

      {/* Performance Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-gradient-glass border-border/30 shadow-glass backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Evolução de Leads
            </CardTitle>
            <CardDescription>
              Crescimento mensal agregado de todas as lojas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Janeiro</span>
                <span className="font-medium text-foreground">18.250</span>
              </div>
              <Progress value={75} className="h-2" />
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Fevereiro</span>
                <span className="font-medium text-foreground">21.430</span>
              </div>
              <Progress value={85} className="h-2" />
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Março</span>
                <span className="font-medium text-foreground">23.847</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-glass border-border/30 shadow-glass backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              ROI por Loja
            </CardTitle>
            <CardDescription>
              Retorno sobre investimento comparativo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {storePerformance.slice(0, 3).map((store, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-primary"></div>
                    <span className="text-sm font-medium text-foreground">{store.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-primary">{store.roi}%</span>
                    <span className="text-xs text-green-400">{store.growth}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Store Performance Mini Cards */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Performance por Loja</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {storePerformance.map((store, index) => (
            <Card key={index} className="bg-gradient-glass border-border/30 shadow-glass backdrop-blur-sm hover:shadow-glow transition-spring">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-foreground">{store.name}</CardTitle>
                  <Badge className={planColors[store.plan as keyof typeof planColors]}>
                    {store.plan}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Leads</p>
                    <p className="font-semibold text-foreground">{store.leads.toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">ROI</p>
                    <p className="font-semibold text-primary">{store.roi}%</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="font-semibold text-foreground">R$ {store.revenue.toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">WhatsApp</p>
                    <p className="font-semibold text-muted-foreground text-xs">{store.whatsapp}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                  <Badge className={statusColors[store.status as keyof typeof statusColors]}>
                    {store.status}
                  </Badge>
                  <span className="text-xs font-medium text-green-400">{store.growth}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Consolidated Table */}
      <Card className="bg-gradient-glass border-border/30 shadow-glass backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Tabela Consolidada</CardTitle>
          <CardDescription>
            Visão detalhada de todas as lojas com métricas principais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/30 bg-background/20 backdrop-blur-sm">
            <Table>
              <TableHeader>
                <TableRow className="border-border/30">
                  <TableHead>Loja</TableHead>
                  <TableHead>Leads</TableHead>
                  <TableHead>ROI</TableHead>
                  <TableHead>Faturamento</TableHead>
                  <TableHead>Créditos</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storePerformance.map((store, index) => (
                  <TableRow key={index} className="border-border/30 hover:bg-accent/20 transition-smooth">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="font-medium text-foreground">{store.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{store.leads.toLocaleString('pt-BR')}</span>
                        <span className="text-xs text-green-400">{store.growth}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary">{store.roi}%</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-foreground">R$ {store.revenue.toLocaleString('pt-BR')}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{store.whatsapp}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={planColors[store.plan as keyof typeof planColors]}>
                        {store.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="w-4 h-4 mr-2" />
                            Configurar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Crown className="w-4 h-4 mr-2" />
                            Upgrade
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}