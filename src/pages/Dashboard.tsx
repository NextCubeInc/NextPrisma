import { TrendingUp, Users, DollarSign, Target, ArrowUpRight } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock data
const metrics = [
  {
    title: "Total de Leads",
    value: "2,847",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: Users,
    description: "vs mês anterior",
  },
  {
    title: "Taxa de Conversão",
    value: "18.2%",
    change: "+2.1%",
    changeType: "positive" as const,
    icon: Target,
    description: "últimos 30 dias",
  },
  {
    title: "Revenue Total",
    value: "R$ 89,430",
    change: "+8.7%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "este mês",
  },
  {
    title: "Growth Rate",
    value: "24.8%",
    change: "+4.3%",
    changeType: "positive" as const,
    icon: TrendingUp,  
    description: "YoY",
  },
];

const recentLeads = [
  {
    name: "Maria Santos",
    email: "maria@empresa.com",
    source: "Google Ads",
    status: "hot",
    value: "R$ 5,200",
    time: "2 min atrás",
  },
  {
    name: "Carlos Silva",
    email: "carlos@startup.io",
    source: "LinkedIn",
    status: "warm",
    value: "R$ 3,800",
    time: "15 min atrás",
  },
  {
    name: "Ana Costa",
    email: "ana@tech.com.br",
    source: "Website",
    status: "cold",
    value: "R$ 2,100",
    time: "1h atrás",
  },
  {
    name: "Pedro Oliveira",
    email: "pedro@digital.co",
    source: "Facebook",
    status: "hot",
    value: "R$ 7,500",
    time: "2h atrás",
  },
];

const statusColors = {
  hot: "bg-red-500/10 text-red-500 border-red-500/20",
  warm: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  cold: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta! Aqui está um resumo dos seus dados.
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 transition-smooth shadow-elegant">
          <ArrowUpRight className="w-4 h-4 mr-2" />
          Ver Relatório Completo
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Leads Recentes</CardTitle>
            <CardDescription>
              Seus leads mais recentes e suas informações de conversão
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.map((lead, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50 hover:bg-accent/50 transition-smooth"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{lead.name}</p>
                      <Badge className={statusColors[lead.status as keyof typeof statusColors]}>
                        {lead.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {lead.source} • {lead.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{lead.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse as funcionalidades mais usadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start hover:bg-accent/50 transition-smooth">
              <Users className="w-4 h-4 mr-2" />
              Importar Leads
            </Button>
            <Button variant="outline" className="w-full justify-start hover:bg-accent/50 transition-smooth">
              <Target className="w-4 h-4 mr-2" />
              Nova Campanha
            </Button>
            <Button variant="outline" className="w-full justify-start hover:bg-accent/50 transition-smooth">
              <TrendingUp className="w-4 h-4 mr-2" />
              Ver Analytics
            </Button>
            <Button variant="outline" className="w-full justify-start hover:bg-accent/50 transition-smooth">
              <DollarSign className="w-4 h-4 mr-2" />
              Relatório Financeiro
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}