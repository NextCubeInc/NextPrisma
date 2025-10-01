import { CreditCard, Download, Eye, Calendar, DollarSign, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const currentPlan = {
  name: "Growth",
  price: 149,
  nextBilling: "2024-02-15",
  status: "active"
};

const billingHistory = [
  {
    id: "INV-2024-001",
    date: "2024-01-15",
    amount: 149,
    status: "paid",
    description: "Plano Growth - Janeiro 2024",
    downloadUrl: "#"
  },
  {
    id: "INV-2023-012",
    date: "2023-12-15", 
    amount: 149,
    status: "paid",
    description: "Plano Growth - Dezembro 2023",
    downloadUrl: "#"
  },
  {
    id: "INV-2023-011",
    date: "2023-11-15",
    amount: 99,
    status: "paid", 
    description: "Plano Starter - Novembro 2023",
    downloadUrl: "#"
  },
  {
    id: "INV-2023-010",
    date: "2023-10-15",
    amount: 99,
    status: "overdue",
    description: "Plano Starter - Outubro 2023",
    downloadUrl: "#"
  },
];

const statusColors = {
  paid: "bg-green-500/10 text-green-400 border-green-500/20",
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", 
  overdue: "bg-red-500/10 text-red-400 border-red-500/20",
  cancelled: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const statusIcons = {
  paid: CheckCircle,
  pending: Clock,
  overdue: XCircle,
  cancelled: XCircle,
};

export default function Billing() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Faturamento</h1>
        <p className="text-muted-foreground">
          Gerencie sua assinatura e histórico de pagamentos
        </p>
      </div>

      {/* Current Plan Summary */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <CreditCard className="w-5 h-5" />
              Plano Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-2xl font-bold text-foreground">{currentPlan.name}</div>
                <div className="text-muted-foreground">
                  R$ {currentPlan.price}/mês
                </div>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                Ativo
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Calendar className="w-5 h-5" />
              Próxima Cobrança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {new Date(currentPlan.nextBilling).toLocaleDateString('pt-BR')}
                </div>
                <div className="text-muted-foreground">
                  R$ {currentPlan.price}
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-border hover:bg-accent/50">
                Alterar Forma de Pagamento
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <DollarSign className="w-5 h-5" />
              Gasto Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-2xl font-bold text-foreground">R$ 1.487</div>
                <div className="text-muted-foreground">
                  últimos 12 meses
                </div>
              </div>
              <div className="text-sm text-green-400">
                Economia de R$ 298 vs mensal
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Forma de Pagamento</CardTitle>
          <CardDescription>
            Gerencie seus métodos de pagamento salvos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-accent/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-medium text-foreground">**** **** **** 4532</div>
                <div className="text-sm text-muted-foreground">Visa • Expira 08/26</div>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
              Padrão
            </Badge>
          </div>
          <Button variant="outline" className="mt-4 border-border hover:bg-accent/50">
            Adicionar Novo Cartão
          </Button>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Histórico de Faturas</CardTitle>
          <CardDescription>
            Visualize e baixe suas faturas anteriores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-foreground font-medium">Fatura</TableHead>
                <TableHead className="text-foreground font-medium">Data</TableHead>
                <TableHead className="text-foreground font-medium">Valor</TableHead>
                <TableHead className="text-foreground font-medium">Status</TableHead>
                <TableHead className="text-foreground font-medium">Descrição</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map((invoice) => {
                const StatusIcon = statusIcons[invoice.status];
                return (
                  <TableRow key={invoice.id} className="border-border/50">
                    <TableCell className="font-medium text-foreground">
                      {invoice.id}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {new Date(invoice.date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {new Intl.NumberFormat('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      }).format(invoice.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[invoice.status]}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {invoice.status === 'paid' ? 'Pago' : 
                         invoice.status === 'pending' ? 'Pendente' :
                         invoice.status === 'overdue' ? 'Vencido' : 'Cancelado'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-foreground max-w-xs truncate">
                      {invoice.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
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