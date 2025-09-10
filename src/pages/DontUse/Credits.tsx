import { MessageSquare, Plus, CreditCard, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const creditPackages = [
  {
    id: 1,
    name: "Pacote Básico",
    credits: 1000,
    price: 49,
    pricePerCredit: 0.049,
    popular: false,
    savings: null
  },
  {
    id: 2,
    name: "Pacote Popular", 
    credits: 2500,
    price: 99,
    pricePerCredit: 0.0396,
    popular: true,
    savings: "20%"
  },
  {
    id: 3,
    name: "Pacote Pro",
    credits: 5000,
    price: 179,
    pricePerCredit: 0.0358,
    popular: false,
    savings: "27%"
  },
  {
    id: 4,
    name: "Pacote Business",
    credits: 10000,
    price: 299,
    pricePerCredit: 0.0299,
    popular: false,
    savings: "39%"
  }
];

const creditHistory = [
  {
    id: 1,
    type: "purchase",
    amount: 2500,
    price: 99,
    date: "2024-01-15 14:30",
    status: "completed",
    description: "Compra de créditos - Pacote Popular"
  },
  {
    id: 2, 
    type: "usage",
    amount: -150,
    date: "2024-01-14 16:45", 
    status: "completed",
    description: "Mensagens WhatsApp - Campanha Black Friday"
  },
  {
    id: 3,
    type: "usage", 
    amount: -89,
    date: "2024-01-14 10:20",
    status: "completed",
    description: "Mensagens WhatsApp - Follow-up Leads"
  },
  {
    id: 4,
    type: "purchase",
    amount: 1000,
    price: 49,
    date: "2024-01-10 09:15",
    status: "completed", 
    description: "Compra de créditos - Pacote Básico"
  },
  {
    id: 5,
    type: "usage",
    amount: -267,
    date: "2024-01-09 18:30",
    status: "completed",
    description: "Mensagens WhatsApp - Promoção Final de Ano"
  }
];

const currentBalance = 1247;

export default function Credits() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Créditos WhatsApp</h1>
        <p className="text-muted-foreground">
          Gerencie seus créditos para envio de mensagens WhatsApp Business
        </p>
      </div>

      {/* Current Balance */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Saldo Atual</p>
                <p className="text-3xl font-bold text-foreground">{currentBalance.toLocaleString('pt-BR')}</p>
                <p className="text-sm text-muted-foreground">créditos disponíveis</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Usado Este Mês</p>
                <p className="text-3xl font-bold text-foreground">506</p>
                <p className="text-sm text-muted-foreground">mensagens enviadas</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estimativa Duração</p>
                <p className="text-3xl font-bold text-foreground">42</p>
                <p className="text-sm text-muted-foreground">dias restantes</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Credit Packages */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Pacotes de Créditos</CardTitle>
          <CardDescription>
            Escolha o pacote ideal para suas necessidades de mensagens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {creditPackages.map((pkg) => (
              <div 
                key={pkg.id} 
                className={`relative p-6 border rounded-xl transition-all hover:scale-105 ${
                  pkg.popular 
                    ? 'border-primary bg-primary/5 shadow-glow' 
                    : 'border-border/50 bg-accent/10'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-primary text-white px-3 py-1">
                      Mais Popular
                    </Badge>
                  </div>
                )}

                {pkg.savings && (
                  <div className="absolute -top-3 right-4">
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                      Economia {pkg.savings}
                    </Badge>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-foreground">{pkg.name}</h3>
                    <div className="text-3xl font-bold text-foreground">
                      {pkg.credits.toLocaleString('pt-BR')}
                    </div>
                    <div className="text-sm text-muted-foreground">créditos</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">
                        R$ {pkg.price}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        R$ {pkg.pricePerCredit.toFixed(4)} por crédito
                      </div>
                    </div>
                  </div>

                  <Button 
                    className={`w-full ${
                      pkg.popular 
                        ? 'bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-glow'
                        : 'border-border hover:bg-accent/50'
                    }`}
                    variant={pkg.popular ? 'default' : 'outline'}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Comprar Agora
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Credit History */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Histórico de Créditos</CardTitle>
          <CardDescription>
            Acompanhe compras e uso dos seus créditos WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-foreground font-medium">Tipo</TableHead>
                <TableHead className="text-foreground font-medium">Créditos</TableHead>
                <TableHead className="text-foreground font-medium">Valor</TableHead>
                <TableHead className="text-foreground font-medium">Data</TableHead>
                <TableHead className="text-foreground font-medium">Status</TableHead>
                <TableHead className="text-foreground font-medium">Descrição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creditHistory.map((transaction) => (
                <TableRow key={transaction.id} className="border-border/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {transaction.type === 'purchase' ? (
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <Plus className="w-4 h-4 text-green-400" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 text-blue-400" />
                        </div>
                      )}
                      <span className="text-foreground">
                        {transaction.type === 'purchase' ? 'Compra' : 'Uso'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${
                      transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('pt-BR')}
                    </span>
                  </TableCell>
                  <TableCell className="text-foreground">
                    {transaction.price ? 
                      new Intl.NumberFormat('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      }).format(transaction.price) 
                      : '-'
                    }
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(transaction.date).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Concluído
                    </Badge>
                  </TableCell>
                  <TableCell className="text-foreground max-w-xs truncate">
                    {transaction.description}
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