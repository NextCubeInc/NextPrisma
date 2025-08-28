import { useState, useMemo } from "react";
import { Eye, TrendingUp, DollarSign, Target, Plus, MoreHorizontal, ExternalLink, Search, Filter, ChevronLeft, ChevronRight, Megaphone } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { ResponsiveContainer, ComposedChart, Bar, YAxis, XAxis } from "recharts";

const MOCK_COMPETITORS = [
  { 
    id: 1,
    concorrente: "Zara Brasil", 
    domain: "zara.com.br",
    criativo_destaque: "https://via.placeholder.com/150x150/7A3FFF/FFFFFF?text=Zara",
    frequencia: 8.5,
    posicionamento_principal: "Fast Fashion",
    loja: "Fashion Premium",
    cta_comum: "Compre Agora",
    ads_analisados: 45,
    investimento_estimado: 15000,
    plataforma_principal: "Facebook",
    data_ultimo_anuncio: "2025-01-15",
    segmentacao_detectada: "Mulheres, 18-35, Interesse em Moda",
    marketShare: 18.5,
    growth: "+12.3%",
    status: "monitoring" as const,
    lastUpdate: "2h ago"
  },
  { 
    id: 2,
    concorrente: "Magazine Luiza", 
    domain: "magazineluiza.com.br",
    criativo_destaque: "https://via.placeholder.com/150x150/10B981/FFFFFF?text=Magalu",
    frequencia: 12.3,
    posicionamento_principal: "E-commerce",
    loja: "Tech Solutions",
    cta_comum: "Saiba Mais",
    ads_analisados: 67,
    investimento_estimado: 28000,
    plataforma_principal: "Google",
    data_ultimo_anuncio: "2025-01-14",
    segmentacao_detectada: "Homens e Mulheres, 25-50, Interesse em Tecnologia",
    marketShare: 15.2,
    growth: "+8.7%",
    status: "monitoring" as const,
    lastUpdate: "4h ago"
  },
  { 
    id: 3,
    concorrente: "Natura", 
    domain: "natura.com.br",
    criativo_destaque: "https://via.placeholder.com/150x150/F59E0B/FFFFFF?text=Natura",
    frequencia: 6.8,
    posicionamento_principal: "Beleza e Cuidados",
    loja: "Beauty & Care",
    cta_comum: "Descubra",
    ads_analisados: 34,
    investimento_estimado: 22000,
    plataforma_principal: "Instagram",
    data_ultimo_anuncio: "2025-01-16",
    segmentacao_detectada: "Mulheres, 20-45, Interesse em Beleza",
    marketShare: 22.1,
    growth: "+19.4%",
    status: "alert" as const,
    lastUpdate: "1h ago"
  },
  { 
    id: 4,
    concorrente: "Casas Bahia", 
    domain: "casasbahia.com.br",
    criativo_destaque: "https://via.placeholder.com/150x150/EF4444/FFFFFF?text=Casas+Bahia",
    frequencia: 9.2,
    posicionamento_principal: "Varejo",
    loja: "Fashion Premium",
    cta_comum: "Comprar",
    ads_analisados: 52,
    investimento_estimado: 18000,
    plataforma_principal: "Facebook",
    data_ultimo_anuncio: "2025-01-13",
    segmentacao_detectada: "Famílias, 25-55, Classe C/D",
    marketShare: 14.8,
    growth: "+5.2%",
    status: "monitoring" as const,
    lastUpdate: "6h ago"
  }
];

