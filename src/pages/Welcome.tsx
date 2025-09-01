import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  BarChart3, 
  Users, 
  Store, 
  MessageCircle,
  Star,
  CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Zap,
    title: "Automação Inteligente",
    description: "Automatize campanhas e workflows para maximizar conversões",
    color: "bg-gradient-primary"
  },
  {
    icon: Shield,
    title: "Segurança Avançada",
    description: "Proteção de dados e compliance com LGPD",
    color: "bg-gradient-secondary"
  },
  {
    icon: BarChart3,
    title: "Analytics em Tempo Real",
    description: "Métricas detalhadas para otimizar performance",
    color: "bg-gradient-hero"
  },
  {
    icon: Users,
    title: "Gestão de Leads",
    description: "Sistema completo de captura e qualificação",
    color: "bg-gradient-glass"
  },
  {
    icon: Store,
    title: "Multi-Workspaces",
    description: "Gerencie múltiplas lojas em uma única plataforma",
    color: "bg-gradient-primary"
  },
  {
    icon: MessageCircle,
    title: "Integração WhatsApp",
    description: "Comunicação direta com seus clientes",
    color: "bg-gradient-secondary"
  }
];

const testimonials = [
  {
    name: "Ana Silva",
    company: "Fashion Prime",
    text: "A plataforma revolucionou nossa gestão de leads. ROI aumentou 300%!",
    rating: 5
  },
  {
    name: "Carlos Santos",
    company: "Tech Store",
    text: "Interface intuitiva e funcionalidades poderosas. Recomendo para todos!",
    rating: 5
  },
  {
    name: "Marina Costa",
    company: "Digital Hub",
    text: "Suporte excepcional e resultados impressionantes desde o primeiro mês.",
    rating: 5
  }
];

const stats = [
  { value: "10K+", label: "Usuários Ativos" },
  { value: "500+", label: "Empresas" },
  { value: "2M+", label: "Leads Gerados" },
  { value: "98%", label: "Satisfação" }
];

export default function Welcome() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/30">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">Lovelify Dash</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/login")}
              className="text-muted-foreground hover:text-foreground"
            >
              Entrar
            </Button>
            <Button 
              onClick={() => navigate("/login")}
              className="bg-gradient-primary hover:opacity-90 transition-smooth"
            >
              Começar Agora
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-gradient-primary/20 text-primary border-primary/30">
            ✨ Plataforma #1 em Gestão de Leads
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Transforme seu negócio com
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {" "}automação inteligente
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Automatize campanhas, gerencie leads e maximize conversões com nossa plataforma 
            completa de marketing digital. Ideal para e-commerces e empresas de todos os tamanhos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              onClick={() => navigate("/login")}
              className="bg-gradient-primary hover:opacity-90 transition-smooth text-lg px-8 py-6"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Começar Gratuitamente
              <ArrowRight className={`w-5 h-5 ml-2 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6 border-border/30 hover:bg-accent/20"
            >
              Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gradient-glass/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tudo que você precisa para crescer
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nossa plataforma oferece ferramentas poderosas para automatizar, 
              analisar e otimizar suas campanhas de marketing.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gradient-glass border-border/30 shadow-glass backdrop-blur-sm hover:shadow-glow transition-spring group">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-spring`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-gradient-glass/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-lg text-muted-foreground">
              Milhares de empresas já transformaram seus resultados
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-glass border-border/30 shadow-glass backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <Card className="bg-gradient-primary/10 border-primary/30 max-w-4xl mx-auto">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Pronto para transformar seu negócio?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Junte-se a milhares de empresas que já estão crescendo com Lovelify Dash
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => navigate("/login")}
                  className="bg-gradient-primary hover:opacity-90 transition-smooth text-lg px-8 py-6"
                >
                  Começar Agora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8 py-6 border-primary/30 hover:bg-primary/10"
                >
                  Falar com Especialista
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-12 px-6">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">Lovelify Dash</span>
          </div>
          <p className="text-muted-foreground mb-4">
            Transformando negócios através da automação inteligente
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <span>© 2024 Lovelify Dash. Todos os direitos reservados.</span>
            <span>•</span>
            <span>Privacidade</span>
            <span>•</span>
            <span>Termos de Uso</span>
          </div>
        </div>
      </footer>
    </div>
  );
}


