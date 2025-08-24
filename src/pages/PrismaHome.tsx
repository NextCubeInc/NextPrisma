import { 
  Users, 
  Store, 
  CreditCard, 
  MessageCircle, 
  ArrowUpRight,
  Settings,
  BarChart3,
  Crown,
  Zap
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock data
const kpiData = [
  {
    title: "Total de Leads",
    value: "12.345",
    change: "+18.2%",
    changeType: "positive" as const,
    icon: Users,
    description: "vs mês anterior",
  },
  {
    title: "Store Workspaces",
    value: "5",
    change: "+1",
    changeType: "positive" as const,
    icon: Store,
    description: "lojas ativas",
  },
  {
    title: "Faturas Pagas",
    value: "R$ 2.500",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: CreditCard,
    description: "este mês",
  },
  {
    title: "Créditos WhatsApp",
    value: "8.000/25.000",
    change: "32% usado",
    changeType: "neutral" as const,
    icon: MessageCircle,
    description: "disponível",
  },
];

const quickActions = [
  {
    title: "Gerenciar Workspaces",
    description: "Configure e gerencie suas lojas",
    icon: Settings,
    href: "/workspaces",
    color: "bg-gradient-primary",
  },
  {
    title: "Ver Leads",
    description: "Acompanhe todos os seus leads",
    icon: Users,
    href: "/leads",
    color: "bg-gradient-secondary",
  },
  {
    title: "Upgrade de Plano",
    description: "Desbloqueie recursos avançados",
    icon: Crown,
    href: "/plans",
    color: "bg-gradient-hero",
  },
  {
    title: "Ver Relatórios",
    description: "Análises e performance completa",
    icon: BarChart3,
    href: "/reports",
    color: "bg-gradient-glass",
  },
];

const recentActivity = [
  {
    store: "Loja Premium",
    action: "Novo lead convertido",
    value: "R$ 1.250",
    time: "5 min atrás",
    status: "success",
  },
  {
    store: "Tech Store",
    action: "Landing page visualizada",
    value: "127 views",
    time: "12 min atrás",
    status: "info",
  },
  {
    store: "Fashion Hub",
    action: "WhatsApp enviado",
    value: "45 mensagens",
    time: "1h atrás",
    status: "neutral",
  },
  {
    store: "Digital Shop",
    action: "Campanha finalizada",
    value: "8.5% CTR",
    time: "2h atrás",
    status: "success",
  },
];

const statusColors = {
  success: "bg-green-500/10 text-green-400 border-green-500/20",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  neutral: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export default function PrismaHome() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Bem-vindo de volta! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Aqui está um resumo rápido do seu negócio hoje.
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 transition-smooth shadow-glow">
          <ArrowUpRight className="w-4 h-4 mr-2" />
          Dashboard Completo
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <GlassCard key={index} {...kpi} glowEffect={index === 0} />
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Ações Rápidas</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="bg-gradient-glass border-border/30 shadow-glass backdrop-blur-sm hover:shadow-glow transition-spring group cursor-pointer">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-2xl ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-spring shadow-glow`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-gradient-glass border-border/30 shadow-glass backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Atividade Recente
            </CardTitle>
            <CardDescription>
              Últimas ações em suas lojas e campanhas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-background/20 border border-border/30 hover:bg-accent/20 transition-smooth"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-background/50">
                        {activity.store}
                      </Badge>
                      <Badge className={statusColors[activity.status as keyof typeof statusColors]}>
                        {activity.status}
                      </Badge>
                    </div>
                    <p className="font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{activity.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-glass border-border/30 shadow-glass backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Status do Sistema</CardTitle>
            <CardDescription>
              Saúde geral da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">API Status</span>
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                Operacional
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">WhatsApp API</span>
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                Conectado
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Backup</span>
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                Atualizado
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Uptime</span>
              <span className="text-sm font-medium text-green-400">99.9%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}