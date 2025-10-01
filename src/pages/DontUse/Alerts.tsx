import { Bell, Plus, AlertTriangle, CheckCircle, Clock, Filter, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const alertsData = [
  {
    id: 1,
    title: "ROI abaixo do esperado",
    description: "Campanha 'Black Friday 2024' com ROI de 1.2x (meta: 3.0x)",
    type: "performance",
    severity: "high",
    status: "active",
    triggeredAt: "2024-01-15 14:30",
    workspace: "Loja Principal"
  },
  {
    id: 2,
    title: "Créditos WhatsApp baixos",
    description: "Restam apenas 150 créditos (limite: 100)",
    type: "credits",
    severity: "medium",
    status: "active",
    triggeredAt: "2024-01-15 10:15",
    workspace: "Geral"
  },
  {
    id: 3,
    title: "Novo lead qualificado",
    description: "Lead com score 95/100 aguardando contato",
    type: "lead",
    severity: "low",
    status: "resolved",
    triggeredAt: "2024-01-14 16:45",
    workspace: "Loja Secundária"
  },
  {
    id: 4,
    title: "Limite de envios atingido",
    description: "Plano atual atingiu 1000 mensagens mensais",
    type: "limit",
    severity: "high",
    status: "active",
    triggeredAt: "2024-01-14 09:00",
    workspace: "Geral"
  },
];

const severityColors = {
  high: "bg-red-500/10 text-red-400 border-red-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const statusColors = {
  active: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  resolved: "bg-green-500/10 text-green-400 border-green-500/20",
  snoozed: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const typeIcons = {
  performance: AlertTriangle,
  credits: Bell,
  lead: CheckCircle,
  limit: Clock,
};

export default function Alerts() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sistema de Alertas</h1>
          <p className="text-muted-foreground">
            Configure e monitore alertas importantes do seu negócio
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-border hover:bg-accent/50">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
          <Button className="bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-glow">
            <Plus className="w-4 h-4 mr-2" />
            Criar Alerta
          </Button>
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alertas Ativos</p>
                <p className="text-2xl font-bold text-foreground">3</p>
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
                <p className="text-sm font-medium text-muted-foreground">Resolvidos Hoje</p>
                <p className="text-2xl font-bold text-foreground">1</p>
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
                <p className="text-sm font-medium text-muted-foreground">Alta Prioridade</p>
                <p className="text-2xl font-bold text-foreground">2</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tempo Médio</p>
                <p className="text-2xl font-bold text-foreground">2.5h</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Table */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Alertas Recentes</CardTitle>
          <CardDescription>
            Histórico e status dos alertas configurados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-foreground font-medium">Alerta</TableHead>
                <TableHead className="text-foreground font-medium">Tipo</TableHead>
                <TableHead className="text-foreground font-medium">Severidade</TableHead>
                <TableHead className="text-foreground font-medium">Status</TableHead>
                <TableHead className="text-foreground font-medium">Workspace</TableHead>
                <TableHead className="text-foreground font-medium">Acionado em</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alertsData.map((alert) => {
                const TypeIcon = typeIcons[alert.type];
                return (
                  <TableRow key={alert.id} className="border-border/50">
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center mt-1">
                          <TypeIcon className="w-4 h-4 text-foreground" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{alert.title}</div>
                          <div className="text-sm text-muted-foreground max-w-md">
                            {alert.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-border/50 text-foreground">
                        {alert.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={severityColors[alert.severity]}>
                        {alert.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[alert.status]}>
                        {alert.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-foreground">{alert.workspace}</TableCell>
                    <TableCell className="text-muted-foreground">{alert.triggeredAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border">
                          <DropdownMenuItem className="text-foreground hover:bg-accent/50">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Marcar como Resolvido
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-foreground hover:bg-accent/50">
                            <Clock className="w-4 h-4 mr-2" />
                            Adiar por 1h
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-foreground hover:bg-accent/50">
                            <Bell className="w-4 h-4 mr-2" />
                            Editar Configurações
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}