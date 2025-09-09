import { Plug, CheckCircle, XCircle, Settings, Plus, AlertTriangle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

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
    config: {
      phoneNumber: "+55 11 99999-0000",
      businessId: "120363194***",
      webhook: "Ativo"
    }
  },
  {
    id: 2,
    name: "Meta Ads (Facebook/Instagram)",
    category: "Publicidade", 
    description: "Importe leads de campanhas do Facebook e Instagram automaticamente",
    status: "connected",
    icon: "📱",
    setupDate: "2024-01-10",
    lastSync: "5min atrás",
    features: ["Import de leads", "Métricas de campanha", "Webhook automático"],
    config: {
      adAccount: "act_123456789",
      pages: "3 páginas conectadas",
      permissions: "ads_read, leads_retrieval"
    }
  },
  {
    id: 3,
    name: "Google Ads",
    category: "Publicidade",
    description: "Conecte suas campanhas do Google Ads e importe leads automaticamente", 
    status: "error",
    icon: "🔍",
    setupDate: "2024-01-05",
    lastSync: "Token expirado",
    features: ["Import de leads", "Métricas de performance", "Conversões offline"],
    config: {
      customerId: "123-456-7890",
      accounts: "2 contas",
      status: "Token expirado - requer reautorização"
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
    config: null
  },
  {
    id: 6,
    name: "Mailchimp",
    category: "Email Marketing",
    description: "Sincronize leads com listas do Mailchimp automaticamente",
    status: "disconnected",
    icon: "📧", 
    setupDate: null,
    lastSync: null,
    features: ["Sync de contatos", "Campanhas automáticas", "Segmentação"],
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
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Integrações</h1>
        <p className="text-muted-foreground">
          Conecte o PrismaID com suas ferramentas favoritas e automatize seus processos
        </p>
      </div>

      {/* Integration Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Integrações Ativas</p>
                <p className="text-2xl font-bold text-foreground">4</p>
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
                <p className="text-sm font-medium text-muted-foreground">Disponíveis</p>
                <p className="text-2xl font-bold text-foreground">8</p>
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
                <p className="text-2xl font-bold text-foreground">1</p>
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
                <p className="text-sm font-medium text-muted-foreground">Última Sync</p>
                <p className="text-2xl font-bold text-foreground">2min</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filters */}
      <Card className="bg-gradient-card border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                className="border-border hover:bg-accent/50"
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integrations Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => {
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
                      <Badge variant="outline" className="text-xs border-border/50 text-muted-foreground mt-1">
                        {integration.category}
                      </Badge>
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
                        {Object.entries(integration.config).map(([key, value]) => (
                          <div key={key} className="text-xs text-muted-foreground flex justify-between">
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                            <span>{value}</span>
                          </div>
                        ))}
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
    </div>
  );
}