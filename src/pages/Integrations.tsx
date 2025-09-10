import React, { useState, useMemo } from "react";
import { Plug, CheckCircle, XCircle, Settings, Plus, AlertTriangle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWorkspace } from "@/contexts/WorkspaceContext";

const integrations = [
  {
    id: 1,
    name: "WhatsApp Business API",
    category: "Mensagens",
    description: "Envie mensagens automáticas e gerencie conversas do WhatsApp",
    status: "connected",
    icon: "💬",
    setupDate: "2023-12-15",
    lastSync: "2min atrás",
    features: ["Mensagens automáticas", "Templates aprovados", "Webhook de status"],
    workspaceId: "store-1",
    loja: "Loja Fashion Prime",
    config: {
      phoneNumber: "+55 11 99999-0000",
      businessId: "120363194***",
      webhook: "Ativo"
    }
  },
  {
    id: 2,
    name: "Meta Ads - Conta Principal",
    category: "Publicidade", 
    description: "Conta principal do Facebook Ads para campanhas de moda",
    status: "connected",
    icon: "📱",
    setupDate: "2024-01-10",
    lastSync: "5min atrás",
    features: ["Import de leads", "Métricas de campanha", "Webhook automático"],
    workspaceId: "store-1",
    loja: "Loja Fashion Prime",
    config: {
      adAccount: "act_123456789",
      pages: "3 páginas conectadas",
      permissions: "ads_read, leads_retrieval",
      accountName: "Fashion Prime - Conta Principal"
    }
  },
  {
    id: 9,
    name: "Meta Ads - Conta Secundária",
    category: "Publicidade", 
    description: "Conta secundária do Facebook Ads para campanhas sazonais",
    status: "connected",
    icon: "📱",
    setupDate: "2024-02-15",
    lastSync: "1h atrás",
    features: ["Import de leads", "Métricas de campanha", "Webhook automático"],
    workspaceId: "store-1",
    loja: "Loja Fashion Prime",
    config: {
      adAccount: "act_987654321",
      pages: "2 páginas conectadas",
      permissions: "ads_read, leads_retrieval",
      accountName: "Fashion Prime - Campanhas Sazonais"
    }
  },
  {
    id: 3,
    name: "Meta Ads - Tech Store",
    category: "Publicidade",
    description: "Conta do Facebook Ads para produtos de tecnologia", 
    status: "connected",
    icon: "📱",
    setupDate: "2024-01-05",
    lastSync: "3min atrás",
    features: ["Import de leads", "Métricas de campanha", "Webhook automático"],
    workspaceId: "store-2",
    loja: "Loja Tech Store",
    config: {
      adAccount: "act_555666777",
      pages: "1 página conectada",
      permissions: "ads_read, leads_retrieval",
      accountName: "Tech Store - Produtos"
    }
  },
  {
    id: 10,
    name: "Meta Ads - Tech Store B2B",
    category: "Publicidade",
    description: "Conta do Facebook Ads para vendas B2B de tecnologia", 
    status: "connected",
    icon: "📱",
    setupDate: "2024-02-20",
    lastSync: "15min atrás",
    features: ["Import de leads", "Métricas de campanha", "Webhook automático"],
    workspaceId: "store-2",
    loja: "Loja Tech Store",
    config: {
      adAccount: "act_888999000",
      pages: "2 páginas conectadas",
      permissions: "ads_read, leads_retrieval",
      accountName: "Tech Store - B2B"
    }
  },
  {
    id: 11,
    name: "Google Ads - Tech Store",
    category: "Publicidade",
    description: "Conta do Google Ads para produtos de tecnologia", 
    status: "error",
    icon: "🔍",
    setupDate: "2024-01-05",
    lastSync: "Token expirado",
    features: ["Import de leads", "Métricas de performance", "Conversões offline"],
    workspaceId: "store-2",
    loja: "Loja Tech Store",
    config: {
      customerId: "123-456-7890",
      accounts: "2 contas",
      status: "Token expirado - requer reautorização",
      accountName: "Tech Store - Google Ads"
    }
  },
  {
    id: 4,
    name: "Stripe",
    category: "Pagamentos",
    description: "Processe pagamentos e gerencie assinaturas automaticamente",
    status: "connected", 
    icon: "💳",
    setupDate: "2023-11-20",
    lastSync: "1h atrás",
    features: ["Processamento de pagamentos", "Webhooks", "Gestão de assinaturas"],
    workspaceId: "general",
    loja: "Workspace Geral",
    config: {
      mode: "Live",
      webhooks: "5 endpoints ativos",
      currencies: "BRL, USD"
    }
  },
  {
    id: 5,
    name: "Zapier",
    category: "Automação",
    description: "Conecte com mais de 3000 apps através do Zapier",
    status: "disconnected",
    icon: "⚡",
    setupDate: null,
    lastSync: null,
    features: ["3000+ integrações", "Automações personalizadas", "Triggers avançados"],
    workspaceId: "store-2",
    loja: "Loja Tech Store",
    config: null
  },
  {
    id: 6,
    name: "Meta Ads - Beauty Care",
    category: "Publicidade",
    description: "Conta do Facebook Ads para produtos de beleza e cuidados",
    status: "connected",
    icon: "📱", 
    setupDate: "2024-01-20",
    lastSync: "8min atrás",
    features: ["Import de leads", "Métricas de campanha", "Webhook automático"],
    workspaceId: "store-3",
    loja: "Loja Beauty & Care",
    config: {
      adAccount: "act_111222333",
      pages: "4 páginas conectadas",
      permissions: "ads_read, leads_retrieval",
      accountName: "Beauty & Care - Produtos"
    }
  },
  {
    id: 12,
    name: "Meta Ads - Beauty Care Influencers",
    category: "Publicidade",
    description: "Conta do Facebook Ads para campanhas com influencers de beleza",
    status: "connected",
    icon: "📱", 
    setupDate: "2024-03-01",
    lastSync: "2h atrás",
    features: ["Import de leads", "Métricas de campanha", "Webhook automático"],
    workspaceId: "store-3",
    loja: "Loja Beauty & Care",
    config: {
      adAccount: "act_444555666",
      pages: "6 páginas conectadas",
      permissions: "ads_read, leads_retrieval",
      accountName: "Beauty & Care - Influencers"
    }
  },
  {
    id: 13,
    name: "Mailchimp - Beauty Care",
    category: "Email Marketing",
    description: "Sincronize leads com listas do Mailchimp automaticamente",
    status: "disconnected",
    icon: "📧", 
    setupDate: null,
    lastSync: null,
    features: ["Sync de contatos", "Campanhas automáticas", "Segmentação"],
    workspaceId: "store-3",
    loja: "Loja Beauty & Care",
    config: null
  },
  {
    id: 7,
    name: "HubSpot CRM",
    category: "CRM",
    description: "Sincronize leads e contatos com seu HubSpot CRM",
    status: "disconnected",
    icon: "🎯",
    setupDate: null,
    lastSync: null,
    features: ["Sync bidirecional", "Pipeline management", "Activity tracking"],
    workspaceId: "store-1",
    loja: "Loja Fashion Prime",
    config: null
  },
  {
    id: 8,
    name: "RD Station",
    category: "Marketing",
    description: "Envie leads qualificados para o RD Station automaticamente",
    status: "disconnected", 
    icon: "📊",
    setupDate: null,
    lastSync: null,
    features: ["Lead scoring", "Automação de marketing", "Nutrição de leads"],
    workspaceId: "store-3",
    loja: "Loja Beauty & Care",
    config: null
  }
];

