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
    title: "Total de Convertidos",
    value: "23.847",
    change: "+15.2%",
    changeType: "positive" as const,
    icon: Users,
    description: "Todas as lojas",
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
    title: "Dwell Time AVG",
    value: "13h40m20s",
    change: "+30%",
    changeType: "positive" as const,
    icon: Store,
    description: "Tempo de permanência na página",
  },
];

// Mock data - Performance por loja
const storePerformance = [
  {
    name: "Loja Premium",
    leads: 8420,
    roi: 385,
    revenue: 34500,
    dwellTime: "1h30m20s",
    status: "active",
    growth: "+18%",
  },
  {
    name: "Tech Store",
    leads: 6230,
    roi: 298,
    revenue: 28900,
    dwellTime: "1h30m20s",
    status: "active",
    growth: "+12%",
  },
  {
    name: "Fashion Hub",
    leads: 4890,
    roi: 267,
    revenue: 19800,
    dwellTime: "1h30m20s",
    status: "active",
    growth: "+8%",
  },
  {
    name: "Digital Shop",
    leads: 3127,
    roi: 198,
    revenue: 12400,
    dwellTime: "1h30m20s",
    status: "active",
    growth: "+5%",
  },
  {
    name: "Outlet Store",
    leads: 1180,
    roi: 156,
    revenue: 5830,
    dwellTime: "1h30m20s",
    status: "warning",
    growth: "-2%",
  },
];

const statusColors = {
  active: "bg-green-500/10 text-green-400 border-green-500/20",
  warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  inactive: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function StoreDashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Dashboard Geral
          </h1>
          <p className="text-lg text-muted-foreground">
            Visão geral completa de todas as suas lojas
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 transition-smooth shadow-glow">
          <ArrowUpRight className="w-4 h-4 mr-2" />
          Relatório Detalhado
        </Button>
      </div>

      {/* Aggregated Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
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
      </div>
    </div>
  );
}