import { TrendingUp, Users, DollarSign, Target, ArrowUpRight } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    </div>
  );
}