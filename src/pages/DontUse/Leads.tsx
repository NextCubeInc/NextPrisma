import { useState } from "react";
import { Search, Filter, Download, Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MetricCard } from "@/components/ui/metric-card";
import { Users, Target, DollarSign, TrendingUp } from "lucide-react";

// Mock data
const leadsData = [
  {
    id: 1,
    name: "Maria Santos",
    email: "maria@empresa.com",
    phone: "(11) 99999-9999",
    source: "Google Ads",
    status: "hot",
    score: 95,
    value: "R$ 5,200",
    created: "2024-01-15",
  },
  {
    id: 2,
    name: "Carlos Silva",
    email: "carlos@startup.io",
    phone: "(11) 88888-8888",
    source: "LinkedIn",
    status: "warm",
    score: 75,
    value: "R$ 3,800",
    created: "2024-01-14",
  },
  {
    id: 3,
    name: "Ana Costa",
    email: "ana@tech.com.br",
    phone: "(11) 77777-7777",
    source: "Website",
    status: "cold",
    score: 45,
    value: "R$ 2,100",
    created: "2024-01-13",
  },
  {
    id: 4,
    name: "Pedro Oliveira",
    email: "pedro@digital.co",
    phone: "(11) 66666-6666",
    source: "Facebook",
    status: "hot",
    score: 88,
    value: "R$ 7,500",
    created: "2024-01-12",
  },
  {
    id: 5,
    name: "Julia Lima",
    email: "julia@marketing.com",
    phone: "(11) 55555-5555",
    source: "Referral",
    status: "warm",
    score: 82,
    value: "R$ 4,300",
    created: "2024-01-11",
  },
];

const statusColors = {
  hot: "bg-red-500/10 text-red-500 border-red-500/20",
  warm: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  cold: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

const metrics = [
  {
    title: "Total de Leads",
    value: "847",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Leads Qualificados",
    value: "234",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: Target,
  },
  {
    title: "Valor Pipeline",
    value: "R$ 89,430",
    change: "+15.3%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "Score Médio",
    value: "78",
    change: "+2.1",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
];

export default function Leads() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLeads = leadsData.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leads</h1>
          <p className="text-muted-foreground">
            Gerencie seus leads e acompanhe o pipeline de vendas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="hover:bg-accent/50 transition-smooth">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90 transition-smooth shadow-elegant">
            <Plus className="w-4 h-4 mr-2" />
            Novo Lead
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Filters and Search */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Lista de Leads</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os seus leads em um só lugar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
            <Button variant="outline" className="hover:bg-accent/50 transition-smooth">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Leads Table */}
          <div className="rounded-md border border-border/50 bg-background/30">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead>Nome</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className="border-border/50 hover:bg-accent/30 transition-smooth">
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{lead.name}</p>
                        <p className="text-sm text-muted-foreground">{lead.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground">{lead.phone}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-background/50">
                        {lead.source}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[lead.status as keyof typeof statusColors]}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="font-medium">{lead.score}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {lead.value}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(lead.created).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Converter</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}