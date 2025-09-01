import { Plug, CheckCircle, XCircle, Settings, Plus, AlertTriangle, ExternalLink, Heading } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

import { SiGoogleads, SiBaidu, SiMeta, SiTiktok, 
  SiLinkedin, SiX, SiPinterest, SiSnapchat, SiReddit, 
  SiQuora, SiAmazon, SiSpotify, SiMercadopago, SiShopee,
  SiEtsy, SiRakuten, SiAlibabadotcom, SiEbay, SiUnity,
  SiRocket, SiApple, SiAdroll, SiBuysellads
} from "react-icons/si";
import { GiBoatPropeller } from "react-icons/gi";
import { DiBingSmall, DiYahooSmall } from "react-icons/di";
import { TbBrandWalmart, TbVectorTriangle, TbChartAreaFilled, TbBrandDeezer } from "react-icons/tb";

const integrations = [
  {
    id: 1,
    name: "Google Ads",
    category: "Publicidade",
    description: "Gerencie campanhas de pesquisa, display, YouTube e apps.",
    status: "Soon",
    icon: SiGoogleads,
    setupDate: null,
    lastSync: null,
    features: ["Campanhas de pesquisa", "Rede de display", "YouTube Ads", "Apps"],
    config: null
  },
  {
    id: 2,
    name: "Bing Ads / Microsoft Advertising",
    category: "Publicidade",
    description: "Gerencie anúncios no Bing, Yahoo e AOL.",
    status: "disconnected",
    icon: DiBingSmall,
    setupDate: null,
    lastSync: null,
    features: ["Campanhas de pesquisa", "Rede display", "Yahoo e AOL"],
    config: null
  },
  {
    id: 3,
    name: "Yahoo Gemini",
    category: "Publicidade",
    description: "Plataforma híbrida de anúncios search + native ads.",
    status: "disconnected",
    icon: DiYahooSmall,
    setupDate: null,
    lastSync: null,
    features: ["Search ads", "Native ads", "Campanhas híbridas"],
    config: null
  },
  {
    id: 4,
    name: "Yandex Ads@",
    category: "Publicidade",
    description: "Rede de anúncios forte na Rússia e leste europeu.",
    status: "disconnected",
    icon: "@",
    setupDate: null,
    lastSync: null,
    features: ["Search ads", "Display", "Segmentação local"],
    config: null
  },
  {
    id: 5,
    name: "Baidu Ads@",
    category: "Publicidade",
    description: "Principal plataforma de anúncios no mercado chinês.",
    status: "disconnected",
    icon: SiBaidu,
    setupDate: null,
    lastSync: null,
    features: ["Search ads", "Display", "China market reach"],
    config: null
  },
  {
    id: 6,
    name: "Meta Ads",
    category: "Publicidade",
    description: "Anúncios em Facebook, Instagram, Messenger e Audience Network.",
    status: "disconnected",
    icon: SiMeta,
    setupDate: null,
    lastSync: null,
    features: ["Leads", "Campanhas sociais", "Segmentação avançada"],
    config: null
  },
  {
    id: 7,
    name: "TikTok Ads",
    category: "Publicidade",
    description: "Crie campanhas no TikTok com alcance global.",
    status: "disconnected",
    icon: SiTiktok,
    setupDate: null,
    lastSync: null,
    features: ["Vídeo curto", "Alcance jovem", "Trends"],
    config: null
  },
  {
    id: 8,
    name: "LinkedIn Ads",
    category: "Publicidade",
    description: "Anúncios voltados para público B2B.",
    status: "disconnected",
    icon: SiLinkedin,
    setupDate: null,
    lastSync: null,
    features: ["Segmentação profissional", "Leads B2B", "Conteúdo patrocinado"],
    config: null
  },
  {
    id: 9,
    name: "X Ads",
    category: "Publicidade",
    description: "Campanhas na plataforma X (antigo Twitter).",
    status: "disconnected",
    icon: SiX,
    setupDate: null,
    lastSync: null,
    features: ["Trends", "Campanhas segmentadas", "Tweets promovidos"],
    config: null
  },
  {
    id: 10,
    name: "Pinterest Ads",
    category: "Publicidade",
    description: "Anúncios visuais para descoberta e inspiração.",
    status: "disconnected",
    icon: SiPinterest,
    setupDate: null,
    lastSync: null,
    features: ["Pins patrocinados", "E-commerce", "Brand awareness"],
    config: null
  },
  {
    id: 11,
    name: "Snapchat Ads",
    category: "Publicidade",
    description: "Campanhas interativas no Snapchat.",
    status: "disconnected",
    icon: SiSnapchat,
    setupDate: null,
    lastSync: null,
    features: ["AR lenses", "Stories Ads", "Segmentação jovem"],
    config: null
  },
  {
    id: 12,
    name: "Reddit Ads",
    category: "Publicidade",
    description: "Alcance comunidades segmentadas no Reddit.",
    status: "disconnected",
    icon: SiReddit,
    setupDate: null,
    lastSync: null,
    features: ["Comunidades", "Segmentação por interesse", "Engajamento"],
    config: null
  },
  {
    id: 13,
    name: "Quora Ads",
    category: "Publicidade",
    description: "Anúncios em plataforma de perguntas e respostas.",
    status: "disconnected",
    icon: SiQuora,
    setupDate: null,
    lastSync: null,
    features: ["Contextual targeting", "Leads", "Display ads"],
    config: null
  },
  {
    id: 14,
    name: "Amazon Ads",
    category: "Publicidade",
    description: "Campanhas em transmissões ao vivo no Twitch.",
    status: "disconnected",
    icon: SiAmazon,
    setupDate: null,
    lastSync: null,
    features: ["Live streaming", "Gamers", "Vídeo ads"],
    config: null
  },
  {
    id: 15,
    name: "Spotify Ads",
    category: "Publicidade",
    description: "Anúncios em áudio e banners no Spotify.",
    status: "disconnected",
    icon: SiSpotify,
    setupDate: null,
    lastSync: null,
    features: ["Áudio ads", "Display banners", "Segmentação musical"],
    config: null
  },
  {
    id: 16,
    name: "Deezer Ads",
    category: "Publicidade",
    description: "Publicidade em áudio e display no Deezer.",
    status: "disconnected",
    icon: TbBrandDeezer,
    setupDate: null,
    lastSync: null,
    features: ["Áudio ads", "Música segmentada", "Campanhas digitais"],
    config: null
  },
  {
    id: 17,
    name: "Hulu Ads",
    category: "Publicidade",
    description: "Publicidade em vídeo no Hulu (via Disney Advertising, EUA).",
    status: "disconnected",
    icon: Heading,
    setupDate: null,
    lastSync: null,
    features: ["Streaming ads", "Campanhas em vídeo", "EUA"],
    config: null
  },
  {
    id: 18,
    name: "Mercado Livre Ads (Meli Ads)",
    category: "Publicidade",
    description: "Anúncios no Mercado Livre e Mercado Shops.",
    status: "disconnected",
    icon: SiMercadopago,
    setupDate: null,
    lastSync: null,
    features: ["Sponsored products", "Marketplace ads", "E-commerce"],
    config: null
  },
  {
    id: 19,
    name: "Shopee Ads",
    category: "Publicidade",
    description: "Publicidade e destaque de produtos na Shopee.",
    status: "disconnected",
    icon: SiShopee,
    setupDate: null,
    lastSync: null,
    features: ["E-commerce ads", "Sponsored listings", "Marketplace"],
    config: null
  },
  {
    id: 20,
    name: "Etsy Ads",
    category: "Publicidade",
    description: "Publicidade para vendedores na Etsy.",
    status: "disconnected",
    icon: SiEtsy,
    setupDate: null,
    lastSync: null,
    features: ["Sponsored products", "Marketplace", "Crafts"],
    config: null
  },
  {
    id: 21,
    name: "Walmart Connect",
    category: "Publicidade",
    description: "Plataforma de anúncios da Walmart nos EUA.",
    status: "disconnected",
    icon: TbBrandWalmart,
    setupDate: null,
    lastSync: null,
    features: ["Retail media", "Marketplace ads", "E-commerce"],
    config: null
  },
  {
    id: 22,
    name: "Rakuten Ads",
    category: "Publicidade",
    description: "Rede de anúncios da Rakuten, com foco em e-commerce.",
    status: "disconnected",
    icon: SiRakuten,
    setupDate: null,
    lastSync: null,
    features: ["Affiliate ads", "E-commerce", "Japão"],
    config: null
  },
  {
    id: 23,
    name: "Alibaba / Aliexpress Ads",
    category: "Publicidade",
    description: "Publicidade dentro das plataformas Alibaba e Aliexpress.",
    status: "disconnected",
    icon: SiAlibabadotcom,
    setupDate: null,
    lastSync: null,
    features: ["E-commerce", "China market", "Sponsored products"],
    config: null
  },
  {
    id: 24,
    name: "eBay Ads",
    category: "Publicidade",
    description: "Publicidade nativa no marketplace eBay.",
    status: "disconnected",
    icon: SiEbay,
    setupDate: null,
    lastSync: null,
    features: ["Sponsored products", "Marketplace", "E-commerce"],
    config: null
  },
  {
    id: 25,
    name: "Unity Ads",
    category: "Publicidade",
    description: "Publicidade em jogos mobile via Unity.",
    status: "disconnected",
    icon: SiUnity,
    setupDate: null,
    lastSync: null,
    features: ["In-game ads", "Vídeo ads", "Mobile games"],
    config: null
  },
  {
    id: 26,
    name: "AppLovin",
    category: "Publicidade",
    description: "Rede de anúncios focada em apps e jogos mobile.",
    status: "disconnected",
    icon: TbVectorTriangle,
    setupDate: null,
    lastSync: null,
    features: ["Mobile games", "App monetization", "Performance ads"],
    config: null
  },
  {
    id: 27,
    name: "ironSource",
    category: "Publicidade",
    description: "Rede de anúncios mobile e jogos.",
    status: "disconnected",
    icon: "⚒️",
    setupDate: null,
    lastSync: null,
    features: ["Mobile ads", "Games monetization", "User acquisition"],
    config: null
  },
  {
    id: 28,
    name: "Chartboost",
    category: "Publicidade",
    description: "Plataforma de monetização e user acquisition para games.",
    status: "disconnected",
    icon: TbChartAreaFilled,
    setupDate: null,
    lastSync: null,
    features: ["Game ads", "In-app campaigns", "User acquisition"],
    config: null
  },
  {
    id: 29,
    name: "AdColony",
    category: "Publicidade",
    description: "Plataforma de anúncios em vídeo para mobile.",
    status: "disconnected",
    icon: SiRocket,
    setupDate: null,
    lastSync: null,
    features: ["Vídeo ads", "Mobile reach", "Games"],
    config: null
  },
  {
    id: 30,
    name: "Apple Search Ads",
    category: "Publicidade",
    description: "Publicidade para apps no ecossistema iOS.",
    status: "disconnected",
    icon: SiApple,
    setupDate: null,
    lastSync: null,
    features: ["App Store ads", "iOS apps", "User acquisition"],
    config: null
  },
  {
    id: 31,
    name: "Taboola",
    category: "Publicidade",
    description: "Plataforma global de native ads.",
    status: "disconnected",
    icon: "oo",
    setupDate: null,
    lastSync: null,
    features: ["Native ads", "Content discovery", "Retargeting"],
    config: null
  },
  {
    id: 32,
    name: "Outbrain",
    category: "Publicidade",
    description: "Rede global de native ads.",
    status: "disconnected",
    icon: ":)",
    setupDate: null,
    lastSync: null,
    features: ["Native ads", "Content amplification", "Retargeting"],
    config: null
  },
  {
    id: 33,
    name: "MGID",
    category: "Publicidade",
    description: "Plataforma de native ads e content discovery.",
    status: "disconnected",
    icon: "M",
    setupDate: null,
    lastSync: null,
    features: ["Native ads", "Discovery", "Segmentação"],
    config: null
  },
  {
    id: 34,
    name: "AdRoll",
    category: "Publicidade",
    description: "Plataforma de remarketing e retargeting multicanal.",
    status: "disconnected",
    icon: SiAdroll,
    setupDate: null,
    lastSync: null,
    features: ["Remarketing", "Cross-channel ads", "Automation"],
    config: null
  },
  {
    id: 35,
    name: "Criteo",
    category: "Publicidade",
    description: "Especialista em retargeting para e-commerce.",
    status: "disconnected",
    icon: "CR",
    setupDate: null,
    lastSync: null,
    features: ["Dynamic retargeting", "E-commerce", "Conversion tracking"],
    config: null
  },
  {
    id: 36,
    name: "PropellerAds",
    category: "Publicidade",
    description: "Tráfego alternativo (pop-under, push, etc).",
    status: "disconnected",
    icon: GiBoatPropeller,
    setupDate: null,
    lastSync: null,
    features: ["Push notifications", "Pop-under", "Alternative traffic"],
    config: null
  },
  {
    id: 37,
    name: "RevContent",
    category: "Publicidade",
    description: "Plataforma de native ads focada em publishers.",
    status: "disconnected",
    icon: "Rev",
    setupDate: null,
    lastSync: null,
    features: ["Native ads", "Content discovery", "Performance"],
    config: null
  },
  {
    id: 38,
    name: "BuySellAds",
    category: "Publicidade",
    description: "Rede para compra direta de mídia display.",
    status: "disconnected",
    icon: SiBuysellads,
    setupDate: null,
    lastSync: null,
    features: ["Direct media buying", "Display ads", "Publisher network"],
    config: null
  }
];


