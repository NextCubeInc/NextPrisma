import { useState, useMemo } from "react";
import {
  Eye, TrendingUp, DollarSign, Target, Plus, MoreHorizontal, ExternalLink, Search,
  Filter, ChevronLeft, ChevronRight, Megaphone, Truck, BarChart3, ShoppingBag
} from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { ResponsiveContainer, ComposedChart, Bar, YAxis, XAxis } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- MOCK DATA (mesmo do seu código) ---
const MOCK_COMPETITORS = [ /* ... seu array mock ... */ ];

const statusColors = {
  monitoring: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  alert: "bg-red-500/10 text-red-400 border-red-500/20",
  inactive: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export default function CompetitorsPage() {
  const { currentWorkspace } = useWorkspace();
  const isGeneralWorkspace = currentWorkspace.type === "general";

  const [competitors, setCompetitors] = useState(MOCK_COMPETITORS);
  const [searchTerm, setSearchTerm] = useState("");
  const [posicionamentoFilter, setPosicionamentoFilter] = useState("all");
  const [lojaFilter, setLojaFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const competitorsPerPage = 5;

  // --- filtros ---
  const filteredCompetitors = useMemo(() => {
    return competitors.filter(c => {
      const matchesWorkspace = isGeneralWorkspace || c.loja === currentWorkspace.name;
      const matchesSearch = c.concorrente.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosicionamento = posicionamentoFilter === "all" || c.posicionamento_principal === posicionamentoFilter;
      const matchesLoja = !isGeneralWorkspace || lojaFilter === "all" || c.loja === lojaFilter;
      return matchesWorkspace && matchesSearch && matchesPosicionamento && matchesLoja;
    });
  }, [competitors, isGeneralWorkspace, currentWorkspace.name, searchTerm, posicionamentoFilter, lojaFilter]);

  // --- estatísticas ---
  const stats = useMemo(() => {
    const totalCompetitors = new Set(filteredCompetitors.map(c => c.concorrente)).size;
    const totalAds = filteredCompetitors.reduce((sum, c) => sum + c.ads_analisados, 0);
    const totalInvestimento = filteredCompetitors.reduce((sum, c) => sum + c.investimento_estimado, 0);
    const avgFrequencia = filteredCompetitors.length > 0
      ? filteredCompetitors.reduce((sum, c) => sum + c.frequencia, 0) / filteredCompetitors.length
      : 0;
    return { totalCompetitors, totalAds, totalInvestimento, avgFrequencia };
  }, [filteredCompetitors]);

  // --- CTA chart ---
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

  // --- paginação ---
  const totalPages = Math.ceil(filteredCompetitors.length / competitorsPerPage);
  const paginatedCompetitors = filteredCompetitors.slice(
    (currentPage - 1) * competitorsPerPage,
    currentPage * competitorsPerPage
  );

  const posicionamentos = useMemo(() => [...new Set(competitors.map(c => c.posicionamento_principal))], [competitors]);
  const lojas = useMemo(() => isGeneralWorkspace ? [...new Set(competitors.map(c => c.loja))] : [], [competitors, isGeneralWorkspace]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Análise de Concorrência</h1>
          <p className="text-muted-foreground">
            Compare preços, ofertas, logística e tendências
            {!isGeneralWorkspace && ` - ${currentWorkspace.name}`}
          </p>
        </div>
        <Button className="bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-glow">
          <Plus className="w-4 h-4 mr-2" /> Adicionar Concorrente
        </Button>
      </div>

      {/* Tabs para módulos */}
      <Tabs defaultValue="concorrencia" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="concorrencia"><Target className="w-4 h-4 mr-2" />Concorrência</TabsTrigger>
          <TabsTrigger value="preco"><DollarSign className="w-4 h-4 mr-2" />Preço & Descontos</TabsTrigger>
          <TabsTrigger value="frete"><Truck className="w-4 h-4 mr-2" />Frete</TabsTrigger>
          <TabsTrigger value="mercado"><BarChart3 className="w-4 h-4 mr-2" />Mercado</TabsTrigger>
          <TabsTrigger value="produtos"><ShoppingBag className="w-4 h-4 mr-2" />Produtos</TabsTrigger>
        </TabsList>

        {/* --- Aba Concorrência --- */}
        <TabsContent value="concorrencia" className="space-y-6">
          {/* Métricas */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Concorrentes" value={stats.totalCompetitors} icon={Target} description="únicos" />
            <MetricCard title="Anúncios Analisados" value={stats.totalAds} icon={Search} description="total" />
            <MetricCard title="Investimento Estimado" value={`R$ ${stats.totalInvestimento.toLocaleString()}`} icon={DollarSign} description="mensal" />
            <MetricCard title="Frequência Média" value={stats.avgFrequencia.toFixed(1)} icon={Megaphone} description="visualizações" />
          </div>

          {/* Filtros */}
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Filter className="w-5 h-5" />Filtros e Busca</CardTitle>
            </CardHeader>
            <CardContent>
              {/* ... seu grid de filtros aqui ... */}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gráfico CTA */}
            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader><CardTitle>CTAs Mais Usados</CardTitle></CardHeader>
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

            {/* Tabela concorrentes */}
            <Card className="lg:col-span-2 bg-gradient-card border-border/50 shadow-card">
              <CardHeader><CardTitle>Concorrentes Monitorados</CardTitle></CardHeader>
              <CardContent>
                {/* ... tabela de concorrentes com paginação ... */}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- Aba Preço --- */}
        <TabsContent value="preco">
          <Card>
            <CardHeader><CardTitle>Preço & Ofertas</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <p>- Monitoramento de descontos</p>
              <p>- Preço dinâmico</p>
              <p>- Precificação inteligente</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Aba Frete --- */}
        <TabsContent value="frete">
          <Card>
            <CardHeader><CardTitle>Logística & Frete</CardTitle></CardHeader>
            <CardContent>
              <p>[Estudo do frete: custo médio, impacto, comparação entre concorrentes]</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Aba Mercado --- */}
        <TabsContent value="mercado">
          <Card>
            <CardHeader><CardTitle>Mercado & Tendências</CardTitle></CardHeader>
            <CardContent>
              <p>[Mercado por temporada, sazonalidade, evolução histórica]</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Aba Produtos --- */}
        <TabsContent value="produtos">
          <Card>
            <CardHeader><CardTitle>Análise de Produtos</CardTitle></CardHeader>
            <CardContent>
              <p>[Ranking de performance, CTR, investimento em produtos]</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}