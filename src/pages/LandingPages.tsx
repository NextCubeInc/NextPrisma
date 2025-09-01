import { Globe, Plus, Eye, MousePointer, TrendingUp, MoreHorizontal, Copy, ExternalLink } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

const landingPageMetrics = [
  {
    title: "Total de Páginas",
    value: "12",
    change: "+2",
    changeType: "positive" as const,
    icon: Globe,
    description: "páginas ativas",
  },
  {
    title: "Visitas Totais",
    value: "18.4k",
    change: "+23.1%",
    changeType: "positive" as const,
    icon: Eye,
    description: "últimos 30 dias",
  },
  {
    title: "Leads Gerados",
    value: "847",
    change: "+18.7%",
    changeType: "positive" as const,
    icon: MousePointer,
    description: "este mês",
  },
  {
    title: "Taxa de Conversão",
    value: "4.6%",
    change: "+0.8%",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "média geral",
  },
];

const landingPagesData = [
  {
    id: 1,
    name: "Black Friday 2024",
    url: "loja.com/black-friday",
    status: "active",
    visits: 5420,
    leads: 249,
    conversionRate: 4.6,
    abtesting: true,
    dwelltime: "2h30m02s",
    template: "E-commerce"
  },
  {
    id: 2,
    name: "Curso Marketing Digital",
    url: "cursos.com/marketing",
    status: "active",
    visits: 3200,
    leads: 156,
    conversionRate: 4.9,
    abtesting: false,
    dwelltime: "2h30m02s",
    template: "Educacional"
  },
  {
    id: 3,
    name: "Webinar Gratuito",
    url: "eventos.com/webinar",
    status: "paused",
    visits: 1800,
    leads: 89,
    conversionRate: 4.9,
    abtesting: true,
    dwelltime: "2h30m02s",
    template: "Evento"
  },
  {
    id: 4,
    name: "Landing Produto X",
    url: "produto.com/lancamento",
    status: "draft",
    visits: 0,
    leads: 0,
    conversionRate: 0,
    abtesting: false,
    dwelltime: "2h30m02s",
    template: "Produto"
  },
];

const statusColors = {
  active: "bg-green-500/10 text-green-400 border-green-500/20",
  paused: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  draft: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export default function LandingPages() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Landing Pages</h1>
          <p className="text-muted-foreground">
            Gerencie suas páginas de conversão e acompanhe performance
          </p>
        </div>
        <Button className="bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-glow">
          <Plus className="w-4 h-4 mr-2" />
          Criar Landing Page
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {landingPageMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Landing Pages Table */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Suas Landing Pages</CardTitle>
          <CardDescription>
            Gerencie e monitore o desempenho das suas páginas de conversão
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-foreground font-medium">Nome</TableHead>
                <TableHead className="text-foreground font-medium">Status</TableHead>
                <TableHead className="text-foreground font-medium">Visitas</TableHead>
                <TableHead className="text-foreground font-medium">Leads</TableHead>
                <TableHead className="text-foreground font-medium">Conversão</TableHead>
                <TableHead className="text-foreground font-medium">A/B Testing</TableHead>
                <TableHead className="text-foreground font-medium">Dwell Time</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {landingPagesData.map((page) => (
                <TableRow key={page.id} className="border-border/50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">{page.name}</div>
                      <div className="text-sm text-muted-foreground">{page.url}</div>
                      <Badge variant="outline" className="mt-1 text-xs border-border/50 text-muted-foreground">
                        {page.template}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[page.status]}>
                      {page.status === 'active' ? 'Ativa' : 
                       page.status === 'paused' ? 'Pausada' : 'Rascunho'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-foreground">
                    {page.visits.toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-foreground">{page.leads}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-foreground font-medium">{page.conversionRate}%</div>
                      <Progress value={page.conversionRate * 10} className="h-1" />
                    </div>
                  </TableCell>
                  <TableCell>
                    {page.abtesting ? (
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-border/50 text-muted-foreground">
                        Inativo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{page.dwelltime}</TableCell>
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
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground hover:bg-accent/50">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Abrir no Site
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground hover:bg-accent/50">
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicar
                        </DropdownMenuItem>
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