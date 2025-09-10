import { Megaphone, Plus, DollarSign, Target, TrendingUp, Eye, MoreHorizontal, Play, Pause } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

const adsMetrics = [
  {
    title: "Investimento Total",
    value: "R$ 25.4k",
    change: "+12.3%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "este mês",
  },
  {
    title: "Campanhas Ativas",
    value: "8",
    change: "+2",
    changeType: "positive" as const,
    icon: Megaphone,
    description: "em execução",
  },
  {
    title: "ROI Médio",
    value: "3.2x",
    change: "+0.4x",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "retorno",
  },
  {
    title: "Leads Gerados",
    value: "1,247",
    change: "+18.7%",
    changeType: "positive" as const,
    icon: Target,
    description: "últimos 30 dias",
  },
];

const campaignsData = [
  {
    id: 1,
    name: "Black Friday Meta Ads",
    platform: "Meta Ads",
    budget: 8500,
    spent: 6230,
    impressions: 145000,
    clicks: 3420,
    leads: 287,
    roi: 4.2,
    status: "active",
    startDate: "2024-01-10",
    endDate: "2024-01-25"
  },
  {
    id: 2,
    name: "Google Ads - Curso",
    platform: "Google Ads",
    budget: 5000,
    spent: 4650,
    impressions: 89000,
    clicks: 2100,
    leads: 156,
    roi: 2.8,
    status: "active",
    startDate: "2024-01-05",
    endDate: "2024-01-30"
  },
  {
    id: 3,
    name: "LinkedIn - B2B",
    platform: "LinkedIn",
    budget: 3200,
    spent: 1890,
    impressions: 34000,
    clicks: 890,
    leads: 78,
    roi: 3.5,
    status: "paused",
    startDate: "2024-01-01",
    endDate: "2024-01-20"
  },
  {
    id: 4,
    name: "TikTok - Gen Z",
    platform: "TikTok",
    budget: 2500,
    spent: 180,
    impressions: 5600,
    clicks: 145,
    leads: 12,
    roi: 1.2,
    status: "draft",
    startDate: "2024-01-20",
    endDate: "2024-02-05"
  },
];

const statusColors = {
  active: "bg-green-500/10 text-green-400 border-green-500/20",
  paused: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  draft: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const platformColors = {
  "Meta Ads": "bg-blue-600",
  "Google Ads": "bg-green-600",
  "LinkedIn": "bg-blue-800",
  "TikTok": "bg-black",
};

export default function Ads() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campanhas Publicitárias</h1>
          <p className="text-muted-foreground">
            Gerencie suas campanhas e monitore performance em tempo real
          </p>
        </div>
        <Button className="bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-glow">
          <Plus className="w-4 h-4 mr-2" />
          Criar Campanha
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {adsMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Performance by Platform */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Performance por Plataforma</CardTitle>
            <CardDescription>Distribuição de investimento e resultados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries({
                "Meta Ads": { budget: 8500, roi: 4.2, leads: 287 },
                "Google Ads": { budget: 5000, roi: 2.8, leads: 156 },
                "LinkedIn": { budget: 3200, roi: 3.5, leads: 78 },
                "TikTok": { budget: 2500, roi: 1.2, leads: 12 },
              }).map(([platform, data]) => (
                <div key={platform} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${platformColors[platform]}`}></div>
                      <span className="font-medium text-foreground">{platform}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ROI: {data.roi}x | {data.leads} leads
                    </div>
                  </div>
                  <Progress value={(data.budget / 10000) * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>R$ {data.budget.toLocaleString('pt-BR')}</span>
                    <span>{((data.budget / 19200) * 100).toFixed(1)}% do total</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Resumo do Mês</CardTitle>
            <CardDescription>Principais métricas consolidadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-foreground">R$ 13.8k</div>
                <div className="text-sm text-muted-foreground">Gasto Total</div>
                <div className="text-xs text-green-400">72% do orçamento utilizado</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center space-y-1">
                  <div className="text-xl font-bold text-foreground">533</div>
                  <div className="text-xs text-muted-foreground">Total de Leads</div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-xl font-bold text-foreground">3.1x</div>
                  <div className="text-xs text-muted-foreground">ROI Médio</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center space-y-1">
                  <div className="text-xl font-bold text-foreground">273k</div>
                  <div className="text-xs text-muted-foreground">Impressões</div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-xl font-bold text-foreground">6.5k</div>
                  <div className="text-xs text-muted-foreground">Cliques</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Campanhas Ativas</CardTitle>
          <CardDescription>
            Gerencie e monitore todas as suas campanhas publicitárias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-foreground font-medium">Campanha</TableHead>
                <TableHead className="text-foreground font-medium">Orçamento</TableHead>
                <TableHead className="text-foreground font-medium">Gasto</TableHead>
                <TableHead className="text-foreground font-medium">Cliques</TableHead>
                <TableHead className="text-foreground font-medium">Leads</TableHead>
                <TableHead className="text-foreground font-medium">ROI</TableHead>
                <TableHead className="text-foreground font-medium">Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaignsData.map((campaign) => (
                <TableRow key={campaign.id} className="border-border/50">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{campaign.name}</div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${platformColors[campaign.platform]}`}></div>
                        <Badge variant="outline" className="text-xs border-border/50 text-muted-foreground">
                          {campaign.platform}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">
                    {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format(campaign.budget)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-foreground">
                        {new Intl.NumberFormat('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        }).format(campaign.spent)}
                      </div>
                      <Progress value={(campaign.spent / campaign.budget) * 100} className="h-1" />
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">{campaign.clicks.toLocaleString('pt-BR')}</TableCell>
                  <TableCell className="text-foreground">{campaign.leads}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${campaign.roi >= 3 ? 'text-green-400' : campaign.roi >= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {campaign.roi}x
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[campaign.status]}>
                      {campaign.status === 'active' ? 'Ativa' : 
                       campaign.status === 'paused' ? 'Pausada' : 
                       campaign.status === 'draft' ? 'Rascunho' : 'Finalizada'}
                    </Badge>
                  </TableCell>
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
                        {campaign.status === 'active' ? (
                          <DropdownMenuItem className="text-foreground hover:bg-accent/50">
                            <Pause className="w-4 h-4 mr-2" />
                            Pausar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-foreground hover:bg-accent/50">
                            <Play className="w-4 h-4 mr-2" />
                            Ativar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-foreground hover:bg-accent/50">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Ver Analytics
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