import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Facebook, 
  Search, 
  Music, 
  Plus, 
  Settings,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Trash2,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const integrationTypes = [
  {
    id: 'meta',
    name: 'Meta Ads',
    description: 'Facebook e Instagram Ads',
    icon: Facebook,
    color: 'bg-blue-500'
  },
  {
    id: 'google',
    name: 'Google Ads',
    description: 'Google Ads e YouTube Ads',
    icon: Search,
    color: 'bg-green-500'
  },
  {
    id: 'tiktok',
    name: 'TikTok Ads',
    description: 'TikTok for Business',
    icon: Music,
    color: 'bg-pink-500'
  }
];

export function ClientIntegrations() {
  const { clientId } = useParams<{ clientId: string }>();
  const { activeClient, setActiveClient, clients, integrations, checkPlanLimit, userPlan, loadIntegrations } = useWorkspace();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [selectedType, setSelectedType] = useState("");
  const [integrationName, setIntegrationName] = useState("");
  const [integrationDescription, setIntegrationDescription] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");

  useEffect(() => {
    // Se o cliente ativo não corresponde ao ID da URL, buscar e definir o cliente correto
    if (clientId && (!activeClient || activeClient.id !== clientId)) {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        setActiveClient(client);
      }
    }
  }, [clientId, activeClient, clients, setActiveClient]);

  const handleCreateIntegration = async () => {
    if (!user || !activeClient) return;

    try {
      setCreating(true);

      // Verificar limite do plano
      const limitCheck = await checkPlanLimit('create_account');
      if (!limitCheck.allowed) {
        toast.error(`Limite atingido! ${limitCheck.message}`);
        return;
      }

      // Criar integração no banco de dados
      const { data, error } = await supabase
        .from('ad_integrations')
        .insert({
          client_id: activeClient.id,
          integration_type: selectedType,
          integration_name: integrationName || `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Ads`,
          integration_description: integrationDescription,
          credentials: {
            api_key: apiKey,
            api_secret: apiSecret
          },
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar integração:', error);
        toast.error('Erro ao criar integração');
        return;
      }

      // Recarregar integrações
      await loadIntegrations();

      // Limpar formulário e fechar dialog
      setSelectedType("");
      setIntegrationName("");
      setIntegrationDescription("");
      setApiKey("");
      setApiSecret("");
      setIsDialogOpen(false);

      toast.success('Integração criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar integração:', error);
      toast.error('Erro ao criar integração');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteIntegration = async (integrationId: string) => {
    try {
      const { error } = await supabase
        .from('ad_integrations')
        .delete()
        .eq('id', integrationId);

      if (error) {
        console.error('Erro ao deletar integração:', error);
        toast.error('Erro ao deletar integração');
        return;
      }

      // Recarregar integrações
      await loadIntegrations();
      toast.success('Integração removida com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar integração:', error);
      toast.error('Erro ao deletar integração');
    }
  };

  const handleSyncIntegration = async (integrationId: string) => {
    try {
      setLoading(true);

      // Simular sincronização
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Atualizar última sincronização
      const { error } = await supabase
        .from('ad_integrations')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('id', integrationId);

      if (error) {
        console.error('Erro ao sincronizar:', error);
        toast.error('Erro ao sincronizar integração');
        return;
      }

      // Recarregar integrações
      await loadIntegrations();
      toast.success('Sincronização concluída!');
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
      toast.error('Erro ao sincronizar integração');
    } finally {
      setLoading(false);
    }
  };

  const getIntegrationTypeInfo = (type: string) => {
    return integrationTypes.find(t => t.id === type) || {
      id: type,
      name: type,
      description: '',
      icon: Settings,
      color: 'bg-gray-500'
    };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Ativo</Badge>;
      case 'inactive':
        return <Badge variant="secondary"><AlertTriangle className="h-3 w-3 mr-1" />Inativo</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Erro</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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

  const clientIntegrations = integrations.filter(integration => integration.client_id === activeClient.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrações</h1>
          <p className="text-muted-foreground">
            Gerencie as integrações de anúncios para {activeClient.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {userPlan && (
            <Badge variant="outline">
              {userPlan.name} - {clientIntegrations.length} integração{clientIntegrations.length !== 1 ? 'ões' : ''}
            </Badge>
          )}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Integração
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Integração</DialogTitle>
                <DialogDescription>
                  Configure uma nova integração de anúncios para {activeClient.name}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Plataforma</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      {integrationTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome da Integração</Label>
                  <Input
                    id="name"
                    value={integrationName}
                    onChange={(e) => setIntegrationName(e.target.value)}
                    placeholder="Ex: Conta Principal Meta Ads"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    value={integrationDescription}
                    onChange={(e) => setIntegrationDescription(e.target.value)}
                    placeholder="Descreva esta integração..."
                    rows={2}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Sua API Key"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="api-secret">API Secret</Label>
                  <Input
                    id="api-secret"
                    type="password"
                    value={apiSecret}
                    onChange={(e) => setApiSecret(e.target.value)}
                    placeholder="Sua API Secret"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleCreateIntegration} 
                  disabled={creating || !selectedType || !apiKey}
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Integração
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Integrações Disponíveis */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Plataformas Disponíveis</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {integrationTypes.map((type) => {
            const hasIntegration = clientIntegrations.some(i => i.integration_type === type.id);
            const IconComponent = type.icon;
            
            return (
              <Card key={type.id} className={hasIntegration ? "border-green-200 bg-green-50" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${type.color} text-white`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{type.name}</CardTitle>
                      <CardDescription>{type.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {hasIntegration ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">Integrado</span>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setSelectedType(type.id);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Conectar
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Lista de Integrações Ativas */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Integrações Ativas</h2>
        {clientIntegrations.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Nenhuma integração configurada</CardTitle>
              <CardDescription>
                Adicione sua primeira integração para começar a sincronizar dados de anúncios.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Integração
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {clientIntegrations.map((integration) => {
              const typeInfo = getIntegrationTypeInfo(integration.integration_type);
              const IconComponent = typeInfo.icon;
              
              return (
                <Card key={integration.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${typeInfo.color} text-white`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {integration.integration_name || typeInfo.name}
                          </CardTitle>
                          <CardDescription>
                            {integration.integration_description || typeInfo.description}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(integration.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {integration.last_sync_at ? (
                          <span>
                            Última sincronização: {new Date(integration.last_sync_at).toLocaleDateString('pt-BR')} às {new Date(integration.last_sync_at).toLocaleTimeString('pt-BR')}
                          </span>
                        ) : (
                          <span>Nunca sincronizado</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSyncIntegration(integration.id)}
                          disabled={loading}
                        >
                          {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteIntegration(integration.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}