const statusColors = {
  monitoring: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  alert: "bg-red-500/10 text-red-400 border-red-500/20",
  inactive: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export default function Competitors() {
  const { currentWorkspace } = useWorkspace();
  const isGeneralWorkspace = currentWorkspace.type === "general";
  
  const [competitors, setCompetitors] = useState(MOCK_COMPETITORS);
  const [searchTerm, setSearchTerm] = useState("");
  const [posicionamentoFilter, setPosicionamentoFilter] = useState("all");
  const [lojaFilter, setLojaFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const competitorsPerPage = 5;

  // Filter competitors based on workspace and filters
  const filteredCompetitors = useMemo(() => {
    return competitors.filter(c => {
      // Workspace filter
      const matchesWorkspace = isGeneralWorkspace || c.loja === currentWorkspace.name;
      
      // Search filter
      const matchesSearch = c.concorrente.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Posicionamento filter
      const matchesPosicionamento = posicionamentoFilter === "all" || 
                                    c.posicionamento_principal === posicionamentoFilter;
      
      // Loja filter (only in general workspace)
      const matchesLoja = !isGeneralWorkspace || 
                          lojaFilter === "all" || 
                          c.loja === lojaFilter;
      
      return matchesWorkspace && matchesSearch && matchesPosicionamento && matchesLoja;
    });
  }, [competitors, isGeneralWorkspace, currentWorkspace.name, searchTerm, posicionamentoFilter, lojaFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCompetitors = new Set(filteredCompetitors.map(c => c.concorrente)).size;
    const totalAds = filteredCompetitors.reduce((sum, c) => sum + c.ads_analisados, 0);
    const totalInvestimento = filteredCompetitors.reduce((sum, c) => sum + c.investimento_estimado, 0);
    const avgFrequencia = filteredCompetitors.length > 0
      ? filteredCompetitors.reduce((sum, c) => sum + c.frequencia, 0) / filteredCompetitors.length
      : 0;

    return { totalCompetitors, totalAds, totalInvestimento, avgFrequencia };
  }, [filteredCompetitors]);

  // CTA Analysis
  const ctaData = useMemo(() => {
    const ctaCounts = filteredCompetitors.reduce((acc, c) => {
      acc[c.cta_comum] = (acc[c.cta_comum] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(ctaCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);
  }, [filteredCompetitors]);

  // Pagination
  const totalPages = Math.ceil(filteredCompetitors.length / competitorsPerPage);
  const paginatedCompetitors = filteredCompetitors.slice(
    (currentPage - 1) * competitorsPerPage,
    currentPage * competitorsPerPage
  );

  // Get unique posicionamentos for filter
  const posicionamentos = useMemo(() => {
    const uniquePos = [...new Set(competitors.map(c => c.posicionamento_principal))];
    return uniquePos;
  }, [competitors]);

  // Get unique lojas for filter (only in general workspace)
  const lojas = useMemo(() => {
    if (!isGeneralWorkspace) return [];
    const uniqueLojas = [...new Set(competitors.map(c => c.loja))];
    return uniqueLojas;
  }, [competitors, isGeneralWorkspace]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Análise de Concorrência</h1>
          <p className="text-muted-foreground">
            Monitore seus principais concorrentes e acompanhe tendências de mercado
            {!isGeneralWorkspace && ` - ${currentWorkspace.name}`}
          </p>
        </div>
        <Button className="bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-glow">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Concorrente
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Concorrentes"
          value={stats.totalCompetitors}
          icon={Target}
          description="únicos"
        />
        <MetricCard
          title="Anúncios Analisados"
          value={stats.totalAds}
          icon={Search}
          description="total"
        />
        <MetricCard
          title="Investimento Estimado"
          value={`R$ ${stats.totalInvestimento.toLocaleString()}`}
          icon={DollarSign}
          description="mensal"
        />
        <MetricCard
          title="Frequência Média"
          value={stats.avgFrequencia.toFixed(1)}
          icon={Megaphone}
          description="visualizações"
        />
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label>Buscar Concorrente</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Posicionamento Filter */}
            <div className="space-y-2">
              <Label>Posicionamento</Label>
              <Select value={posicionamentoFilter} onValueChange={setPosicionamentoFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Segmentos</SelectItem>
                  {posicionamentos.map(pos => (
                    <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Loja Filter (only in general workspace) */}
            {isGeneralWorkspace && (
              <div className="space-y-2">
                <Label>Loja</Label>
                <Select value={lojaFilter} onValueChange={setLojaFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Lojas</SelectItem>
                    {lojas.map(loja => (
                      <SelectItem key={loja} value={loja}>{loja}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CTA Analysis Chart */}
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">CTAs Mais Usados</CardTitle>
            <CardDescription>
              Principais call-to-actions dos concorrentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart layout="vertical" data={ctaData}>
                  <YAxis type="category" dataKey="name" width={80} className="text-xs" />
                  <XAxis type="number" hide />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Competitors Table */}
        <Card className="lg:col-span-2 bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Concorrentes Monitorados</CardTitle>
            <CardDescription>
              Lista de concorrentes com métricas em tempo real
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="text-foreground font-medium">Concorrente</TableHead>
                  <TableHead className="text-foreground font-medium">Criativo</TableHead>
                  <TableHead className="text-foreground font-medium">Frequência</TableHead>
                  <TableHead className="text-foreground font-medium">Posicionamento</TableHead>
                  {isGeneralWorkspace && <TableHead className="text-foreground font-medium">Loja</TableHead>}
                  <TableHead className="text-foreground font-medium">CTA</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCompetitors.map((competitor) => (
                  <TableRow key={competitor.id} className="border-border/50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">{competitor.concorrente}</div>
                        <div className="text-sm text-muted-foreground">{competitor.domain}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <img 
                        src={competitor.criativo_destaque} 
                        alt={competitor.concorrente} 
                        className="w-16 h-16 object-cover rounded-md" 
                      />
                    </TableCell>
                    <TableCell className="text-foreground font-medium">
                      {competitor.frequencia}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {competitor.posicionamento_principal}
                      </Badge>
                    </TableCell>
                    {isGeneralWorkspace && <TableCell className="text-foreground">{competitor.loja}</TableCell>}
                    <TableCell className="text-green-400 font-medium">
                      {competitor.cta_comum}
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

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages} ({filteredCompetitors.length} concorrentes)
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}