import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Eye,
  Facebook,
  Search,
  Music,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface DashboardMetrics {
  totalSpent: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  ctr: number;
  cpc: number;
  cpm: number;
  roas: number;
}

const getIntegrationIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'meta':
    case 'facebook':
      return Facebook;
    case 'google':
    case 'google_ads':
      return Search;
    case 'tiktok':
    case 'tiktok_ads':
      return Music;
    default:
      return BarChart3;
  }
};

export function ClientDashboard() {
  const { clientId } = useParams<{ clientId: string }>();
  const { activeClient, integrations, setActiveClient, clients } = useWorkspace();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Se o cliente ativo não corresponde ao ID da URL, buscar e definir o cliente correto
    if (clientId && (!activeClient || activeClient.id !== clientId)) {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        setActiveClient(client);
      }
    }
  }, [clientId, activeClient, clients, setActiveClient]);

  useEffect(() => {
    if (activeClient && integrations.length > 0) {
      loadDashboardMetrics();
    } else {
      setLoading(false);
    }
  }, [activeClient, integrations]);

  const loadDashboardMetrics = async () => {
    try {
      setLoading(true);
      
      // Simular dados de métricas (em um cenário real, isso viria das APIs das plataformas)
      const mockMetrics: DashboardMetrics = {
        totalSpent: 15420.50,
        totalImpressions: 2450000,
        totalClicks: 12300,
        totalConversions: 450,
        ctr: 0.50,
        cpc: 1.25,
        cpm: 6.30,
        roas: 3.2
      };

      // Simular delay de carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (!activeClient) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Cliente não encontrado</h3>
          <p className="text-muted-foreground mb-4">
            O cliente selecionado não foi encontrado ou você não tem permissão para acessá-lo.
          </p>
          <Button onClick={() => window.history.back()}>
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral das campanhas de {activeClient.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {integrations.length} integração{integrations.length !== 1 ? 'ões' : ''}
          </Badge>
          <Button onClick={loadDashboardMetrics} disabled={loading}>
            {loading ? <Clock className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
            Atualizar
          </Button>
        </div>
      </div>

      {/* Status das Integrações */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => {
          const IconComponent = getIntegrationIcon(integration.integration_type);
          return (
            <Card key={integration.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {integration.integration_name || integration.integration_type}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {integration.status === 'active' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                  <span className="text-sm">
                    {integration.status === 'active' ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
                {integration.last_sync_at && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Última sincronização: {new Date(integration.last_sync_at).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Métricas Principais */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
                <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted animate-pulse rounded w-16 mb-1"></div>
                <div className="h-3 bg-muted animate-pulse rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : metrics ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Investimento Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {metrics.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Impressões</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.totalImpressions.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground">
                +8% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cliques</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.totalClicks.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground">
                CTR: {metrics.ctr.toFixed(2)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversões</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.totalConversions.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground">
                ROAS: {metrics.roas.toFixed(1)}x
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CPC Médio</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {metrics.cpc.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                -5% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CPM Médio</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {metrics.cpm.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                +2% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CTR Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.ctr.toFixed(2)}%
              </div>
              <p className="text-xs text-muted-foreground">
                +0.1% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROAS</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.roas.toFixed(1)}x
              </div>
              <p className="text-xs text-muted-foreground">
                +15% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Sem dados disponíveis</CardTitle>
            <CardDescription>
              Conecte suas integrações para visualizar as métricas do dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => toast.info("Redirecionando para integrações...")}>
              Configurar Integrações
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}