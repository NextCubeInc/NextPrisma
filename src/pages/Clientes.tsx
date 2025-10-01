"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, EllipsisVertical, Plus, CheckCircle, Trash2 } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWorkspace } from "@/contexts/WorkspaceContext"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

const plataformaColors: Record<string, string> = {
  meta: "bg-blue-500 text-white",
  google: "bg-orange-500 text-white",
  tiktok: "bg-pink-500 text-white",
}

export default function ClientesBase() {
  const [page, setPage] = useState(1)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newClientName, setNewClientName] = useState("")
  const [newClientEmail, setNewClientEmail] = useState("")
  const [newClientPhone, setNewClientPhone] = useState("")
  const [newClientCompany, setNewClientCompany] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  
  const { user } = useAuth()
  const { 
    clients, 
    loadingClients, 
    activeClient, 
    setActiveClient, 
    accounts, 
    userPlan, 
    checkPlanLimit,
    refreshClients 
  } = useWorkspace()

  const perPage = 11
  const start = (page - 1) * perPage
  const end = start + perPage
  const currentClients = clients.slice(start, end)

  const handleCreateClient = async () => {
    if (!newClientName.trim()) {
      toast.error("Nome do cliente é obrigatório")
      return
    }

    try {
      setIsCreating(true)
      
      // Verificar limite do plano
      const limitCheck = await checkPlanLimit("create_client")
      if (!limitCheck.allowed) {
        toast.error(limitCheck.error || "Limite do plano atingido")
        return
      }

      // Primeiro, buscar o ID do usuário na tabela users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user?.id)
        .single()

      if (userError) throw userError

      // Criar cliente no Supabase
      const { data, error } = await supabase
        .from('clients')
        .insert([{
          user_id: userData.id,
          name: newClientName,
          email: newClientEmail || null,
          phone: newClientPhone || null,
          company: newClientCompany || null,
          status: 'active'
        }])
        .select()

      if (error) throw error

      toast.success("Cliente criado com sucesso!")
      setIsCreateDialogOpen(false)
      setNewClientName("")
      setNewClientEmail("")
      setNewClientPhone("")
      setNewClientCompany("")
      
      // Recarregar lista de clientes
      await refreshClients()
      
    } catch (error) {
      console.error('Erro ao criar cliente:', error)
      toast.error("Erro ao criar cliente")
    } finally {
      setIsCreating(false)
    }
  }

  const handleSelectClient = (client: any) => {
    setActiveClient(client)
    toast.success(`Workspace ativo: ${client.name}`)
  }

  const handleDeleteClient = async (clientId: string, clientName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o cliente "${clientName}"? Esta ação não pode ser desfeita.`)) {
      return
    }

    try {
      // Se o cliente ativo está sendo excluído, limpar o workspace ativo
      if (activeClient?.id === clientId) {
        setActiveClient(null)
      }

      // Excluir cliente do Supabase
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId)

      if (error) throw error

      toast.success(`Cliente "${clientName}" excluído com sucesso!`)
      
      // Recarregar lista de clientes
      await refreshClients()
      
    } catch (error) {
      console.error('Erro ao excluir cliente:', error)
      toast.error("Erro ao excluir cliente")
    }
  }

  const getClientIntegrations = (clientId: string) => {
    return accounts
      .filter(account => account.client_id === clientId)
      .map(account => account.integration_type)
      .filter((type, index, self) => self.indexOf(type) === index) // Remove duplicates
  }



  return (
    <div className="pr-20 pl-20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">CLIENTES</h1>
          {userPlan && (
            <p className="text-sm text-muted-foreground">
              Plano {userPlan.name} - {clients.length} de {userPlan.limits.max_clients === -1 ? '∞' : userPlan.limits.max_clients} clientes
            </p>
          )}
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="items-center gap-2">
              <Plus size={16} />
              Criar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Cliente</DialogTitle>
              <DialogDescription>
                Adicione um novo cliente ao seu workspace
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Nome do cliente"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <Label htmlFor="company">Empresa</Label>
                <Input
                  id="company"
                  value={newClientCompany}
                  onChange={(e) => setNewClientCompany(e.target.value)}
                  placeholder="Nome da empresa"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleCreateClient} 
                  disabled={isCreating}
                  className="flex-1"
                >
                  {isCreating ? "Criando..." : "Criar Cliente"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {activeClient && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Workspace Ativo: {activeClient.name}
            </span>
          </div>
        </div>
      )}

      <ul className="border rounded-lg overflow-hidden">
        {currentClients.map(cliente => {
          const integrations = getClientIntegrations(cliente.id)
          const isActive = activeClient?.id === cliente.id
          
          return (
            <li
              key={cliente.id}
              className={`border-b p-4 grid grid-cols-[50px_minmax(150px,200px)_minmax(150px,250px)_minmax(80px,120px)_40px_120px_40px] items-center gap-4 hover:bg-gray-50 transition-colors ${
                isActive ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div>
                <Avatar className="h-10 w-10 rounded-lg">
                  <AvatarImage src="" alt={cliente.name} />
                  <AvatarFallback>
                    {cliente.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <p className="font-medium">{cliente.name}</p>
                {cliente.company && (
                  <p className="text-sm text-muted-foreground">{cliente.company}</p>
                )}
              </div>
              <div className="flex gap-1 flex-wrap">
                {integrations.length > 0 ? (
                  integrations.map((integration, i) => {
                    const color = plataformaColors[integration] || "bg-gray-200 text-gray-800"
                    return (
                      <Badge key={i} className={color} variant="outline">
                        {integration.charAt(0).toUpperCase() + integration.slice(1)}
                      </Badge>
                    )
                  })
                ) : (
                  <Badge variant="secondary">Sem integrações</Badge>
                )}
              </div>
              <div>
                <Badge variant={cliente.status === "active" ? "default" : "secondary"}>
                  {cliente.status}
                </Badge>
              </div>
              <div><Bell className="h-4 w-4 text-muted-foreground" /></div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={isActive ? "default" : "outline"}
                  onClick={() => handleSelectClient(cliente)}
                >
                  {isActive ? "Ativo" : "Selecionar"}
                </Button>
              </div>
              <div>
                <Sheet>
                  <SheetTrigger><EllipsisVertical className="h-4 w-4" /></SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>{cliente.name}</SheetTitle>
                      <SheetDescription>
                        Gerencie os dados do cliente <strong>{cliente.name}</strong>.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Informações</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>Email:</strong> {cliente.email || 'Não informado'}</p>
                          <p><strong>Telefone:</strong> {cliente.phone || 'Não informado'}</p>
                          <p><strong>Empresa:</strong> {cliente.company || 'Não informado'}</p>
                          <p><strong>Status:</strong> {cliente.status}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Integrações</h4>
                        <div className="flex gap-1 flex-wrap">
                          {integrations.length > 0 ? (
                            integrations.map((integration, i) => {
                              const color = plataformaColors[integration] || "bg-gray-200 text-gray-800"
                              return (
                                <Badge key={i} className={color} variant="outline">
                                  {integration.charAt(0).toUpperCase() + integration.slice(1)}
                                </Badge>
                              )
                            })
                          ) : (
                            <p className="text-sm text-muted-foreground">Nenhuma integração configurada</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteClient(cliente.id, cliente.name)}
                          className="w-full flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Excluir Cliente
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </li>
          )
        })}
      </ul>

      {/* Paginação */}
      {clients.length > perPage && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span className="px-4 py-2 text-sm">
            Página {page} de {Math.ceil(clients.length / perPage)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => (end < clients.length ? p + 1 : p))}
            disabled={end >= clients.length}
          >
            Próxima
          </Button>
        </div>
      )}

      {clients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Nenhum cliente encontrado</p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            Criar seu primeiro cliente
          </Button>
        </div>
      )}
    </div>
  )
}