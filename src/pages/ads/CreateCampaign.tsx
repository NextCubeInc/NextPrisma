import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Stepper, Step } from '@/components/ui/stepper';
import { 
  ArrowLeft, 
  Target, 
  Eye, 
  MousePointer, 
  Heart, 
  Users, 
  ShoppingCart, 
  TrendingUp,
  MessageCircle,
  Video,
  ThumbsUp,
  Smartphone,
  Calendar,
  MapPin,
  Settings,
  DollarSign,
  BarChart3,
  Play,
  TestTube,
  Zap,
  Globe,
  Shield,
  UserCheck,
  Layers,
  Info,
  AlertTriangle
} from 'lucide-react';

interface CampaignFormData {
  // Step 1: Objetivo
  name: string;
  objective: string;
  description: string;
  
  // Step 2: Orçamento e Cronograma
  budget: string;
  budgetType: 'daily' | 'lifetime';
  campaignBudgetOptimization: boolean; // CBO - true para Advantage+ Budget, false para adset_budgets
  startDate: string;
  endDate: string;
  bidStrategy: string;
  
  // Step 3: Público-alvo
  targetAudience: string;
  ageMin: string;
  ageMax: string;
  gender: string;
  locations: string[];
  interests: string[];
  
  // Step 4: Configurações Avançadas
  campaignStatus: 'active' | 'paused';
  specialAdCategories: string[];
  attribution: string;
  
  // Novas funcionalidades baseadas nas imagens e Meta Marketing API
  // Teste A/B
  abTestEnabled: boolean;
  abTestVariable: 'creative' | 'audience' | 'placement' | 'delivery_optimization';
  abTestBudgetSplit: number; // Porcentagem para cada variação (50/50 por padrão)
  
  // Advantage+ Audience
  advantageAudienceEnabled: boolean;
  advantageAudienceAgeRange: [number, number];
  
  // Posicionamentos
  placementType: 'automatic' | 'manual';
  selectedPlacements: {
    facebook: string[];
    instagram: string[];
    messenger: string[];
    audience_network: string[];
  };
  
  // Reconhecimento
  recognitionEnabled: boolean;
  recognitionAudience: 'broad' | 'custom' | 'lookalike';
  
  // Categorias de anúncio especial (conforme Meta Marketing API)
  specialAdCategory: 'NONE' | 'HOUSING' | 'EMPLOYMENT' | 'FINANCIAL_PRODUCTS_SERVICES' | 'ISSUES_ELECTIONS_POLITICS';
  specialAdCategoryCountry: string; // Obrigatório para ISSUES_ELECTIONS_POLITICS
}

