import { MessageSquare, Plus, Search, Send, Phone, MoreHorizontal, Clock, CheckCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const conversations = [
  {
    id: 1,
    contact: {
      name: "Maria Silva",
      phone: "+55 11 99999-0001",
      avatar: "/placeholder.svg",
      status: "online"
    },
    lastMessage: "Obrigada pelas informações! Quando posso fazer o pedido?",
    timestamp: "14:23",
    unread: 2,
    tags: ["Hot Lead", "E-commerce"]
  },
  {
    id: 2,
    contact: {
      name: "João Santos",
      phone: "+55 11 99999-0002", 
      avatar: "/placeholder.svg",
      status: "offline"
    },
    lastMessage: "Preciso de mais detalhes sobre o produto",
    timestamp: "13:45",
    unread: 0,
    tags: ["Qualificado"]
  },
  {
    id: 3,
    contact: {
      name: "Ana Costa",
      phone: "+55 11 99999-0003",
      avatar: "/placeholder.svg", 
      status: "online"
    },
    lastMessage: "Vocês aceitam cartão em quantas vezes?",
    timestamp: "12:30",
    unread: 1,
    tags: ["Negociação"]
  },
];

const templates = [
  { id: 1, name: "Boas-vindas", content: "Olá! Bem-vindo(a) à nossa loja. Como posso ajudá-lo(a) hoje?" },
  { id: 2, name: "Informações Produto", content: "Nosso produto possui as seguintes características..." },
  { id: 3, name: "Follow-up", content: "Olá! Gostaria de saber se ainda tem interesse em nosso produto." },
  { id: 4, name: "Agradecimento", content: "Muito obrigado pela sua compra! Seu pedido será processado em breve." },
];

export default function Messages() {
  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Sidebar - Conversations List */}
      <div className="w-1/3 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mensagens</h1>
            <p className="text-sm text-muted-foreground">Central de WhatsApp Business</p>
          </div>
          <Button size="sm" className="bg-gradient-primary hover:bg-gradient-primary/90 text-white">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Credits Info */}
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Créditos WhatsApp</div>
                <div className="text-lg font-bold text-foreground">1,247</div>
              </div>
              <Button variant="outline" size="sm" className="border-border hover:bg-accent/50">
                Comprar Mais
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar conversas..." 
            className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Conversations */}
        <div className="space-y-2 flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <Card key={conversation.id} className="p-0 bg-gradient-card border-border/50 hover:border-primary/20 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={conversation.contact.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {conversation.contact.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${
                      conversation.contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground truncate">
                        {conversation.contact.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                        {conversation.unread > 0 && (
                          <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {conversation.lastMessage}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {conversation.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-border/50 text-muted-foreground">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 bg-gradient-card border-border/50 flex flex-col">
          {/* Chat Header */}
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-primary text-primary-foreground">MS</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-foreground">Maria Silva</h3>
                  <p className="text-sm text-muted-foreground">+55 11 99999-0001 • Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-border hover:bg-accent/50">
                  <Phone className="w-4 h-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="border-border hover:bg-accent/50">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card border-border">
                    <DropdownMenuItem className="text-foreground hover:bg-accent/50">
                      Ver Perfil Completo
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-foreground hover:bg-accent/50">
                      Adicionar Tags
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-foreground hover:bg-accent/50">
                      Bloquear Contato
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              {/* Incoming Message */}
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-accent text-accent-foreground text-sm">MS</AvatarFallback>
                </Avatar>
                <div className="bg-accent/20 rounded-2xl rounded-tl-sm p-3 max-w-[70%]">
                  <p className="text-foreground">Olá! Gostaria de saber mais sobre o produto que vocês anunciaram no Instagram.</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    14:20
                  </div>
                </div>
              </div>

              {/* Outgoing Message */}
              <div className="flex items-start gap-3 justify-end">
                <div className="bg-primary rounded-2xl rounded-tr-sm p-3 max-w-[70%]">
                  <p className="text-primary-foreground">Olá Maria! Fico feliz com seu interesse. Qual produto específico você gostaria de saber mais?</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-primary-foreground/80 justify-end">
                    14:21
                    <CheckCheck className="w-3 h-3" />
                  </div>
                </div>
              </div>

              {/* Incoming Message */}
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-accent text-accent-foreground text-sm">MS</AvatarFallback>
                </Avatar>
                <div className="bg-accent/20 rounded-2xl rounded-tl-sm p-3 max-w-[70%]">
                  <p className="text-foreground">Obrigada pelas informações! Quando posso fazer o pedido?</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    14:23
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          {/* Message Input */}
          <div className="border-t border-border/50 p-4">
            {/* Templates */}
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              {templates.map((template) => (
                <Button
                  key={template.id}
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap border-border hover:bg-accent/50 text-xs"
                >
                  {template.name}
                </Button>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Textarea
                  placeholder="Digite sua mensagem..."
                  className="resize-none bg-card border-border text-foreground placeholder:text-muted-foreground"
                  rows={2}
                />
              </div>
              <Button className="bg-gradient-primary hover:bg-gradient-primary/90 text-white px-4 py-2">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}