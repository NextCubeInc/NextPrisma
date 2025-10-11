import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Play, 
  Pause, 
  MoreHorizontal,
  TrendingUp,
  Eye,
  MousePointer,
  DollarSign,
  Settings,
  Target,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Dialog } from '@radix-ui/react-dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NavigationButtons } from '@/components/ui/navigation-button';
import { RadioGroupIndicator } from '@radix-ui/react-radio-group';

export default function TikTokAdsPage() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [step, setStep] = useState(1)
  const [campaignName, setCampaignName] = useState('')
  const [objective, setObjective] = useState('')
  const [subObjective, setSubObjective] = useState('')
  const [optimizationGoal, setOptimizationGoal] = useState('')
  const [postCode, setPostCode] = useState('')
  const [segmentationType, setSegmentationType] = useState('automatico')
  const [location, setLocation] = useState('Brasil')
  const [language, setLanguage] = useState('Todos')
  const [gender, setGender] = useState('Todos')
  const [budgetType, setBudgetType] = useState('personalizado')
  const [budgetPeriod, setBudgetPeriod] = useState('Diário')
  const [budgetAmount, setBudgetAmount] = useState('')
  const [scheduleType, setScheduleType] = useState('7dias')
  const [customScheduleType, setCustomScheduleType] = useState('continuo')

  // Função para obter data/hora atual no fuso de São Paulo
  const getCurrentSaoPauloDateTime = () => {
    const now = new Date()
    const saoPauloTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60));
    console.log(saoPauloTime)
    
    // Formatar manualmente sem usar toISOString() para não perder o fuso
    const year = saoPauloTime.getFullYear()
    const month = String(saoPauloTime.getMonth() + 1).padStart(2, '0')
    const day = String(saoPauloTime.getDate()).padStart(2, '0')
    const hours = String(saoPauloTime.getHours()).padStart(2, '0')
    const minutes = String(saoPauloTime.getMinutes()).padStart(2, '0')
    
    const formatted = `${year}-${month}-${day}T${hours}:${minutes}`
    console.log('Formatted:', formatted)
    return formatted
  }
  
  // Função para obter data/hora + 7 dias no fuso de São Paulo
  const getSevenDaysLaterSaoPaulo = () => {
    const now = new Date()
    const saoPauloTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60));
    saoPauloTime.setDate(saoPauloTime.getDate() + 7);
    
    // Formatar manualmente sem usar toISOString() para não perder o fuso
    const year = saoPauloTime.getFullYear()
    const month = String(saoPauloTime.getMonth() + 1).padStart(2, '0')
    const day = String(saoPauloTime.getDate()).padStart(2, '0')
    const hours = String(saoPauloTime.getHours()).padStart(2, '0')
    const minutes = String(saoPauloTime.getMinutes()).padStart(2, '0')
    
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const [startDate, setStartDate] = useState(getCurrentSaoPauloDateTime())
  const [endDate, setEndDate] = useState(getSevenDaysLaterSaoPaulo())

  // Atualizar as datas quando o componente for montado ou quando necessário
  useEffect(() => {
    const updateDates = () => {
      const currentDateTime = getCurrentSaoPauloDateTime()
      const sevenDaysLater = getSevenDaysLaterSaoPaulo()
      setStartDate(currentDateTime)
      setEndDate(sevenDaysLater)
    }
    
    // Atualizar imediatamente
    updateDates()
    
    // Opcional: Atualizar a cada minuto para manter sincronizado
    const interval = setInterval(updateDates, 60000)
    
    return () => clearInterval(interval)
  }, [])

  // Função para lidar com mudança de objetivo principal
  const handleObjectiveChange = (newObjective: string) => {
    setObjective(newObjective)
    setSubObjective('') // Reset sub-objetivo quando objetivo principal muda
  }

  // Funções de navegação entre steps
  const nextStep = () => {
    if (step < 4) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }
  console.log(step)
  // Validação para avançar step
  const canAdvanceStep = () => {
    switch (step) {
      case 1:
        return objective !== '' && subObjective !== ''
      case 2:
        return campaignName.trim() !== '' && optimizationGoal !== ''
      case 3:
        return postCode.trim() !== ''
      case 4:
        return budgetAmount.trim() !== '' && parseFloat(budgetAmount) > 0
      default:
        return false
    }
  }

  const metrics = [
    {
      title: 'Impressões',
      value: '2.1M',
      change: '+12.5%',
      icon: Eye,
      color: 'text-blue-600'
    },
    {
      title: 'Cliques',
      value: '45.2K',
      change: '+8.3%',
      icon: MousePointer,
      color: 'text-green-600'
    },
    {
      title: 'CTR',
      value: '2.15%',
      change: '+0.3%',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Gasto',
      value: 'R$ 8.450',
      change: '+15.2%',
      icon: DollarSign,
      color: 'text-red-600'
    }
  ];

  const campaigns = [
    {
      id: 1,
      name: 'Campanha de Reconhecimento - TikTok',
      status: 'Ativa',
      budget: 'R$ 500/dia',
      impressions: '125.4K',
      clicks: '2.8K',
      ctr: '2.24%',
      spent: 'R$ 1.250'
    },
    {
      id: 2,
      name: 'Promoção de Verão - TikTok',
      status: 'Pausada',
      budget: 'R$ 300/dia',
      impressions: '89.2K',
      clicks: '1.9K',
      ctr: '2.13%',
      spent: 'R$ 890'
    },
    {
      id: 3,
      name: 'Lançamento de Produto - TikTok',
      status: 'Ativa',
      budget: 'R$ 750/dia',
      impressions: '198.7K',
      clicks: '4.2K',
      ctr: '2.11%',
      spent: 'R$ 2.100'
    }
  ];

  const campaignObjectives = [
  {
    id: 'Brand awareness',
    name: 'Reconhecimento',
    description: 'Aumentar o conhecimento da marca e alcançar mais pessoas',
    subObjectives: [
      {
        id: 'Traffic',
        name: 'Tráfego',
        description: 'Levar pessoas para visitar seu site.',
      },
      {
        id: 'Video views',
        name: 'Visualizações de Vídeo',
        description: 'Obtenha mais visualizações e engajamento para seus vídeos.'
      },
      {
        id: 'Community interaction',
        name: 'Interação com a Comunidade',
        description: 'Obtenha mais visualizações e engajamento para seus vídeos.'
      }
    ]
  },
  {
    id: 'Lead generation',
    name: 'Geração de Leads',
    description: 'Capturar informações de contato de potenciais clientes',
    subObjectives: [
      {
        id: 'Website form',
        name: 'Formulário no Site', 
        description: 'Obtenha leads através do seu site.',
      },
      {
        id: 'TikTok Instant Form',
        name: 'TikTok Instant Form',
        description: 'Obtenha leads através do TikTok Instant Form.'
      },
      {
        id: 'Direct messages or phone calls',
        name: 'Mensagens Diretas ou Chamadas',
        description: 'Obtenha leads através de mensagens diretas ou chamadas telefônicas.'
      }
    ]
  },
  {
    id: 'Sales',
    name: 'Vendas',
    description: 'Obter mais curtidas, comentários, compartilhamentos e interações',
    subObjectives: [
      {
        id: 'Website conversion',
        name: 'Conversão de Site',
        description: 'Gere vendas em seu site.',
      },
      {
        id: 'TikTok Shop',
        name: 'TikTok Shop',
        description: 'Gere vendas em sua TikTok Shop.'
      }
    ]
  }
]

  // Encontrar objetivo selecionado
  const selectedObjective = campaignObjectives.find(obj => obj.id === objective)


  const optimizationGoals = [
    {
      id: 'Conversions',
      name: 'Clique',
      description: 'Nós entregamos seus anúncios para pessoas com maior probabilidade de clicar neles.'
    },
    {
      id: 'Video views',
      name: 'Visualizações de vídeo',
      description: 'Nós entregamos seus anúncios para pessoas com maior probabilidade de assistir aos seus vídeos.'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">TikTok Ads Manager</h1>
          <p className="text-muted-foreground">Gerencie suas campanhas do TikTok Ads</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Criar Campanha
        </Button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                    <p className={`text-sm ${metric.color}`}>{metric.change}</p>
                  </div>
                  <IconComponent className={`w-8 h-8 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted">
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-background">
            Campanhas
          </TabsTrigger>
          <TabsTrigger value="adgroups" className="data-[state=active]:bg-background">
            Grupos de Anúncios
          </TabsTrigger>
          <TabsTrigger value="ads" className="data-[state=active]:bg-background">
            Anúncios
          </TabsTrigger>
          <TabsTrigger value="audiences" className="data-[state=active]:bg-background">
            Públicos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          {/* Filters and Actions */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex flex-1 gap-2">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input 
                      placeholder="Pesquisar campanhas..." 
                      className="pl-10 bg-background border-input"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="border-input">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-input">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaigns Table */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Campanhas Ativas</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Nova campanha
                    </Button>
                  </DialogTrigger>
                  {/* Dialog content for filters can be added here */}
                  <DialogContent className="w-[90vw] sm:max-w-4xl max-h-screen overflow-y-auto">
                    {/* Header */}
                     <DialogHeader>
                      <DialogTitle>Criar Nova Campanha no Tiktok</DialogTitle>
                      <DialogDescription>
                        Configure sua campanha seguindo os passos abaixo
                      </DialogDescription>
                    </DialogHeader>

                     {/* Stepper */}
                    <div className="flex items-center justify-center mt-4">
                      <div className="flex items-center justify-between w-full">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ml-1 mr-4 ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}> 
                          1
                        </div>
                        <div className={`flex-1 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-4 ml-4 ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                          2
                        </div>
                        <div className={`flex-1 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ml-4 ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                          3
                        </div>
                        <div className={`flex-1 h-1 ${step >= 4 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ml-4 ${step >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                          4
                        </div>
                      </div>
                    </div>
                    {/* End Stepper */}
                    {/* Form Steps */}
                    {step === 1 && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-6 flex items-center">
                            <Settings className="h-5 w-5 mr-2 text-blue-600" />
                            Quais são os objetivos da sua campanha?
                          </h3>

                          {/* Card para Objetivos da Campanha */}
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base flex items-center">
                                <Target className="h-4 w-4 mr-2 text-blue-600" />
                                Objetivo da Campanha
                              </CardTitle>
                              <CardDescription>
                                Escolha o objetivo que melhor representa o que você deseja alcançar
                              </CardDescription>
                            </CardHeader>
                            {/* Modal card content */}
                            <CardContent>
                              <div>
                              <label className="block text-sm font-medium mb-4">Objetivo da Campanha</label>
                              <RadioGroup value={objective} onValueChange={handleObjectiveChange}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  {campaignObjectives.map((obj) => (
                                    <div 
                                      className={`flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-800 cursor-pointer transition-all duration-200 ${
                                        objective === obj.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
                                      }`} 
                                      key={obj.id}
                                      onClick={() => handleObjectiveChange(obj.id)}
                                    >
                                      <RadioGroupItem value={obj.id} id={obj.id} className="sr-only" />
                                      <div className="flex-1 pointer-events-none">
                                        <div className="flex items-center space-x-2">
                                          <span className="font-medium">
                                            {obj.name}
                                          </span>
                                          {objective === obj.id && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                          )}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{obj.description}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </RadioGroup>

                              {/* Sub-objetivos */}
                              {selectedObjective && selectedObjective.subObjectives && (
                                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                  <label className="block text-sm font-medium mb-4">
                                    Sub-objetivos para: <span className="text-blue-600">{selectedObjective.name}</span>
                                  </label>
                                  <RadioGroup value={subObjective} onValueChange={setSubObjective}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                      {selectedObjective.subObjectives.map((subObj) => (
                                        <div 
                                          className={`flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200 ${
                                            subObjective === subObj.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
                                          }`} 
                                          key={subObj.id}
                                          onClick={() => setSubObjective(subObj.id)}
                                        >
                                          <RadioGroupItem value={subObj.id} id={subObj.id} className="sr-only" />
                                          <div className="flex-1 pointer-events-none">
                                            <div className="flex items-center space-x-2">
                                              <span className="font-medium text-sm">
                                                {subObj.name}
                                              </span>
                                              {subObjective === subObj.id && (
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                              )}
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{subObj.description}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </RadioGroup>
                                </div>
                              )}

                              </div>
                            </CardContent>
                          </Card>

                          {/* Botões de Navegação */}
                          <NavigationButtons
                            currentStep={step}
                            totalSteps={4}
                            onPrevious={prevStep}
                            onNext={nextStep}
                            canAdvance={canAdvanceStep()}
                            isFirstStep={step <= 1}
                            isLastStep={step >= 4}
                          />
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-6 flex items-center">
                            <Target className="h-5 w-5 mr-2 text-blue-600" />
                            Informações da Campanha
                          </h3>
                          
                           {/* Card para Nome da Campanha */}
                          <Card className="mb-6">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">Identificação da Campanha</CardTitle>
                              <CardDescription>
                                Defina um nome claro e descritivo para sua campanha
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className='flex flex-col p-0'>
                                <label className="block text-sm font-medium mb-2">Nome da Campanha</label>
                                <Input
                                  value={campaignName}
                                  onChange={(e) => setCampaignName(e.target.value)}
                                  placeholder="Digite o nome da campanha"
                                  className="m-0"
                                />
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">Meta de otimização</CardTitle>
                              <CardDescription>
                                A meta de otimização é usada para personalizar sua estratégia de lances e orçamento ao criar anúncios. Dependendo do objetivo de campanha escolhido, haverá diferentes metas de otimização, como Geração de Leads ou Conversão de Site.
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              {optimizationGoals.length > 0 ? (
                                <div className="space-y-4">
                                  <Select value={optimizationGoal} onValueChange={setOptimizationGoal}>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Selecione uma meta de otimização" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {optimizationGoals.map((goal) => (
                                        <SelectItem key={goal.id} value={goal.id}>
                                          {goal.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  
                                  {/* Mostrar descrição da meta selecionada */}
                                  {optimizationGoal && (
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                      <div className="flex items-start space-x-3">
                                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                          <div className="w-2 h-2 bg-white rounded-full"></div>
                                        </div>
                                        <div>
                                          <h4 className="font-medium text-blue-900 dark:text-blue-100 text-sm">
                                            {optimizationGoals.find(g => g.id === optimizationGoal)?.name}
                                          </h4>
                                          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                            {optimizationGoals.find(g => g.id === optimizationGoal)?.description}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Selecione um objetivo e sub-objetivo no passo anterior para ver as metas de otimização disponíveis.
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>

                          {/* Botões de Navegação */}
                          <NavigationButtons
                            currentStep={step}
                            totalSteps={4}
                            onPrevious={prevStep}
                            onNext={nextStep}
                            canAdvance={canAdvanceStep()}
                            isFirstStep={step <= 1}
                            isLastStep={step >= 4}
                          />
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-6 flex items-center">
                            <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                            Conteúdo do anúncio
                          </h3>
                          
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">Código da Postagem</CardTitle>
                              <CardDescription>
                                Adicione o código da postagem do TikTok que deseja promover
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Input
                                value={postCode}
                                type="string"
                                placeholder="Cole o código da postagem aqui"
                                className="w-full p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setPostCode(e.target.value)}
                              />
                            </CardContent>
                          </Card>

                          {/* Botões de Navegação */}
                          <NavigationButtons
                            currentStep={step}
                            totalSteps={4}
                            onPrevious={prevStep}
                            onNext={nextStep}
                            canAdvance={canAdvanceStep()}
                            isFirstStep={step <= 1}
                            isLastStep={step >= 4}
                          />
                        </div>
                      </div>
                    )}
                    {step === 4 && (
                      <div className="space-y-6">
                          <h3 className="text-lg font-semibold mb-6 flex items-center">
                            <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                            Segmentação e orçamento
                          </h3>
                        <div className="flex flex-col gap-6">
                          
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">Segmentação</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">

                                <RadioGroup value={segmentationType} onValueChange={setSegmentationType}>
                                  <div className="space-y-3">
                                    {/* Automático */}
                                    <div 
                                      className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                                        segmentationType === 'automatico' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
                                      }`}
                                      onClick={() => setSegmentationType('automatico')}
                                    >
                                      <RadioGroupItem value="automatico" id="automatico" className="mt-1" />
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                          <label htmlFor="automatico" className="font-medium cursor-pointer">
                                            Automático
                                          </label>
                                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                            Recomendado
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                          Segmente automaticamente os públicos mais receptivos ao seu anúncio em tempo real.
                                        </p>
                                      </div>
                                    </div>

                                    {/* Personalizado */}
                                    <div 
                                      className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                                        segmentationType === 'personalizado' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
                                      }`}
                                      onClick={() => setSegmentationType('personalizado')}
                                    >
                                      <RadioGroupItem value="personalizado" id="personalizado" className="mt-1" />
                                      <div className="flex-1">
                                        <label htmlFor="personalizado" className="font-medium cursor-pointer">
                                          Personalizado
                                        </label>
                                        <p className="text-sm text-gray-600 mt-1">
                                          Controle precisamente quem vê seu anúncio.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </RadioGroup>

                                {/* Campos condicionais para segmentação personalizada */}
                                {segmentationType === 'personalizado' && (
                                  <div className="mt-6 space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                      Configurações de Segmentação
                                    </h4>
                                    
                                    {/* Localização */}
                                    <div>
                                      <label className="block text-sm font-medium mb-2">
                                        Localização
                                      </label>
                                      <Select value={location} onValueChange={setLocation}>
                                        <SelectTrigger className="w-full">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Brasil">Brasil</SelectItem>
                                          <SelectItem value="Estados Unidos">Estados Unidos</SelectItem>
                                          <SelectItem value="Reino Unido">Reino Unido</SelectItem>
                                          <SelectItem value="Canada">Canadá</SelectItem>
                                          <SelectItem value="Australia">Austrália</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {/* Idiomas */}
                                    <div>
                                      <label className="block text-sm font-medium mb-2">
                                        Idiomas
                                      </label>
                                      <Select value={language} onValueChange={setLanguage}>
                                        <SelectTrigger className="w-full">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Todos">Todos</SelectItem>
                                          <SelectItem value="Português">Português</SelectItem>
                                          <SelectItem value="Inglês">Inglês</SelectItem>
                                          <SelectItem value="Espanhol">Espanhol</SelectItem>
                                          <SelectItem value="Francês">Francês</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {/* Gênero */}
                                    <div>
                                      <label className="block text-sm font-medium mb-2">
                                        Gênero
                                      </label>
                                      <Select value={gender} onValueChange={setGender}>
                                        <SelectTrigger className="w-full">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Todos">Todos</SelectItem>
                                          <SelectItem value="Masculino">Masculino</SelectItem>
                                          <SelectItem value="Feminino">Feminino</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">Orçamento</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <RadioGroup value={budgetType} onValueChange={setBudgetType}>
                                  <div className="space-y-3">
                                    {/* Orçamento Personalizado */}
                                    <div 
                                      className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                                        budgetType === 'personalizado' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-gray-200 dark:border-gray-700'
                                      }`}
                                      onClick={() => setBudgetType('personalizado')}
                                    >
                                      <RadioGroupItem value="personalizado" id="orcamento-personalizado" className="mt-1" />
                                      <div className="flex-1">
                                        <label htmlFor="orcamento-personalizado" className="font-medium cursor-pointer">
                                          Orçamento personalizado
                                        </label>
                                        <p className="text-sm text-gray-600 mt-1">
                                          Selecione o modo e a quantidade.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </RadioGroup>

                                {/* Campos de configuração do orçamento */}
                                {budgetType === 'personalizado' && (
                                  <div className="mt-6 space-y-4">
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                      Orçamento
                                    </h4>
                                    
                                    <div className="flex gap-4">
                                      {/* Select de período */}
                                      <div className="flex-1">
                                        <Select value={budgetPeriod} onValueChange={setBudgetPeriod}>
                                          <SelectTrigger className="w-full">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="Diário">Diário</SelectItem>
                                            <SelectItem value="Vida">Vida</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      {/* Input de valor */}
                                      <div className="flex-1 relative">
                                        <Input
                                          type="number"
                                          value={budgetAmount}
                                          onChange={(e) => setBudgetAmount(e.target.value)}
                                          placeholder="0.00"
                                          className="pr-12"
                                          step="0.01"
                                          min="0"
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                          BRL
                                        </div>
                                      </div>
                                    </div>

                                    {/* Mensagem de aviso */}
                                    {budgetAmount === '' || parseFloat(budgetAmount) === 0 ? (
                                      <div className="text-sm text-red-600 mt-2">
                                        É necessário orçamento
                                      </div>
                                    ) : null}

                                    {/* Descrição informativa */}
                                    <div className="text-sm text-gray-600 mt-2">
                                      Seus gastos diários dependerão das oportunidades de publicidade disponíveis. Você não gastará mais de 7 vezes o seu orçamento por semana.
                                    </div>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">Agendar</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <RadioGroup value={scheduleType} onValueChange={setScheduleType}>
                                  <div className="space-y-3">
                                    {/* 7 dias - Recomendado */}
                                    <div 
                                      className={`flex items-start justify-between p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                                        scheduleType === '7dias' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
                                      }`}
                                      onClick={() => setScheduleType('7dias')}
                                    >
                                      <div className="flex items-start space-x-3">
                                        <RadioGroupItem value="7dias" id="schedule-7dias" className="mt-1" />
                                        <div>
                                          <div className="flex items-center space-x-2">
                                            <label htmlFor="schedule-7dias" className="font-medium cursor-pointer">
                                              7 dias
                                            </label>
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                              Recomendado
                                            </span>
                                          </div>
                                          <p className="text-sm text-gray-600 mt-1">
                                            Recomendamos executar campanhas por pelo menos 7 dias.
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Cronograma personalizado */}
                                    <div 
                                      className={`flex items-start justify-between p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                                        scheduleType === 'personalizado' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-gray-200 dark:border-gray-700'
                                      }`}
                                      onClick={() => setScheduleType('personalizado')}
                                    >
                                      <div className="flex items-start space-x-3">
                                        <RadioGroupItem value="personalizado" id="schedule-personalizado" className="mt-1" />
                                        <div>
                                          <label htmlFor="schedule-personalizado" className="font-medium cursor-pointer">
                                            Cronograma personalizado
                                          </label>
                                          <p className="text-sm text-gray-600 mt-1">
                                            Selecione o tipo e a duração.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </RadioGroup>

                                {/* Campos de configuração do cronograma personalizado */}
                                {scheduleType === 'personalizado' && (
                                  <div className="mt-6 space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-teal-500">
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                      Agendar <span className="text-gray-500 text-sm">América/São_Paulo</span>
                                    </h4>
                                    
                                    <RadioGroup value={customScheduleType} onValueChange={setCustomScheduleType}>
                                      <div className="space-y-3">
                                        {/* Execução contínua */}
                                        <div className="flex items-start space-x-3">
                                          <RadioGroupItem value="continuo" id="continuo" className="mt-1" />
                                          <div className="flex-1">
                                            <label htmlFor="continuo" className="font-medium cursor-pointer text-sm">
                                              Defina a hora de início e execute o grupo de anúncios continuamente
                                            </label>
                                            {customScheduleType === 'continuo' && (
                                              <div className="mt-3">
                                                <Input
                                                  type="datetime-local"
                                                  value={startDate}
                                                  onChange={(e) => setStartDate(e.target.value)}
                                                  className="w-full"
                                                  min={getCurrentSaoPauloDateTime()}
                                                />
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        {/* Definir início e término */}
                                        <div className="flex items-start space-x-3">
                                          <RadioGroupItem value="periodo" id="periodo" className="mt-1" />
                                          <div className="flex-1">
                                            <label htmlFor="periodo" className="font-medium cursor-pointer text-sm">
                                              Definir hora de início e término
                                            </label>
                                            {customScheduleType === 'periodo' && (
                                              <div className="mt-3 space-y-3">
                                                <div className="flex gap-4 items-center">
                                                  <Input
                                                    type="datetime-local"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    className="flex-1"
                                                    min={getCurrentSaoPauloDateTime()}
                                                  />
                                                  <span className="text-gray-500">-</span>
                                                  <Input
                                                    type="datetime-local"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                    className="flex-1"
                                                    min={startDate}
                                                  />
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                  Recomendamos que você veicule seu primeiro anúncio por no mínimo 7 dias para concluir a fase de aprendizado. Deixe o algoritmo otimizar sua campanha e veja os resultados.
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </RadioGroup>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Botões de Navegação */}
                          <NavigationButtons
                            currentStep={step}
                            totalSteps={4}
                            onPrevious={prevStep}
                            onNext={nextStep}
                            canAdvance={canAdvanceStep()}
                            isFirstStep={step <= 1}
                            isLastStep={step >= 4}
                          />
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Nome da Campanha</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Orçamento</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Impressões</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Cliques</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">CTR</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Gasto</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-foreground">{campaign.name}</div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant={campaign.status === 'Ativa' ? 'default' : 'secondary'}
                            className={campaign.status === 'Ativa' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                          >
                            {campaign.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{campaign.budget}</td>
                        <td className="py-3 px-4 text-muted-foreground">{campaign.impressions}</td>
                        <td className="py-3 px-4 text-muted-foreground">{campaign.clicks}</td>
                        <td className="py-3 px-4 text-muted-foreground">{campaign.ctr}</td>
                        <td className="py-3 px-4 text-muted-foreground">{campaign.spent}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              {campaign.status === 'Ativa' ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adgroups" className="space-y-4">
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium text-foreground mb-2">Grupos de Anúncios</h3>
              <p className="text-muted-foreground">Gerencie seus grupos de anúncios do TikTok aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ads" className="space-y-4">
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium text-foreground mb-2">Anúncios</h3>
              <p className="text-muted-foreground">Visualize e gerencie seus anúncios individuais do TikTok.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audiences" className="space-y-4">
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium text-foreground mb-2">Públicos</h3>
              <p className="text-muted-foreground">Crie e gerencie seus públicos-alvo do TikTok.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}