const statusConfig = {
  connected: {
    color: "bg-green-500/10 text-green-400 border-green-500/20",
    icon: CheckCircle,
    label: "Conectado"
  },
  disconnected: {
    color: "bg-gray-500/10 text-gray-400 border-gray-500/20", 
    icon: XCircle,
    label: "Desconectado"
  },
  error: {
    color: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: AlertTriangle,
    label: "Erro"
  },
  Soon: {
    color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    icon: AlertTriangle,
    label: "Soon"
  }
};

const categories = ["Todos", "Mensagens", "Publicidade", "Pagamentos", "Automação", "Email Marketing", "CRM", "Marketing"];

export default function Integrations() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Integrações</h1>
        <p className="text-muted-foreground">
          Conecte o PrismaID com suas ferramentas favoritas e automatize seus processos
        </p>
      </div>

      {/* Integration Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Integrações Ativas</p>
                <p className="text-2xl font-bold text-foreground">4</p>
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
                <p className="text-sm font-medium text-muted-foreground">Disponíveis</p>
                <p className="text-2xl font-bold text-foreground">8</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Plug className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Com Erro</p>
                <p className="text-2xl font-bold text-foreground">1</p>
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
                <p className="text-sm font-medium text-muted-foreground">Última Sync</p>
                <p className="text-2xl font-bold text-foreground">2min</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filters */}
      <Card className="bg-gradient-card border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                className="border-border hover:bg-accent/50"
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integrations Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => {
          const statusInfo = statusConfig[integration.status];
          const StatusIcon = statusInfo.icon;

          return (
            <Card key={integration.id} className="bg-gradient-card border-border/50 shadow-card hover:border-primary/20 transition-colors">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center text-2xl">
                      {typeof integration.icon === 'string' ? integration.icon : <integration.icon />}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-foreground">{integration.name}</CardTitle>
                      <Badge variant="outline" className="text-xs border-border/50 text-muted-foreground mt-1">
                        {integration.category}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant="outline" className={statusInfo.color}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <CardDescription className="text-muted-foreground">
                  {integration.description}
                </CardDescription>

                {integration.status === 'connected' && (
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      <div>Conectado em: {new Date(integration.setupDate).toLocaleDateString('pt-BR')}</div>
                      <div>Última sync: {integration.lastSync}</div>
                    </div>
                    
                    {integration.config && (
                      <div className="bg-accent/10 rounded-lg p-3 space-y-1">
                        <h5 className="text-xs font-medium text-foreground">Configuração:</h5>
                        {Object.entries(integration.config).map(([key, value]) => (
                          <div key={key} className="text-xs text-muted-foreground flex justify-between">
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                            {/*<span>{value}</span>*/}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <h5 className="text-xs font-medium text-foreground">Recursos:</h5>
                  <div className="space-y-1">
                    {integration.features.map((feature, index) => (
                      <div key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {integration.status === 'connected' ? (
                    <>
                      <Button variant="outline" size="sm" className="flex-1 border-border hover:bg-accent/50">
                        <Settings className="w-4 h-4 mr-2" />
                        Configurar
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-500/20 text-red-400 hover:bg-red-500/10">
                        Desconectar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="flex-1 bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-glow">
                        <Plus className="w-4 h-4 mr-2" />
                        Conectar
                      </Button>
                      <Button variant="outline" size="sm" className="border-border hover:bg-accent/50">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>

                {integration.status === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <div className="text-xs text-red-400">
                      <AlertTriangle className="w-3 h-3 inline mr-1" />
                      {integration.config?.status || 'Erro na conexão'}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}