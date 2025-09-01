import { Users, Plus, Settings, Trash2, Edit, Building, Store, MoreHorizontal, Crown, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const workspaces = [
  {
    id: 1,
    name: "Workspace Geral",
    type: "general",
    description: "Visão consolidada de todos os negócios",
    members: 3,
    leads: 2847,
    revenue: 127500,
    status: "active",
    role: "owner",
    createdAt: "2023-01-15",
    icon: Building
  },
  {
    id: 2,
    name: "Loja Principal",
    type: "store", 
    description: "E-commerce de produtos digitais",
    members: 2,
    leads: 1247,
    revenue: 89300,
    status: "active",
    role: "owner",
    createdAt: "2023-03-20",
    icon: Store
  },
  {
    id: 3,
    name: "Loja Secundária",
    type: "store",
    description: "Produtos físicos e dropshipping",
    members: 1,
    leads: 856,
    revenue: 34200,
    status: "active", 
    role: "admin",
    createdAt: "2023-08-10",
    icon: Store
  },
  {
    id: 4,
    name: "Marketplace Teste",
    type: "store",
    description: "Projeto experimental - marketplace",
    members: 1,
    leads: 123,
    revenue: 4500,
    status: "inactive",
    role: "owner",
    createdAt: "2023-11-05",
    icon: Store
  }
];

const teamMembers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@empresa.com",
    role: "owner",
    avatar: "/placeholder.svg",
    joinedAt: "2023-01-15",
    lastActive: "Online agora",
    workspaces: 4
  },
  {
    id: 2,
    name: "Maria Santos", 
    email: "maria@empresa.com",
    role: "admin",
    avatar: "/placeholder.svg",
    joinedAt: "2023-02-20",
    lastActive: "2h atrás",
    workspaces: 2
  },
  {
    id: 3,
    name: "Pedro Costa",
    email: "pedro@empresa.com", 
    role: "member",
    avatar: "/placeholder.svg",
    joinedAt: "2023-06-10",
    lastActive: "1d atrás",
    workspaces: 1
  }
];

const statusColors = {
  active: "bg-green-500/10 text-green-400 border-green-500/20",
  inactive: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  suspended: "bg-red-500/10 text-red-400 border-red-500/20",
};

const roleColors = {
  owner: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  admin: "bg-blue-500/10 text-blue-400 border-blue-500/20", 
  member: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const roleIcons = {
  owner: Crown,
  admin: Shield,
  member: Users,
};

export default function Workspaces() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gerenciamento de Workspaces</h1>
          <p className="text-muted-foreground">
            Gerencie seus workspaces e membros da equipe
          </p>
        </div>
        <Button className="bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-glow">
          <Plus className="w-4 h-4 mr-2" />
          Criar Workspace
        </Button>
      </div>

      {/* Workspace Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Workspaces</p>
                <p className="text-2xl font-bold text-foreground">4</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Membros Total</p>
                <p className="text-2xl font-bold text-foreground">7</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Leads Total</p>
                <p className="text-2xl font-bold text-foreground">5.073</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
                <p className="text-2xl font-bold text-foreground">R$ 255k</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workspaces List */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Seus Workspaces</CardTitle>
          <CardDescription>
            Gerencie e monitore todos os seus workspaces
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workspaces.map((workspace) => {
              const IconComponent = workspace.icon;
              return (
                <div key={workspace.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{workspace.name}</h3>
                        <Badge variant="outline" className={statusColors[workspace.status]}>
                          {workspace.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                        <Badge variant="outline" className={roleColors[workspace.role]}>
                          {workspace.role === 'owner' ? 'Proprietário' : 
                           workspace.role === 'admin' ? 'Admin' : 'Membro'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{workspace.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{workspace.members} membros</span>
                        <span>{workspace.leads.toLocaleString('pt-BR')} leads</span>
                        <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(workspace.revenue)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuItem className="text-foreground hover:bg-accent/50">
                        <Settings className="w-4 h-4 mr-2" />
                        Configurações
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-foreground hover:bg-accent/50">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-foreground hover:bg-accent/50">
                        <Users className="w-4 h-4 mr-2" />
                        Gerenciar Membros
                      </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Membros da Equipe</CardTitle>
          <CardDescription>
            Gerencie permissões e acessos dos membros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-foreground font-medium">Membro</TableHead>
                <TableHead className="text-foreground font-medium">Função</TableHead>
                <TableHead className="text-foreground font-medium">Workspaces</TableHead>
                <TableHead className="text-foreground font-medium">Última Atividade</TableHead>
                <TableHead className="text-foreground font-medium">Membro Desde</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => {
                const RoleIcon = roleIcons[member.role];
                return (
                  <TableRow key={member.id} className="border-border/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-foreground">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={roleColors[member.role]}>
                        <RoleIcon className="w-3 h-3 mr-1" />
                        {member.role === 'owner' ? 'Proprietário' : 
                         member.role === 'admin' ? 'Admin' : 'Membro'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-foreground">{member.workspaces}</TableCell>
                    <TableCell className="text-muted-foreground">{member.lastActive}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(member.joinedAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border">
                          <DropdownMenuItem className="text-foreground hover:bg-accent/50">
                            <Edit className="w-4 h-4 mr-2" />
                            Editar Permissões
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-foreground hover:bg-accent/50">
                            <Users className="w-4 h-4 mr-2" />
                            Ver Workspaces
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remover Acesso
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