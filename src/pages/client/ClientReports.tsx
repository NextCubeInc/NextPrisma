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
  FileText, 
  Plus, 
  Download, 
  Send,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Report {
  id: string;
  title: string;
  description: string;
  type: 'performance' | 'summary' | 'custom';
  status: 'generating' | 'ready' | 'sent' | 'failed';
  created_at: string;
  sent_at?: string;
  recipient_phone?: string;
}

export function ClientReports() {
  const { clientId } = useParams<{ clientId: string }>();
  const { activeClient, setActiveClient, clients, checkPlanLimit, userPlan } = useWorkspace();
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [reportTitle, setReportTitle] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportType, setReportType] = useState<'performance' | 'summary' | 'custom'>('performance');
  const [recipientPhone, setRecipientPhone] = useState("");

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
    if (activeClient) {
      loadReports();
    }
  }, [activeClient]);

  const loadReports = async () => {
    try {
      setLoading(true);
      
      // Simular dados de relatórios (em um cenário real, isso viria do banco de dados)
      const mockReports: Report[] = [
        {
          id: '1',
          title: 'Relatório de Performance - Dezembro',
          description: 'Análise completa das campanhas do mês de dezembro',
          type: 'performance',
          status: 'ready',
          created_at: '2024-01-15T10:30:00Z',
          sent_at: '2024-01-15T11:00:00Z',
          recipient_phone: '+5511999999999'
        },
        {
          id: '2',
          title: 'Resumo Semanal',
          description: 'Resumo das principais métricas da semana',
          type: 'summary',
          status: 'sent',
          created_at: '2024-01-14T09:15:00Z',
          sent_at: '2024-01-14T09:30:00Z',
          recipient_phone: '+5511888888888'
        },
        {
          id: '3',
          title: 'Análise Personalizada - ROI',
          description: 'Análise detalhada do retorno sobre investimento',
          type: 'custom',
          status: 'generating',
          created_at: '2024-01-16T14:20:00Z'
        }
      ];

      // Simular delay de carregamento
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setReports(mockReports);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
      toast.error('Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = async () => {
    if (!user || !activeClient) return;

    try {
      setCreating(true);

      // Verificar limite do plano
      const limitCheck = await checkPlanLimit('create_report');
      if (!limitCheck.allowed) {
        toast.error(`Limite atingido! ${limitCheck.message}`);
        return;
      }

      // Simular criação do relatório
      const newReport: Report = {
        id: Date.now().toString(),
        title: reportTitle,
        description: reportDescription,
        type: reportType,
        status: 'generating',
        created_at: new Date().toISOString(),
        recipient_phone: recipientPhone || undefined
      };

      setReports(prev => [newReport, ...prev]);
      
      // Simular processo de geração
      setTimeout(() => {
        setReports(prev => prev.map(report => 
          report.id === newReport.id 
            ? { ...report, status: 'ready' as const }
            : report
        ));
        toast.success('Relatório gerado com sucesso!');
      }, 3000);

      // Limpar formulário e fechar dialog
      setReportTitle("");
      setReportDescription("");
      setReportType('performance');
      setRecipientPhone("");
      setIsDialogOpen(false);

      toast.success('Relatório criado! Gerando conteúdo...');
    } catch (error) {
      console.error('Erro ao criar relatório:', error);
      toast.error('Erro ao criar relatório');
    } finally {
      setCreating(false);
    }
  };

  const handleSendReport = async (reportId: string) => {
    try {
      const report = reports.find(r => r.id === reportId);
      if (!report || !report.recipient_phone) {
        toast.error('Número do WhatsApp não informado');
        return;
      }

      // Simular envio via WhatsApp
      setReports(prev => prev.map(r => 
        r.id === reportId 
          ? { ...r, status: 'sent' as const, sent_at: new Date().toISOString() }
          : r
      ));

      toast.success('Relatório enviado via WhatsApp!');
    } catch (error) {
      console.error('Erro ao enviar relatório:', error);
      toast.error('Erro ao enviar relatório');
    }
  };

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'generating':
        return <Badge variant="secondary"><Loader2 className="h-3 w-3 mr-1 animate-spin" />Gerando</Badge>;
      case 'ready':
        return <Badge variant="outline"><CheckCircle className="h-3 w-3 mr-1" />Pronto</Badge>;
      case 'sent':
        return <Badge variant="default"><Send className="h-3 w-3 mr-1" />Enviado</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Erro</Badge>;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: Report['type']) => {
    switch (type) {
      case 'performance':
        return 'Performance';
      case 'summary':
        return 'Resumo';
      case 'custom':
        return 'Personalizado';
      default:
        return type;
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
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Gere e envie relatórios via WhatsApp para {activeClient.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {userPlan && (
            <Badge variant="outline">
              {userPlan.name} - {reports.length} relatórios
            </Badge>
          )}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Relatório
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Criar Novo Relatório</DialogTitle>
                <DialogDescription>
                  Configure os detalhes do relatório que será gerado para {activeClient.name}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="Ex: Relatório de Performance - Janeiro"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Descreva o conteúdo do relatório..."
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Tipo de Relatório</Label>
                  <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="summary">Resumo</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">WhatsApp (opcional)</Label>
                  <Input
                    id="phone"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="+5511999999999"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleCreateReport} 
                  disabled={creating || !reportTitle.trim()}
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Criar Relatório
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Lista de Relatórios */}
      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-5 bg-muted animate-pulse rounded w-48"></div>
                    <div className="h-4 bg-muted animate-pulse rounded w-32"></div>
                  </div>
                  <div className="h-6 bg-muted animate-pulse rounded w-16"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted animate-pulse rounded w-full mb-2"></div>
                <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum relatório encontrado</CardTitle>
            <CardDescription>
              Crie seu primeiro relatório para {activeClient.name} clicando no botão "Novo Relatório".
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Relatório
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{getTypeLabel(report.type)}</Badge>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(report.created_at).toLocaleDateString('pt-BR')}
                      </span>
                      {report.sent_at && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Enviado em {new Date(report.sent_at).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  {getStatusBadge(report.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {report.description}
                </p>
                {report.recipient_phone && (
                  <p className="text-xs text-muted-foreground mb-4">
                    WhatsApp: {report.recipient_phone}
                  </p>
                )}
                <div className="flex gap-2">
                  {report.status === 'ready' && (
                    <>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      {report.recipient_phone && (
                        <Button 
                          size="sm" 
                          onClick={() => handleSendReport(report.id)}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Enviar WhatsApp
                        </Button>
                      )}
                    </>
                  )}
                  {report.status === 'sent' && (
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                  {report.status === 'failed' && (
                    <Button size="sm" variant="outline">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Tentar Novamente
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}