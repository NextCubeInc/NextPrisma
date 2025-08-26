import { Crown, Check, Zap, Users, MessageSquare, BarChart3, Globe, Megaphone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Starter",
    price: 99,
    period: "mês",
    description: "Ideal para pequenos negócios",
    popular: false,
    current: false,
    features: [
      "1 Workspace",
      "500 leads/mês", 
      "1.000 mensagens WhatsApp",
      "2 landing pages",
      "Analytics básico",
      "Suporte por email"
    ],
    limits: {
      workspaces: 1,
      leads: 500,
      messages: 1000,
      landingPages: 2,
      users: 1
    }
  },
  {
    name: "Growth",
    price: 149,
    period: "mês", 
    description: "Para empresas em crescimento",
    popular: true,
    current: true,
    features: [
      "3 Workspaces",
      "2.000 leads/mês",
      "5.000 mensagens WhatsApp", 
      "10 landing pages",
      "Analytics avançado",
      "A/B Testing",
      "Automações",
      "Suporte prioritário"
    ],
    limits: {
      workspaces: 3,
      leads: 2000,
      messages: 5000,
      landingPages: 10,
      users: 3
    }
  },
  {
    name: "Pro",
    price: 299,
    period: "mês",
    description: "Para equipes profissionais",
    popular: false, 
    current: false,
    features: [
      "10 Workspaces",
      "10.000 leads/mês",
      "20.000 mensagens WhatsApp",
      "Landing pages ilimitadas",
      "Analytics completo",
      "White label",
      "API Access",
      "Integrações personalizadas",
      "Suporte 24/7"
    ],
    limits: {
      workspaces: 10,
      leads: 10000,
      messages: 20000,
      landingPages: "Ilimitado",
      users: 10
    }
  },
  {
    name: "Business",
    price: 599,
    period: "mês",
    description: "Para grandes organizações", 
    popular: false,
    current: false,
    features: [
      "Workspaces ilimitados",
      "Leads ilimitados",
      "100.000 mensagens WhatsApp",
      "Tudo ilimitado", 
      "Analytics enterprise",
      "Gerente de conta dedicado",
      "Onboarding personalizado",
      "SLA garantido",
      "Consultoria estratégica"
    ],
    limits: {
      workspaces: "Ilimitado",
      leads: "Ilimitado", 
      messages: 100000,
      landingPages: "Ilimitado",
      users: "Ilimitado"
    }
  }
];

const currentUsage = {
  workspaces: 2,
  leads: 1247,
  messages: 3420,
  landingPages: 7,
  users: 2
};

const featureIcons = {
  "Workspaces": Users,
  "leads": BarChart3,
  "mensagens": MessageSquare,
  "landing pages": Globe,
  "Analytics": BarChart3,
  "Default": Check
};

export default function Upgrade() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="w-8 h-8 text-yellow-500" />
          <h1 className="text-4xl font-bold text-foreground">Upgrade de Plano</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Desbloqueie todo o potencial do PrismaID com recursos avançados e limites maiores
        </p>
      </div>

      {/* Current Usage */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Uso Atual (Plano Growth)</CardTitle>
          <CardDescription>
            Acompanhe seus limites e considere fazer upgrade quando necessário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Workspaces</span>
                <span className="text-sm font-medium text-foreground">{currentUsage.workspaces}/3</span>
              </div>
              <div className="w-full bg-accent/20 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(currentUsage.workspaces / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Leads</span>
                <span className="text-sm font-medium text-foreground">{currentUsage.leads}/2.000</span>
              </div>
              <div className="w-full bg-accent/20 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(currentUsage.leads / 2000) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Mensagens</span>
                <span className="text-sm font-medium text-foreground">{currentUsage.messages}/5.000</span>
              </div>
              <div className="w-full bg-accent/20 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(currentUsage.messages / 5000) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Landing Pages</span>
                <span className="text-sm font-medium text-foreground">{currentUsage.landingPages}/10</span>
              </div>
              <div className="w-full bg-accent/20 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(currentUsage.landingPages / 10) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Usuários</span>
                <span className="text-sm font-medium text-foreground">{currentUsage.users}/3</span>
              </div>
              <div className="w-full bg-accent/20 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(currentUsage.users / 3) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans Grid */}
      <div className="grid gap-6 lg:grid-cols-4">
        {plans.map((plan, index) => (
          <Card 
            key={plan.name} 
            className={`relative bg-gradient-card border-border/50 shadow-card transition-all hover:scale-105 ${
              plan.popular ? 'ring-2 ring-primary shadow-glow' : ''
            } ${plan.current ? 'border-green-500/50' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-primary text-white px-4 py-1">
                  <Zap className="w-3 h-3 mr-1" />
                  Mais Popular
                </Badge>
              </div>
            )}

            {plan.current && (
              <div className="absolute -top-4 right-4">
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                  Plano Atual
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-foreground">{plan.name}</CardTitle>
              <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
              <div className="space-y-1">
                <div className="text-4xl font-bold text-foreground">
                  R$ {plan.price}
                </div>
                <div className="text-sm text-muted-foreground">por {plan.period}</div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                className={`w-full ${
                  plan.current 
                    ? 'bg-green-500/20 text-green-400 border-green-500/20 hover:bg-green-500/30' 
                    : plan.popular
                    ? 'bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-glow'
                    : 'border-border hover:bg-accent/50'
                }`}
                variant={plan.current ? 'outline' : plan.popular ? 'default' : 'outline'}
                disabled={plan.current}
              >
                {plan.current ? 'Plano Atual' : 'Fazer Upgrade'}
              </Button>

              {!plan.current && (
                <div className="text-center">
                  <Button variant="link" className="text-xs text-muted-foreground p-0 h-auto">
                    Ver comparação completa
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Perguntas Frequentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Posso mudar de plano a qualquer momento?</h4>
              <p className="text-sm text-muted-foreground">
                Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. Mudanças são aplicadas no próximo ciclo de cobrança.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">O que acontece se exceder meus limites?</h4>
              <p className="text-sm text-muted-foreground">
                Você receberá notificações quando estiver próximo dos limites. Recursos podem ser temporariamente suspensos até o upgrade.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Há desconto para pagamento anual?</h4>
              <p className="text-sm text-muted-foreground">
                Sim, oferecemos 2 meses grátis para assinaturas anuais. Entre em contato para mais detalhes.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Posso cancelar a qualquer momento?</h4>
              <p className="text-sm text-muted-foreground">
                Sim, não há fidelidade. Você pode cancelar a qualquer momento e terá acesso até o final do período pago.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}