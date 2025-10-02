import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Stepper, Step } from '@/components/ui/stepper';
import { 
  ArrowLeft, 
  Target, 
  Users, 
  DollarSign, 
  Calendar as CalendarIcon,
  MapPin,
  Heart,
  Briefcase,
  GraduationCap,
  Home,
  Car,
  Gamepad2,
  Music,
  Plane,
  ShoppingBag,
  Smartphone,
  Utensils,
  Dumbbell,
  Baby,
  PawPrint,
  Palette,
  Book,
  Camera,
  Coffee,
  Gift,
  Headphones,
  Laptop,
  Shirt,
  Watch,
  Zap
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// Interfaces
interface AdSetFormData {
  // Step 1: Configurações Básicas
  name: string;
  campaignId: string;
  optimizationGoal: string;
  billingEvent: string;
  
  // Step 2: Público-alvo
  ageMin: number;
  ageMax: number;
  gender: string;
  locations: string[];
  interests: string[];
  behaviors: string[];
  customAudiences: string[];
  lookalikeSources: string[];
  
  // Step 3: Posicionamentos
  placements: string[];
  deviceTypes: string[];
  platforms: string[];
  
  // Step 4: Orçamento e Cronograma
  budgetType: 'DAILY' | 'LIFETIME';
  budget: number;
  bidStrategy: string;
  bidAmount?: number;
  startDate: Date | undefined;
  endDate: Date | undefined;
  
  // Step 5: Configurações Avançadas
  adsetStatus: string;
  attribution: string;
  conversionWindow: string;
}

// Dados de exemplo para interesses
const interestCategories = [
  {
    category: 'Estilo de Vida',
    icon: Heart,
    interests: [
      { id: 'fitness', name: 'Fitness e Exercícios', icon: Dumbbell },
      { id: 'travel', name: 'Viagens', icon: Plane },
      { id: 'food', name: 'Culinária', icon: Utensils },
      { id: 'fashion', name: 'Moda', icon: Shirt },
      { id: 'beauty', name: 'Beleza', icon: Palette },
    ]
  },
  {
    category: 'Tecnologia',
    icon: Smartphone,
    interests: [
      { id: 'smartphones', name: 'Smartphones', icon: Smartphone },
      { id: 'laptops', name: 'Laptops', icon: Laptop },
      { id: 'gaming', name: 'Games', icon: Gamepad2 },
      { id: 'gadgets', name: 'Gadgets', icon: Zap },
      { id: 'photography', name: 'Fotografia', icon: Camera },
    ]
  },
  {
    category: 'Entretenimento',
    icon: Music,
    interests: [
      { id: 'music', name: 'Música', icon: Music },
      { id: 'movies', name: 'Filmes', icon: Camera },
      { id: 'books', name: 'Livros', icon: Book },
      { id: 'podcasts', name: 'Podcasts', icon: Headphones },
      { id: 'coffee', name: 'Café', icon: Coffee },
    ]
  },
  {
    category: 'Negócios',
    icon: Briefcase,
    interests: [
      { id: 'entrepreneurship', name: 'Empreendedorismo', icon: Briefcase },
      { id: 'marketing', name: 'Marketing', icon: Target },
      { id: 'finance', name: 'Finanças', icon: DollarSign },
      { id: 'education', name: 'Educação', icon: GraduationCap },
      { id: 'real-estate', name: 'Imóveis', icon: Home },
    ]
  }
];

const optimizationGoals = [
  { value: 'LINK_CLICKS', label: 'Cliques no Link', description: 'Otimizar para cliques no seu site' },
  { value: 'IMPRESSIONS', label: 'Impressões', description: 'Maximizar o alcance' },
  { value: 'REACH', label: 'Alcance', description: 'Alcançar o máximo de pessoas únicas' },
  { value: 'CONVERSIONS', label: 'Conversões', description: 'Otimizar para ações no seu site' },
  { value: 'LEAD_GENERATION', label: 'Geração de Leads', description: 'Coletar informações de contato' },
  { value: 'POST_ENGAGEMENT', label: 'Engajamento', description: 'Curtidas, comentários e compartilhamentos' },
];

const bidStrategies = [
  { value: 'LOWEST_COST_WITHOUT_CAP', label: 'Custo Mais Baixo', description: 'Automático (recomendado)' },
  { value: 'LOWEST_COST_WITH_BID_CAP', label: 'Limite de Lance', description: 'Definir lance máximo' },
  { value: 'TARGET_COST', label: 'Custo Alvo', description: 'Manter custo médio' },
];

export default function CreateAdSet() {
  const navigate = useNavigate();
  const { clientId, campaignId } = useParams();
  
  const [formData, setFormData] = useState<AdSetFormData>({
    // Step 1: Configurações Básicas
    name: '',
    campaignId: campaignId || '',
    optimizationGoal: 'LINK_CLICKS',
    billingEvent: 'IMPRESSIONS',
    
    // Step 2: Público-alvo
    ageMin: 18,
    ageMax: 65,
    gender: 'ALL',
    locations: ['BR'],
    interests: [],
    behaviors: [],
    customAudiences: [],
    lookalikeSources: [],
    
    // Step 3: Posicionamentos
    placements: ['AUTOMATIC'],
    deviceTypes: ['ALL'],
    platforms: ['FACEBOOK', 'INSTAGRAM'],
    
    // Step 4: Orçamento e Cronograma
    budgetType: 'DAILY',
    budget: 50,
    bidStrategy: 'LOWEST_COST_WITHOUT_CAP',
    startDate: new Date(),
    endDate: undefined,
    
    // Step 5: Configurações Avançadas
    adsetStatus: 'PAUSED',
    attribution: '7_DAY_CLICK_1_DAY_VIEW',
    conversionWindow: '7_DAY_CLICK_1_DAY_VIEW',
  });

  const handleInputChange = (field: keyof AdSetFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInputChange = (field: keyof AdSetFormData, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter(item => item !== value)
    }));
  };

  const handleFinalStepCompleted = async () => {
    try {
      console.log('Criando conjunto de anúncios:', formData);
      // Aqui seria feita a chamada para a API
      navigate(`/client/${clientId}/ads-manager/meta/adsets`);
    } catch (error) {
      console.error('Erro ao criar conjunto de anúncios:', error);
    }
  };

  // Step 1: Configurações Básicas
  const renderStep1 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Configurações Básicas
          </CardTitle>
          <CardDescription>
            Defina as configurações fundamentais do seu conjunto de anúncios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="adset-name">Nome do Conjunto de Anúncios</Label>
            <Input
              id="adset-name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ex: Público Interesse - Moda Feminina"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Objetivo de Otimização</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {optimizationGoals.map((goal) => (
                <Card 
                  key={goal.value}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-md",
                    formData.optimizationGoal === goal.value 
                      ? "ring-2 ring-blue-500 bg-blue-50" 
                      : "hover:bg-gray-50"
                  )}
                  onClick={() => handleInputChange('optimizationGoal', goal.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{goal.label}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                      </div>
                      {formData.optimizationGoal === goal.value && (
                        <Badge variant="default" className="ml-2">Selecionado</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Step 2: Público-alvo
  const renderStep2 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Definição de Público-alvo
          </CardTitle>
          <CardDescription>
            Configure quem verá seus anúncios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Demografia */}
          <div>
            <h4 className="font-medium mb-3">Demografia</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Idade Mínima</Label>
                <div className="mt-2">
                  <Slider
                    value={[formData.ageMin]}
                    onValueChange={(value) => handleInputChange('ageMin', value[0])}
                    max={65}
                    min={13}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>13</span>
                    <span className="font-medium">{formData.ageMin} anos</span>
                    <span>65</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Idade Máxima</Label>
                <div className="mt-2">
                  <Slider
                    value={[formData.ageMax]}
                    onValueChange={(value) => handleInputChange('ageMax', value[0])}
                    max={65}
                    min={formData.ageMin}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>{formData.ageMin}</span>
                    <span className="font-medium">{formData.ageMax} anos</span>
                    <span>65+</span>
                  </div>
                </div>
              </div>

              <div>
                <Label>Gênero</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos</SelectItem>
                    <SelectItem value="MALE">Masculino</SelectItem>
                    <SelectItem value="FEMALE">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Localização */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Localização
            </h4>
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Brasil</p>
                  <p className="text-sm text-muted-foreground">País inteiro</p>
                </div>
                <Badge variant="outline">Selecionado</Badge>
              </div>
            </div>
          </div>

          {/* Interesses */}
          <div>
            <h4 className="font-medium mb-3">Interesses</h4>
            <div className="space-y-4">
              {interestCategories.map((category) => (
                <Card key={category.category}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <category.icon className="w-4 h-4" />
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {category.interests.map((interest) => (
                        <div key={interest.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={interest.id}
                            checked={formData.interests.includes(interest.id)}
                            onChange={(e) => handleArrayInputChange('interests', interest.id, e.target.checked)}
                            className="rounded"
                          />
                          <Label htmlFor={interest.id} className="text-sm flex items-center gap-1">
                            <interest.icon className="w-3 h-3" />
                            {interest.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Resumo do Público */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-900 mb-2">Resumo do Público-alvo</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Idade: {formData.ageMin} - {formData.ageMax} anos</p>
                <p>• Gênero: {formData.gender === 'ALL' ? 'Todos' : formData.gender === 'MALE' ? 'Masculino' : 'Feminino'}</p>
                <p>• Localização: Brasil</p>
                <p>• Interesses selecionados: {formData.interests.length}</p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );

  // Step 3: Posicionamentos
  const renderStep3 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Posicionamentos</CardTitle>
          <CardDescription>
            Escolha onde seus anúncios aparecerão
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium">Plataformas</Label>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Facebook</h4>
                      <p className="text-sm text-muted-foreground">Feed, Stories, Marketplace</p>
                    </div>
                    <Switch 
                      checked={formData.platforms.includes('FACEBOOK')}
                      onCheckedChange={(checked) => 
                        handleArrayInputChange('platforms', 'FACEBOOK', checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Instagram</h4>
                      <p className="text-sm text-muted-foreground">Feed, Stories, Reels</p>
                    </div>
                    <Switch 
                      checked={formData.platforms.includes('INSTAGRAM')}
                      onCheckedChange={(checked) => 
                        handleArrayInputChange('platforms', 'INSTAGRAM', checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Posicionamentos Automáticos (Recomendado)</h4>
            <p className="text-sm text-blue-800">
              O Meta otimizará automaticamente onde seus anúncios aparecem para obter os melhores resultados pelo menor custo.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Step 4: Orçamento e Cronograma
  const renderStep4 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Orçamento e Cronograma
          </CardTitle>
          <CardDescription>
            Configure quanto e quando gastar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tipo de Orçamento */}
          <div>
            <Label className="text-base font-medium">Tipo de Orçamento</Label>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <Card 
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  formData.budgetType === 'DAILY' 
                    ? "ring-2 ring-blue-500 bg-blue-50" 
                    : "hover:bg-gray-50"
                )}
                onClick={() => handleInputChange('budgetType', 'DAILY')}
              >
                <CardContent className="p-4">
                  <h4 className="font-medium">Orçamento Diário</h4>
                  <p className="text-sm text-muted-foreground">Valor gasto por dia</p>
                </CardContent>
              </Card>

              <Card 
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  formData.budgetType === 'LIFETIME' 
                    ? "ring-2 ring-blue-500 bg-blue-50" 
                    : "hover:bg-gray-50"
                )}
                onClick={() => handleInputChange('budgetType', 'LIFETIME')}
              >
                <CardContent className="p-4">
                  <h4 className="font-medium">Orçamento Vitalício</h4>
                  <p className="text-sm text-muted-foreground">Valor total da campanha</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Valor do Orçamento */}
          <div>
            <Label htmlFor="budget">
              {formData.budgetType === 'DAILY' ? 'Orçamento Diário' : 'Orçamento Vitalício'} (R$)
            </Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', Number(e.target.value))}
              min="1"
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Mínimo: R$ 1,00 por dia
            </p>
          </div>

          {/* Estratégia de Lance */}
          <div>
            <Label>Estratégia de Lance</Label>
            <div className="space-y-3 mt-2">
              {bidStrategies.map((strategy) => (
                <Card 
                  key={strategy.value}
                  className={cn(
                    "cursor-pointer transition-all duration-200",
                    formData.bidStrategy === strategy.value 
                      ? "ring-2 ring-blue-500 bg-blue-50" 
                      : "hover:bg-gray-50"
                  )}
                  onClick={() => handleInputChange('bidStrategy', strategy.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{strategy.label}</h4>
                        <p className="text-sm text-muted-foreground">{strategy.description}</p>
                      </div>
                      {formData.bidStrategy === strategy.value && (
                        <Badge variant="default">Selecionado</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cronograma */}
          <div>
            <Label className="text-base font-medium">Cronograma</Label>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <Label htmlFor="start-date">Data de Início</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !formData.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? (
                        format(formData.startDate, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione a data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => handleInputChange('startDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="end-date">Data de Término (Opcional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !formData.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? (
                        format(formData.endDate, "PPP", { locale: ptBR })
                      ) : (
                        <span>Sem data de término</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => handleInputChange('endDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Step 5: Revisar
  const renderStep5 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Conjunto de Anúncios</CardTitle>
          <CardDescription>
            Revise todas as configurações antes de criar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configurações Básicas */}
          <div>
            <h4 className="font-medium mb-3">Configurações Básicas</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Nome:</span>
                <p className="font-medium">{formData.name || 'Não definido'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Objetivo:</span>
                <p className="font-medium">
                  {optimizationGoals.find(g => g.value === formData.optimizationGoal)?.label}
                </p>
              </div>
            </div>
          </div>

          {/* Público-alvo */}
          <div>
            <h4 className="font-medium mb-3">Público-alvo</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Idade:</span>
                <p className="font-medium">{formData.ageMin} - {formData.ageMax} anos</p>
              </div>
              <div>
                <span className="text-muted-foreground">Gênero:</span>
                <p className="font-medium">
                  {formData.gender === 'ALL' ? 'Todos' : formData.gender === 'MALE' ? 'Masculino' : 'Feminino'}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Localização:</span>
                <p className="font-medium">Brasil</p>
              </div>
              <div>
                <span className="text-muted-foreground">Interesses:</span>
                <p className="font-medium">{formData.interests.length} selecionados</p>
              </div>
            </div>
          </div>

          {/* Orçamento */}
          <div>
            <h4 className="font-medium mb-3">Orçamento e Cronograma</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Tipo:</span>
                <p className="font-medium">
                  {formData.budgetType === 'DAILY' ? 'Orçamento Diário' : 'Orçamento Vitalício'}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Valor:</span>
                <p className="font-medium">R$ {formData.budget}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Estratégia:</span>
                <p className="font-medium">
                  {bidStrategies.find(s => s.value === formData.bidStrategy)?.label}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Início:</span>
                <p className="font-medium">
                  {formData.startDate ? format(formData.startDate, "dd/MM/yyyy") : 'Não definido'}
                </p>
              </div>
            </div>
          </div>

          {/* Aviso */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Próximos Passos</h4>
            <p className="text-sm text-blue-800">
              Após criar o conjunto de anúncios, você poderá criar anúncios individuais com criativos específicos.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/client/${clientId}/ads-manager/meta/adsets`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Criar Conjunto de Anúncios</h1>
              <p className="text-muted-foreground">Meta Ads Manager</p>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <Stepper
          onFinalStepCompleted={handleFinalStepCompleted}
          onCancel={() => navigate(`/client/${clientId}/ads-manager/meta/adsets`)}
          backButtonText="Anterior"
          nextButtonText="Próximo"
          completeButtonText="Criar Conjunto"
        >
          <Step 
            title="Configurações Básicas"
            description="Nome e objetivo do conjunto"
            isValid={() => formData.name.length > 0}
          >
            {renderStep1()}
          </Step>
          
          <Step 
            title="Público-alvo"
            description="Defina quem verá seus anúncios"
            isValid={() => true}
          >
            {renderStep2()}
          </Step>
          
          <Step 
            title="Posicionamentos"
            description="Onde seus anúncios aparecerão"
            isValid={() => formData.platforms.length > 0}
          >
            {renderStep3()}
          </Step>
          
          <Step 
            title="Orçamento"
            description="Quanto e quando gastar"
            isValid={() => formData.budget > 0 && formData.startDate !== undefined}
          >
            {renderStep4()}
          </Step>
          
          <Step 
            title="Revisar"
            description="Confirme as configurações"
            isValid={() => true}
          >
            {renderStep5()}
          </Step>
        </Stepper>
      </div>
    </div>
  );
}