const statusConfig = {
  connected: {
    color: "bg-green-500/10 text-green-400 border-green-500/20",
    icon: CheckCircle,
    label: "Conectado"
  },
  disconnected: {
    color: "bg-gray-500/10 text-gray-400 border-gray-500/20", 
    icon: XCircle,
    label: "Desconectado"
  },
  error: {
    color: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: AlertTriangle,
    label: "Erro"
  }
};

const categories = ["Todos", "Mensagens", "Publicidade", "Pagamentos", "Automação", "Email Marketing", "CRM", "Marketing"];

export default function Integrations() {
  const { currentWorkspace } = useWorkspace();
  const isGeneralWorkspace = currentWorkspace.type === "general";
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [lojaFilter, setLojaFilter] = useState("all");

  // Filter integrations based on workspace and filters
  const filteredIntegrations = useMemo(() => {
    return integrations.filter(integration => {
      // Workspace filter
      const matchesWorkspace = isGeneralWorkspace || integration.workspaceId === currentWorkspace.id;
      
      // Search filter
      const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           integration.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = categoryFilter === "all" || integration.category === categoryFilter;
      
      // Loja filter (only in general workspace)
      const matchesLoja = !isGeneralWorkspace || 
                          lojaFilter === "all" || 
                          integration.loja === lojaFilter;
      
      return matchesWorkspace && matchesSearch && matchesCategory && matchesLoja;
    });
  }, [isGeneralWorkspace, currentWorkspace.id, searchTerm, categoryFilter, lojaFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalIntegrations = filteredIntegrations.length;
    const connectedIntegrations = filteredIntegrations.filter(i => i.status === "connected").length;
    const errorIntegrations = filteredIntegrations.filter(i => i.status === "error").length;
    const disconnectedIntegrations = filteredIntegrations.filter(i => i.status === "disconnected").length;

    return { totalIntegrations, connectedIntegrations, errorIntegrations, disconnectedIntegrations };
  }, [filteredIntegrations]);

  // Get unique lojas for filter (only in general workspace)
  const lojas = useMemo(() => {
    if (!isGeneralWorkspace) return [];
    const uniqueLojas = [...new Set(integrations.map(i => i.loja))];
    return uniqueLojas;
  }, [isGeneralWorkspace]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Integrações</h1>
        <p className="text-muted-foreground">
          Conecte o PrismaID com suas ferramentas favoritas e automatize seus processos
          {!isGeneralWorkspace && ` - ${currentWorkspace.name}`}
        </p>
      </div>

      {/* Integration Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Integrações Ativas</p>
                <p className="text-2xl font-bold text-foreground">{stats.connectedIntegrations}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalIntegrations}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Plug className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Com Erro</p>
                <p className="text-2xl font-bold text-foreground">{stats.errorIntegrations}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Desconectadas</p>
                <p className="text-2xl font-bold text-foreground">{stats.disconnectedIntegrations}</p>
              </div>
              <div className="w-12 h-12 bg-gray-500/20 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Filtros e Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Buscar Integração</label>
              <input
                type="text"
                placeholder="Buscar por nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Categoria</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Todas as Categorias</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Loja Filter (only in general workspace) */}
            {isGeneralWorkspace && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Loja</label>
                <select
                  value={lojaFilter}
                  onChange={(e) => setLojaFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">Todas as Lojas</option>
                  {lojas.map(loja => (
                    <option key={loja} value={loja}>{loja}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Integrations Grid */}
      {filteredIntegrations.length === 0 ? (
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plug className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma integração encontrada</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || categoryFilter !== "all" || lojaFilter !== "all"
                ? "Tente ajustar os filtros para encontrar integrações."
                : "Nenhuma integração configurada para este workspace."}
            </p>
            <Button className="bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-glow">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Integração
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredIntegrations.map((integration) => {
          const statusInfo = statusConfig[integration.status];
          const StatusIcon = statusInfo.icon;

          return (
            <Card key={integration.id} className="bg-gradient-card border-border/50 shadow-card hover:border-primary/20 transition-colors">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center text-2xl">
                      {integration.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-foreground">{integration.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs border-border/50 text-muted-foreground">
                          {integration.category}
                        </Badge>
                        {isGeneralWorkspace && (
                          <Badge variant="outline" className="text-xs border-primary/20 text-primary">
                            {integration.loja}
                          </Badge>
                        )}
                        {integration.name.includes('Meta Ads') && (
                          <Badge variant="outline" className="text-xs border-blue-500/20 text-blue-400">
                            Múltiplas Contas
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className={statusInfo.color}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <CardDescription className="text-muted-foreground">
                  {integration.description}
                </CardDescription>

                {integration.status === 'connected' && (
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      <div>Conectado em: {new Date(integration.setupDate).toLocaleDateString('pt-BR')}</div>
                      <div>Última sync: {integration.lastSync}</div>
                    </div>
                    
                    {integration.config && (
                      <div className="bg-accent/10 rounded-lg p-3 space-y-1">
                        <h5 className="text-xs font-medium text-foreground">Configuração:</h5>
                        {integration.config.accountName && (
                          <div className="text-xs text-primary font-medium mb-2">
                            📋 {integration.config.accountName}
                          </div>
                        )}
                        {Object.entries(integration.config).map(([key, value]) => {
                          if (key === 'accountName') return null; // Skip accountName as it's shown above
                          return (
                            <div key={key} className="text-xs text-muted-foreground flex justify-between">
                              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                              <span>{value}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <h5 className="text-xs font-medium text-foreground">Recursos:</h5>
                  <div className="space-y-1">
                    {integration.features.map((feature, index) => (
                      <div key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {integration.status === 'connected' ? (
                    <>
                      <Button variant="outline" size="sm" className="flex-1 border-border hover:bg-accent/50">
                        <Settings className="w-4 h-4 mr-2" />
                        Configurar
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-500/20 text-red-400 hover:bg-red-500/10">
                        Desconectar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="flex-1 bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-glow">
                        <Plus className="w-4 h-4 mr-2" />
                        Conectar
                      </Button>
                      <Button variant="outline" size="sm" className="border-border hover:bg-accent/50">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>

                {integration.status === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <div className="text-xs text-red-400">
                      <AlertTriangle className="w-3 h-3 inline mr-1" />
                      {integration.config?.status || 'Erro na conexão'}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        </div>
      )}
    </div>
  );
}