// Objetivos oficiais da Facebook Marketing API v23.0
const campaignObjectives = [
  // Awareness
  {
    id: 'BRAND_AWARENESS',
    title: 'Reconhecimento da Marca',
    description: 'Aumentar o conhecimento da sua marca entre pessoas com maior probabilidade de se interessar por ela',
    icon: Eye,
    category: 'awareness',
    apiValue: 'BRAND_AWARENESS'
  },
  {
    id: 'REACH',
    title: 'Alcance',
    description: 'Mostrar seus anúncios para o máximo de pessoas possível',
    icon: Users,
    category: 'awareness',
    apiValue: 'REACH'
  },
  
  // Traffic & Engagement
  {
    id: 'LINK_CLICKS',
    title: 'Tráfego',
    description: 'Direcionar pessoas para destinos dentro ou fora do Meta',
    icon: Target,
    category: 'traffic',
    apiValue: 'LINK_CLICKS'
  },
  {
    id: 'POST_ENGAGEMENT',
    title: 'Engajamento',
    description: 'Obter mais curtidas, comentários, compartilhamentos e visualizações de vídeo',
    icon: Heart,
    category: 'engagement',
    apiValue: 'POST_ENGAGEMENT'
  },
  {
    id: 'PAGE_LIKES',
    title: 'Curtidas da Página',
    description: 'Direcionar pessoas para curtir sua Página',
    icon: Heart,
    category: 'engagement',
    apiValue: 'PAGE_LIKES'
  },
  {
    id: 'VIDEO_VIEWS',
    title: 'Visualizações de Vídeo',
    description: 'Promover vídeos para pessoas com maior probabilidade de assisti-los',
    icon: Play,
    category: 'engagement',
    apiValue: 'VIDEO_VIEWS'
  },
  
  // Lead Generation
  {
    id: 'LEAD_GENERATION',
    title: 'Geração de Leads',
    description: 'Coletar informações de pessoas interessadas na sua empresa',
    icon: Users,
    category: 'leads',
    apiValue: 'LEAD_GENERATION'
  },
  {
    id: 'MESSAGES',
    title: 'Mensagens',
    description: 'Incentivar pessoas a enviar mensagens para sua empresa',
    icon: MessageCircle,
    category: 'leads',
    apiValue: 'MESSAGES'
  },
  
  // Conversions & Sales
  {
    id: 'CONVERSIONS',
    title: 'Conversões',
    description: 'Incentivar ações valiosas no seu site, aplicativo ou no Messenger',
    icon: Target,
    category: 'conversions',
    apiValue: 'CONVERSIONS'
  },
  {
    id: 'PRODUCT_CATALOG_SALES',
    title: 'Vendas do Catálogo',
    description: 'Conectar seus anúncios ao catálogo de produtos para gerar vendas',
    icon: ShoppingCart,
    category: 'conversions',
    apiValue: 'PRODUCT_CATALOG_SALES'
  },
  {
    id: 'STORE_VISITS',
    title: 'Visitas à Loja',
    description: 'Promover locais da sua empresa para pessoas próximas',
    icon: Target,
    category: 'conversions',
    apiValue: 'STORE_VISITS'
  },
  
  // App Promotion
  {
    id: 'APP_INSTALLS',
    title: 'Instalações do App',
    description: 'Direcionar pessoas para instalar seu aplicativo',
    icon: Target,
    category: 'app_promotion',
    apiValue: 'APP_INSTALLS'
  },
  
  // Events
  {
    id: 'EVENT_RESPONSES',
    title: 'Respostas do Evento',
    description: 'Aumentar a participação no seu evento',
    icon: Users,
    category: 'events',
    apiValue: 'EVENT_RESPONSES'
  }
];

export default function CreateCampaign() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CampaignFormData>({
    // Step 1: Objetivo
    name: '',
    objective: '',
    description: '',
    
    // Step 2: Orçamento e Cronograma
    budget: '',
    budgetType: 'daily',
    campaignBudgetOptimization: true, // Padrão: Advantage+ Budget (gerenciado pela Meta)
    startDate: '',
    endDate: '',
    bidStrategy: 'LOWEST_COST_WITHOUT_CAP',
    
    // Step 3: Público-alvo
    targetAudience: '',
    ageMin: '18',
    ageMax: '65',
    gender: 'all',
    locations: [],
    interests: [],
    
    // Step 4: Configurações Avançadas
    campaignStatus: 'active',
    specialAdCategories: [],
    attribution: '7_day_click_1_day_view',
    
    // Novas funcionalidades baseadas nas imagens e Meta Marketing API
    // Teste A/B
    abTestEnabled: false,
    abTestVariable: 'creative',
    abTestBudgetSplit: 50,
    
    // Advantage+ Audience
    advantageAudienceEnabled: true, // Padrão habilitado conforme API v23.0
    advantageAudienceAgeRange: [18, 65],
    
    // Posicionamentos
    placementType: 'automatic',
    selectedPlacements: {
      facebook: [],
      instagram: [],
      messenger: [],
      audience_network: []
    },
    
    // Reconhecimento
    recognitionEnabled: false,
    recognitionAudience: 'broad',
    
    // Categorias de anúncio especial (conforme Meta Marketing API)
    specialAdCategory: 'NONE',
    specialAdCategoryCountry: '',
  });

  const handleInputChange = (field: keyof CampaignFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field: keyof CampaignFormData, value: string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFinalStepCompleted = () => {
    console.log('Campaign data:', formData);
    // Aqui você implementaria a lógica para salvar a campanha
    navigate(`/client/${clientId}/ads-manager/meta/campaigns`);
  };



  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Escolha o Objetivo da Campanha
        </CardTitle>
        <p className="text-muted-foreground">
          Selecione o que você deseja alcançar com esta campanha baseado na Facebook Marketing API <mcreference link="https://developers.facebook.com/docs/marketing-api/reference/ad-account/campaigns/" index="2">2</mcreference>
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          {/* Awareness */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-4 h-4 text-blue-500" />
              <h4 className="font-semibold text-blue-700">Reconhecimento</h4>
              <Badge variant="outline" className="text-xs">Awareness</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {campaignObjectives.filter(obj => obj.category === 'awareness').map((objective) => (
                <div
                  key={objective.id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                    formData.objective === objective.id 
                      ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                  }`}
                  onClick={() => handleInputChange('objective', objective.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${formData.objective === objective.id ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <objective.icon className={`w-5 h-5 ${formData.objective === objective.id ? 'text-blue-600' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900">{objective.title}</h5>
                      <p className="text-sm text-gray-600 mt-1">{objective.description}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">{objective.apiValue}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Traffic */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-green-500" />
              <h4 className="font-semibold text-green-700">Tráfego</h4>
              <Badge variant="outline" className="text-xs">Traffic</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {campaignObjectives.filter(obj => obj.category === 'traffic').map((objective) => (
                <div
                  key={objective.id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                    formData.objective === objective.id 
                      ? 'border-green-500 bg-green-50 shadow-lg ring-2 ring-green-200' 
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-25'
                  }`}
                  onClick={() => handleInputChange('objective', objective.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${formData.objective === objective.id ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <objective.icon className={`w-5 h-5 ${formData.objective === objective.id ? 'text-green-600' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900">{objective.title}</h5>
                      <p className="text-sm text-gray-600 mt-1">{objective.description}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">{objective.apiValue}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Engagement */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-pink-500" />
              <h4 className="font-semibold text-pink-700">Engajamento</h4>
              <Badge variant="outline" className="text-xs">Engagement</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {campaignObjectives.filter(obj => obj.category === 'engagement').map((objective) => (
                <div
                  key={objective.id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                    formData.objective === objective.id 
                      ? 'border-pink-500 bg-pink-50 shadow-lg ring-2 ring-pink-200' 
                      : 'border-gray-200 hover:border-pink-300 hover:bg-pink-25'
                  }`}
                  onClick={() => handleInputChange('objective', objective.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${formData.objective === objective.id ? 'bg-pink-100' : 'bg-gray-100'}`}>
                      <objective.icon className={`w-5 h-5 ${formData.objective === objective.id ? 'text-pink-600' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900">{objective.title}</h5>
                      <p className="text-sm text-gray-600 mt-1">{objective.description}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">{objective.apiValue}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Lead Generation */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-purple-500" />
              <h4 className="font-semibold text-purple-700">Geração de Leads</h4>
              <Badge variant="outline" className="text-xs">Lead Generation</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {campaignObjectives.filter(obj => obj.category === 'leads').map((objective) => (
                <div
                  key={objective.id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                    formData.objective === objective.id 
                      ? 'border-purple-500 bg-purple-50 shadow-lg ring-2 ring-purple-200' 
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                  }`}
                  onClick={() => handleInputChange('objective', objective.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${formData.objective === objective.id ? 'bg-purple-100' : 'bg-gray-100'}`}>
                      <objective.icon className={`w-5 h-5 ${formData.objective === objective.id ? 'text-purple-600' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900">{objective.title}</h5>
                      <p className="text-sm text-gray-600 mt-1">{objective.description}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">{objective.apiValue}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Conversions */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <h4 className="font-semibold text-orange-700">Conversões</h4>
              <Badge variant="outline" className="text-xs">Conversions</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {campaignObjectives.filter(obj => obj.category === 'conversions').map((objective) => (
                <div
                  key={objective.id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                    formData.objective === objective.id 
                      ? 'border-orange-500 bg-orange-50 shadow-lg ring-2 ring-orange-200' 
                      : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
                  }`}
                  onClick={() => handleInputChange('objective', objective.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${formData.objective === objective.id ? 'bg-orange-100' : 'bg-gray-100'}`}>
                      <objective.icon className={`w-5 h-5 ${formData.objective === objective.id ? 'text-orange-600' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900">{objective.title}</h5>
                      <p className="text-sm text-gray-600 mt-1">{objective.description}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">{objective.apiValue}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Informações Básicas
          </CardTitle>
          <CardDescription>
            Configure o nome e descrição da sua campanha
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="campaign-name">Nome da Campanha *</Label>
            <Input
              id="campaign-name"
              placeholder="Ex: Campanha de Verão 2024"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="campaign-description">Descrição (Opcional)</Label>
            <Textarea
              id="campaign-description"
              placeholder="Descreva o objetivo e estratégia desta campanha..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Orçamento e Lances */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Orçamento e Lances
          </CardTitle>
          <CardDescription>
            Defina como você quer gastar seu orçamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Tipo de Orçamento *</Label>
              <Select value={formData.budgetType} onValueChange={(value: 'daily' | 'lifetime') => handleInputChange('budgetType', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Orçamento Diário</SelectItem>
                  <SelectItem value="lifetime">Orçamento Total</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="budget">
                {formData.budgetType === 'daily' ? 'Orçamento Diário' : 'Orçamento Total'} (R$) *
              </Label>
              <Input
                id="budget"
                type="number"
                placeholder="0,00"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Campaign Budget Optimization */}
          <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <Label className="text-sm font-semibold text-blue-900">
                    Orçamento de campanha Advantage+
                  </Label>
                  <Switch
                    checked={formData.campaignBudgetOptimization}
                    onCheckedChange={(checked) => handleInputChange('campaignBudgetOptimization', checked)}
                  />
                </div>
                <p className="text-sm text-blue-700">
                  {formData.campaignBudgetOptimization 
                    ? "Distribua seu orçamento entre conjuntos de anúncios para gerar mais resultados. Você pode controlar os gastos para cada conjunto de anúncios."
                    : "Você controlará o orçamento individualmente para cada conjunto de anúncios (adset_budgets)."
                  }
                </p>
                {formData.campaignBudgetOptimization && (
                  <div className="mt-2">
                    <a 
                      href="#" 
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                      onClick={(e) => e.preventDefault()}
                    >
                      Sobre o orçamento de campanha Advantage+
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label>Estratégia de Lance</Label>
            <Select value={formData.bidStrategy} onValueChange={(value) => handleInputChange('bidStrategy', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOWEST_COST_WITHOUT_CAP">Menor custo</SelectItem>
                <SelectItem value="LOWEST_COST_WITH_BID_CAP">Menor custo com limite</SelectItem>
                <SelectItem value="TARGET_COST">Custo alvo</SelectItem>
                <SelectItem value="LOWEST_COST_WITH_MIN_ROAS">Menor custo com ROAS mínimo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cronograma */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Cronograma
          </CardTitle>
          <CardDescription>
            Defina quando sua campanha deve ser executada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date">Data de Início *</Label>
              <Input
                id="start-date"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="end-date">Data de Término (Opcional)</Label>
              <Input
                id="end-date"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>Status da Campanha</Label>
            <Select value={formData.campaignStatus} onValueChange={(value) => handleInputChange('campaignStatus', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="paused">Pausada</SelectItem>
                <SelectItem value="archived">Arquivada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Teste A/B */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Teste A/B
          </CardTitle>
          <CardDescription>
            Para testar a melhor abordagem de anúncios, compare versões e veja qual funciona melhor. Para isso, você pode comparar criativos e ver qual funciona melhor. Para isso, você pode comparar criativos e ver qual funciona melhor.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Ativar Teste A/B</Label>
              <p className="text-sm text-muted-foreground">
                Teste diferentes variações para otimizar performance
              </p>
            </div>
            <Switch
              checked={formData.abTestEnabled}
              onCheckedChange={(checked) => handleInputChange('abTestEnabled', checked)}
            />
          </div>

          {formData.abTestEnabled && (
            <div className="space-y-4 pt-4 border-t">
              <div>
                <Label>Variável do Teste</Label>
                <Select 
                  value={formData.abTestVariable} 
                  onValueChange={(value) => handleInputChange('abTestVariable', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="creative">Criativo</SelectItem>
                    <SelectItem value="audience">Público</SelectItem>
                    <SelectItem value="placement">Posicionamento</SelectItem>
                    <SelectItem value="delivery_optimization">Otimização de Entrega</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Divisão do Orçamento (%)</Label>
                <div className="mt-1 flex items-center space-x-2">
                  <Input
                    type="number"
                    min="10"
                    max="90"
                    value={formData.abTestBudgetSplit}
                    onChange={(e) => handleInputChange('abTestBudgetSplit', parseInt(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">
                    / {100 - formData.abTestBudgetSplit}% para cada variação
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Categorias de anúncio especial */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Categorias de anúncio especial
          </CardTitle>
          <CardDescription>
            Declare se seus anúncios se relacionam a crédito, emprego, habitação, questões sociais, eleições ou política para garantir conformidade.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Categoria</Label>
            <Select 
              value={formData.specialAdCategory} 
              onValueChange={(value) => handleInputChange('specialAdCategory', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">Nenhuma categoria especial</SelectItem>
                <SelectItem value="HOUSING">Habitação</SelectItem>
                <SelectItem value="EMPLOYMENT">Emprego</SelectItem>
                <SelectItem value="FINANCIAL_PRODUCTS_SERVICES">Produtos e serviços financeiros</SelectItem>
                <SelectItem value="ISSUES_ELECTIONS_POLITICS">Questões sociais, eleições ou política</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.specialAdCategory === 'ISSUES_ELECTIONS_POLITICS' && (
            <div>
              <Label>País para questões políticas *</Label>
              <Select 
                value={formData.specialAdCategoryCountry} 
                onValueChange={(value) => handleInputChange('specialAdCategoryCountry', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione o país" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BR">Brasil</SelectItem>
                  <SelectItem value="US">Estados Unidos</SelectItem>
                  <SelectItem value="CA">Canadá</SelectItem>
                  <SelectItem value="GB">Reino Unido</SelectItem>
                  <SelectItem value="AU">Austrália</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.specialAdCategory !== 'NONE' && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">Atenção</p>
                  <p className="text-yellow-700">
                    Anúncios nesta categoria estão sujeitos a políticas especiais e podem ter alcance limitado.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Público Advantage+ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Público Advantage+
          </CardTitle>
          <CardDescription>
            Deixe que a Meta encontre automaticamente as pessoas certas para seus anúncios usando machine learning avançado.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Usar Público Advantage+</Label>
              <p className="text-sm text-muted-foreground">
                Recomendado para maximizar resultados
              </p>
            </div>
            <Switch
              checked={formData.advantageAudienceEnabled}
              onCheckedChange={(checked) => handleInputChange('advantageAudienceEnabled', checked)}
            />
          </div>

          {formData.advantageAudienceEnabled && (
            <div className="space-y-4 pt-4 border-t">
              <div>
                <Label>Faixa etária (opcional)</Label>
                <div className="mt-2 flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm">De:</Label>
                    <Select 
                      value={formData.advantageAudienceAgeRange[0].toString()} 
                      onValueChange={(value) => {
                        const newRange = [...formData.advantageAudienceAgeRange];
                        newRange[0] = parseInt(value);
                        handleInputChange('advantageAudienceAgeRange', newRange);
                      }}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 48}, (_, i) => i + 18).map(age => (
                          <SelectItem key={age} value={age.toString()}>{age}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm">Até:</Label>
                    <Select 
                      value={formData.advantageAudienceAgeRange[1].toString()} 
                      onValueChange={(value) => {
                        const newRange = [...formData.advantageAudienceAgeRange];
                        newRange[1] = parseInt(value);
                        handleInputChange('advantageAudienceAgeRange', newRange);
                      }}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 48}, (_, i) => i + 18).map(age => (
                          <SelectItem key={age} value={age.toString()}>{age}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800">Advantage+ Audience</p>
                    <p className="text-blue-700">
                      A Meta usará machine learning para encontrar as pessoas mais propensas a realizar a ação desejada, expandindo além das suas especificações quando benéfico.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Posicionamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Posicionamentos
          </CardTitle>
          <CardDescription>
            Escolha onde seus anúncios aparecerão nas plataformas da Meta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Tipo de Posicionamento</Label>
            <Select 
              value={formData.placementType} 
              onValueChange={(value) => handleInputChange('placementType', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="automatic">Posicionamentos automáticos (Recomendado)</SelectItem>
                <SelectItem value="manual">Posicionamentos manuais</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.placementType === 'automatic' && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Zap className="w-4 h-4 text-green-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-green-800">Posicionamentos Automáticos</p>
                  <p className="text-green-700">
                    A Meta mostrará seus anúncios nos posicionamentos com melhor performance para seu objetivo, otimizando automaticamente para melhores resultados.
                  </p>
                </div>
              </div>
            </div>
          )}

          {formData.placementType === 'manual' && (
            <div className="space-y-4 pt-4 border-t">
              <div>
                <Label className="text-base font-medium">Facebook</Label>
                <div className="mt-2 space-y-2">
                  {[
                    { id: 'facebook_feeds', label: 'Feed' },
                    { id: 'facebook_right_hand_column', label: 'Coluna direita' },
                    { id: 'facebook_marketplace', label: 'Marketplace' },
                    { id: 'facebook_video_feeds', label: 'Feeds de vídeo' },
                    { id: 'facebook_stories', label: 'Stories' },
                    { id: 'facebook_in_stream', label: 'Vídeos in-stream' },
                    { id: 'facebook_search', label: 'Resultados de pesquisa' },
                    { id: 'facebook_reels', label: 'Reels' }
                  ].map((placement) => (
                    <div key={placement.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={placement.id}
                        checked={formData.selectedPlacements.facebook.includes(placement.id)}
                        onChange={(e) => {
                          const currentPlacements = [...formData.selectedPlacements.facebook];
                          if (e.target.checked) {
                            currentPlacements.push(placement.id);
                          } else {
                            const index = currentPlacements.indexOf(placement.id);
                            if (index > -1) currentPlacements.splice(index, 1);
                          }
                          handleInputChange('selectedPlacements', {
                            ...formData.selectedPlacements,
                            facebook: currentPlacements
                          });
                        }}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={placement.id} className="text-sm">{placement.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Instagram</Label>
                <div className="mt-2 space-y-2">
                  {[
                    { id: 'instagram_stream', label: 'Feed' },
                    { id: 'instagram_stories', label: 'Stories' },
                    { id: 'instagram_reels', label: 'Reels' },
                    { id: 'instagram_explore', label: 'Explorar' }
                  ].map((placement) => (
                    <div key={placement.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={placement.id}
                        checked={formData.selectedPlacements.instagram.includes(placement.id)}
                        onChange={(e) => {
                          const currentPlacements = [...formData.selectedPlacements.instagram];
                          if (e.target.checked) {
                            currentPlacements.push(placement.id);
                          } else {
                            const index = currentPlacements.indexOf(placement.id);
                            if (index > -1) currentPlacements.splice(index, 1);
                          }
                          handleInputChange('selectedPlacements', {
                            ...formData.selectedPlacements,
                            instagram: currentPlacements
                          });
                        }}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={placement.id} className="text-sm">{placement.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Messenger</Label>
                <div className="mt-2 space-y-2">
                  {[
                    { id: 'messenger_inbox', label: 'Caixa de entrada' },
                    { id: 'messenger_stories', label: 'Stories' }
                  ].map((placement) => (
                    <div key={placement.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={placement.id}
                        checked={formData.selectedPlacements.messenger.includes(placement.id)}
                        onChange={(e) => {
                          const currentPlacements = [...formData.selectedPlacements.messenger];
                          if (e.target.checked) {
                            currentPlacements.push(placement.id);
                          } else {
                            const index = currentPlacements.indexOf(placement.id);
                            if (index > -1) currentPlacements.splice(index, 1);
                          }
                          handleInputChange('selectedPlacements', {
                            ...formData.selectedPlacements,
                            messenger: currentPlacements
                          });
                        }}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={placement.id} className="text-sm">{placement.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Audience Network</Label>
                <div className="mt-2 space-y-2">
                  {[
                    { id: 'audience_network_native', label: 'Nativo, banner e intersticial' },
                    { id: 'audience_network_rewarded_video', label: 'Vídeo recompensado' }
                  ].map((placement) => (
                    <div key={placement.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={placement.id}
                        checked={formData.selectedPlacements.audience_network.includes(placement.id)}
                        onChange={(e) => {
                          const currentPlacements = [...formData.selectedPlacements.audience_network];
                          if (e.target.checked) {
                            currentPlacements.push(placement.id);
                          } else {
                            const index = currentPlacements.indexOf(placement.id);
                            if (index > -1) currentPlacements.splice(index, 1);
                          }
                          handleInputChange('selectedPlacements', {
                            ...formData.selectedPlacements,
                            audience_network: currentPlacements
                          });
                        }}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={placement.id} className="text-sm">{placement.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reconhecimento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Reconhecimento
          </CardTitle>
          <CardDescription>
            Configure como o público será identificado e segmentado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Ativar Reconhecimento Avançado</Label>
              <p className="text-sm text-muted-foreground">
                Use dados avançados para melhor segmentação
              </p>
            </div>
            <Switch
              checked={formData.recognitionEnabled}
              onCheckedChange={(checked) => handleInputChange('recognitionEnabled', checked)}
            />
          </div>

          {formData.recognitionEnabled && (
            <div className="space-y-4 pt-4 border-t">
              <div>
                <Label>Tipo de Público para Reconhecimento</Label>
                <Select 
                  value={formData.recognitionAudience} 
                  onValueChange={(value) => handleInputChange('recognitionAudience', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="broad">Público amplo</SelectItem>
                    <SelectItem value="custom">Público personalizado</SelectItem>
                    <SelectItem value="lookalike">Público semelhante</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Layers className="w-4 h-4 text-purple-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-purple-800">Reconhecimento Avançado</p>
                    <p className="text-purple-700">
                      Esta funcionalidade usa dados comportamentais e demográficos avançados para identificar e segmentar seu público de forma mais precisa.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderStep3 = () => {
    const selectedObjective = campaignObjectives.find(obj => obj.id === formData.objective);
    
    return (
      <div className="space-y-6">
        {/* Resumo da Campanha */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Resumo da Campanha
            </CardTitle>
            <CardDescription>
              Revise todas as configurações antes de criar sua campanha
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Objetivo */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <Label className="text-sm font-medium text-muted-foreground">OBJETIVO</Label>
              <div className="flex items-center space-x-3 mt-2">
                {selectedObjective && <selectedObjective.icon className="w-5 h-5 text-primary" />}
                <div>
                  <p className="font-semibold">{selectedObjective?.title}</p>
                  <p className="text-sm text-muted-foreground">{selectedObjective?.description}</p>
                </div>
                <Badge variant="secondary">{selectedObjective?.apiValue}</Badge>
              </div>
            </div>

            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">NOME DA CAMPANHA</Label>
                <p className="mt-1 font-medium">{formData.name || 'Não definido'}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">STATUS</Label>
                <div className="mt-1">
                  <Badge variant={formData.campaignStatus === 'active' ? 'default' : 'secondary'}>
                    {formData.campaignStatus === 'active' ? 'Ativa' : 
                     formData.campaignStatus === 'paused' ? 'Pausada' : 'Arquivada'}
                  </Badge>
                </div>
              </div>
            </div>

            {formData.description && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">DESCRIÇÃO</Label>
                <p className="mt-1 text-muted-foreground">{formData.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orçamento e Cronograma */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Orçamento e Cronograma
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">ORÇAMENTO</Label>
                  <p className="mt-1 text-2xl font-bold text-primary">
                    R$ {formData.budget || '0,00'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formData.budgetType === 'daily' ? 'Por dia' : 'Total da campanha'}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">ESTRATÉGIA DE LANCE</Label>
                  <p className="mt-1 font-medium">
                    {formData.bidStrategy === 'LOWEST_COST_WITHOUT_CAP' ? 'Menor custo' :
                     formData.bidStrategy === 'LOWEST_COST_WITH_BID_CAP' ? 'Menor custo com limite' :
                     formData.bidStrategy === 'TARGET_COST' ? 'Custo alvo' :
                     'Menor custo com ROAS mínimo'}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">OTIMIZAÇÃO DE ORÇAMENTO</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <p className="font-medium">
                      {formData.campaignBudgetOptimization 
                        ? 'Advantage+ Budget (Gerenciado pela Meta)' 
                        : 'Manual (adset_budgets)'}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.campaignBudgetOptimization 
                      ? 'A Meta distribuirá automaticamente o orçamento entre conjuntos de anúncios'
                      : 'Você controlará o orçamento individualmente para cada conjunto de anúncios'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">PERÍODO</Label>
                  <div className="mt-1 space-y-1">
                    <p className="font-medium">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Início: {formData.startDate ? new Date(formData.startDate).toLocaleDateString('pt-BR') : 'Não definido'}
                    </p>
                    {formData.endDate && (
                      <p className="font-medium">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Fim: {new Date(formData.endDate).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                    {!formData.endDate && (
                      <p className="text-sm text-muted-foreground">Sem data de término definida</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aviso */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 text-blue-500 mt-0.5">
              ℹ️
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">
                Próximos passos após criar a campanha
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Após criar a campanha, você precisará criar conjuntos de anúncios e anúncios individuais para começar a veicular.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };



  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/client/${clientId}/ads-manager/meta/campaigns`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Criar Nova Campanha</h1>
              <p className="text-muted-foreground">Meta Ads Manager</p>
            </div>
          </div>
        </div>

        {/* Stepper */}
         <Stepper
           onFinalStepCompleted={handleFinalStepCompleted}
           backButtonText="Voltar"
           nextButtonText="Continuar"
           completeButtonText="Criar Campanha"
         >
           <Step title="Objetivo" description="Escolha o objetivo da campanha">
             {renderStep1()}
           </Step>
           <Step title="Configurações" description="Defina nome, orçamento e cronograma">
             {renderStep2()}
           </Step>
           <Step title="Revisar" description="Revise e crie a campanha">
             {renderStep3()}
           </Step>
         </Stepper>
      </div>
    </div>
  );
}