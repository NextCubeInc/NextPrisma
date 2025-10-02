import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  Target,
  DollarSign,
  Download,
  RefreshCw,
  Edit,
  Trash2,
  Play,
  Pause,
  BarChart3,
  Settings,
  Copy,
  ExternalLink,
  Zap,
  ShoppingCart,
  Heart,
  MessageCircle,
  MousePointer,
  TestTube,
  Globe,
  Shield,
  UserCheck,
  Layers,
  Info,
  AlertTriangle,
  Smartphone,
  Calendar,
  Clock,
  Calculator
} from 'lucide-react'

const campaignObjectives = [
  {
    id: 'OUTCOME_AWARENESS',
    name: 'Reconhecimento',
    description: 'Aumentar o conhecimento da marca e alcançar mais pessoas',
    icon: <Eye className="h-5 w-5" />,
    category: 'awareness',
    tooltip: 'Ideal para aumentar a visibilidade da marca e criar reconhecimento entre novos públicos'
  },
  {
    id: 'OUTCOME_TRAFFIC',
    name: 'Tráfego',
    description: 'Direcionar pessoas para seu site, app ou Messenger',
    icon: <MousePointer className="h-5 w-5" />,
    category: 'consideration',
    tooltip: 'Otimizado para gerar cliques e visitas de qualidade para seus destinos'
  },
  {
    id: 'OUTCOME_ENGAGEMENT',
    name: 'Engajamento',
    description: 'Obter mais curtidas, comentários, compartilhamentos e interações',
    icon: <Heart className="h-5 w-5" />,
    category: 'consideration',
    tooltip: 'Perfeito para aumentar a interação com seus posts e construir comunidade'
  },
  {
    id: 'OUTCOME_LEADS',
    name: 'Geração de Leads',
    description: 'Coletar informações de contato e gerar leads qualificados',
    icon: <Target className="h-5 w-5" />,
    category: 'consideration',
    tooltip: 'Otimizado para capturar leads através de formulários e conversas'
  },
  {
    id: 'OUTCOME_APP_PROMOTION',
    name: 'Promoção de App',
    description: 'Promover instalações e ações no seu aplicativo',
    icon: <Smartphone className="h-5 w-5" />,
    category: 'conversion',
    tooltip: 'Ideal para aumentar downloads e engajamento no seu app'
  },
  {
    id: 'OUTCOME_SALES',
    name: 'Vendas',
    description: 'Gerar vendas e conversões no seu site ou catálogo',
    icon: <ShoppingCart className="h-5 w-5" />,
    category: 'conversion',
    tooltip: 'Otimizado para maximizar vendas e conversões de alto valor'
  }
]

const bidStrategies = [
  { 
    id: 'LOWEST_COST_WITHOUT_CAP', 
    name: 'Menor custo', 
    description: 'Obter o máximo de resultados pelo menor custo',
    tooltip: 'Recomendado para a maioria das campanhas. A Meta otimiza automaticamente para obter o melhor custo por resultado.'
  },
  { 
    id: 'LOWEST_COST_WITH_BID_CAP', 
    name: 'Limite de lance', 
    description: 'Controlar quanto você paga por resultado',
    tooltip: 'Use quando quiser definir um valor máximo que está disposto a pagar por cada resultado.'
  },
  { 
    id: 'TARGET_COST', 
    name: 'Custo desejado', 
    description: 'Manter um custo médio por resultado',
    tooltip: 'Ideal quando você tem um custo por resultado específico que deseja manter consistentemente.'
  },
  { 
    id: 'LOWEST_COST_WITH_MIN_ROAS', 
    name: 'ROAS mínimo', 
    description: 'Manter um retorno mínimo sobre o investimento',
    tooltip: 'Perfeito para e-commerce. Define o retorno mínimo sobre o investimento publicitário que você precisa alcançar.'
  }
]

export default function MetaAdsPage() {
  const { '*': splat } = useParams<{ '*': string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { activeClient } = useWorkspace()
  const pathParts = splat?.split('/') || []
  const section = pathParts[1] || 'campaigns'
  
  const [activeTab, setActiveTab] = useState(section)
  
  // Estados do formulário de criação de campanha
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [campaignName, setCampaignName] = useState('')
  const [objective, setObjective] = useState('')
  const [advantageBudget, setAdvantageBudget] = useState(false)
  const [budgetType, setBudgetType] = useState<'DAILY' | 'LIFETIME'>('DAILY')
  const [budget, setBudget] = useState('')
  const [bidStrategy, setBidStrategy] = useState('LOWEST_COST_WITHOUT_CAP')
  const [bidAmount, setBidAmount] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Estados para A/B Testing
  const [abTestEnabled, setAbTestEnabled] = useState(false)
  const [abTestVariable, setAbTestVariable] = useState('')
  const [abTestBudgetSplit, setAbTestBudgetSplit] = useState('50')

  // Estados para Special Ad Categories
  const [specialAdCategories, setSpecialAdCategories] = useState<string[]>([])
  const [politicalCountry, setPoliticalCountry] = useState('')

  // Estados para Advantage+ Audience
  const [advantageAudience, setAdvantageAudience] = useState(false)
  const [audienceMinAge, setAudienceMinAge] = useState('18')
  const [audienceMaxAge, setAudienceMaxAge] = useState('65')

  // Estados para Placements
  const [placementType, setPlacementType] = useState('automatic')
  const [selectedPlacements, setSelectedPlacements] = useState<string[]>([])

  // Estados para Recognition
  const [recognitionEnabled, setRecognitionEnabled] = useState(false)
  const [recognitionAudienceType, setRecognitionAudienceType] = useState('')

  const resetForm = () => {
    setStep(1)
    setCampaignName('')
    setObjective('')
    setAdvantageBudget(false)
    setBudgetType('DAILY')
    setBudget('')
    setBidStrategy('LOWEST_COST_WITHOUT_CAP')
    setBidAmount('')
    setStartDate('')
    setEndDate('')
    
    // Reset A/B Testing
    setAbTestEnabled(false)
    setAbTestVariable('')
    setAbTestBudgetSplit('50')
    
    // Reset Special Ad Categories
    setSpecialAdCategories([])
    setPoliticalCountry('')
    
    // Reset Advantage+ Audience
    setAdvantageAudience(false)
    setAudienceMinAge('18')
    setAudienceMaxAge('65')
    
    // Reset Placements
    setPlacementType('automatic')
    setSelectedPlacements([])
    
    // Reset Recognition
    setRecognitionEnabled(false)
    setRecognitionAudienceType('')
  }

  const handleCreateCampaign = async () => {
    if (!user || !activeClient) return

    setLoading(true)
    try {
      const campaignData: any = {
        name: campaignName,
        platform: 'META',
        objective,
        budget_type: budgetType,
        budget: parseFloat(budget),
        bid_strategy: bidStrategy,
        bid_amount: bidAmount ? parseFloat(bidAmount) : null,
        start_date: startDate,
        end_date: endDate || null,
        status: 'PAUSED',
        client_id: activeClient.id,
        user_id: user.id,
        // Novos campos adicionados
        ab_testing_enabled: abTesting,
        special_ad_categories: specialAdCategories.length > 0 ? specialAdCategories : null,
        special_ad_category_country: specialAdCategories.includes('ISSUES_ELECTIONS_POLITICS') ? politicalCountry : null,
        advantage_audience_enabled: advantageAudience,
        placements: selectedPlacements.length > 0 ? selectedPlacements : null,
        recognition_enabled: recognition
      }

      // Adiciona budget_rebalance_flag quando Advantage+ estiver ativo
      if (advantageBudget) {
        campaignData.budget_rebalance_flag = true
      }

      const { data, error } = await supabase
        .from('campaigns')
        .insert(campaignData)
        .select()
        .single()

      if (error) throw error

      // Fechar modal e resetar formulário
      resetForm()
      
      // Atualizar a lista de campanhas (você pode implementar um refresh aqui)
      window.location.reload()
    } catch (error) {
      console.error('Erro ao criar campanha:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  // Validações melhoradas
  const validateStep1 = () => {
    const errors: string[] = []
    if (!campaignName.trim()) errors.push('Nome da campanha é obrigatório')
    if (campaignName.trim().length < 3) errors.push('Nome deve ter pelo menos 3 caracteres')
    if (!objective) errors.push('Objetivo da campanha é obrigatório')
    return { isValid: errors.length === 0, errors }
  }

  const validateStep2 = () => {
    const errors: string[] = []
    
    if (!advantageBudget) {
      if (!budget) errors.push('Orçamento é obrigatório')
      else if (parseFloat(budget) < 1) errors.push('Orçamento deve ser maior que R$ 1,00')
      else if (budgetType === 'DAILY' && parseFloat(budget) < 5) errors.push('Orçamento diário mínimo é R$ 5,00')
    }
    
    if (!bidStrategy) errors.push('Estratégia de lance é obrigatória')
    
    if (bidStrategy === 'MANUAL_BID' && (!bidAmount || parseFloat(bidAmount) <= 0)) {
      errors.push('Valor do lance é obrigatório para lance manual')
    }
    
    return { isValid: errors.length === 0, errors }
  }

  const validateStep3 = () => {
    const errors: string[] = []
    
    if (!startDate) errors.push('Data de início é obrigatória')
    else if (new Date(startDate) < new Date()) errors.push('Data de início deve ser futura')
    
    if (endDate && new Date(endDate) <= new Date(startDate)) {
      errors.push('Data de fim deve ser posterior à data de início')
    }
    
    if (specialAdCategories.includes('ISSUES_ELECTIONS_POLITICS') && !politicalCountry) {
      errors.push('País é obrigatório para anúncios políticos')
    }
    
    return { isValid: errors.length === 0, errors }
  }

  const step1Validation = validateStep1()
  const step2Validation = validateStep2()
  const step3Validation = validateStep3()
  
  const canProceedStep1 = step1Validation.isValid
  const canProceedStep2 = step2Validation.isValid
  const canCreateCampaign = step1Validation.isValid && step2Validation.isValid && step3Validation.isValid

  // Mock data - Em produção, estes dados viriam da API do Meta
  const metrics = [
    { label: 'Impressões', value: '2.4M', change: '+12%', trend: 'up', icon: Eye },
    { label: 'Alcance', value: '1.8M', change: '+8%', trend: 'up', icon: Users },
    { label: 'Cliques', value: '45.2K', change: '+15%', trend: 'up', icon: Target },
    { label: 'CTR', value: '1.88%', change: '-2%', trend: 'down', icon: BarChart3 },
    { label: 'CPC', value: 'R$ 0.85', change: '+5%', trend: 'down', icon: DollarSign },
    { label: 'ROAS', value: '4.2x', change: '+18%', trend: 'up', icon: TrendingUp }
  ]

  const campaigns = [
    { 
      id: 1, 
      name: 'Campanha Black Friday 2024', 
      objective: 'CONVERSIONS',
      status: 'ACTIVE', 
      budget: 500,
      spent: 485,
      impressions: 125000,
      clicks: 2400,
      ctr: 1.92,
      cpc: 0.82,
      conversions: 48,
      roas: 4.2,
      created_at: '2024-01-15'
    },
    { 
      id: 2, 
      name: 'Remarketing - Carrinho Abandonado', 
      objective: 'CONVERSIONS',
      status: 'ACTIVE', 
      budget: 200,
      spent: 195,
      impressions: 85000,
      clicks: 1800,
      ctr: 2.12,
      cpc: 0.75,
      conversions: 32,
      roas: 3.8,
      created_at: '2024-01-10'
    },
    { 
      id: 3, 
      name: 'Prospecção - Lookalike', 
      objective: 'REACH',
      status: 'PAUSED', 
      budget: 300,
      spent: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      cpc: 0,
      conversions: 0,
      roas: 0,
      created_at: '2024-01-08'
    }
  ]

  const adSets = [
    {
      id: 1,
      campaign_id: 1,
      name: 'Público Interesse - Moda Feminina',
      status: 'ACTIVE',
      budget: 150,
      spent: 145,
      targeting: 'Mulheres, 25-45, Interesse: Moda',
      impressions: 45000,
      clicks: 890,
      ctr: 1.98,
      cpc: 0.85,
      conversions: 18
    },
    {
      id: 2,
      campaign_id: 1,
      name: 'Lookalike - Compradores',
      status: 'ACTIVE',
      budget: 200,
      spent: 190,
      targeting: 'Lookalike 1% - Compradores',
      impressions: 55000,
      clicks: 1100,
      ctr: 2.0,
      cpc: 0.80,
      conversions: 22
    },
    {
      id: 3,
      campaign_id: 2,
      name: 'Remarketing - Visitantes 7 dias',
      status: 'ACTIVE',
      budget: 100,
      spent: 95,
      targeting: 'Visitantes últimos 7 dias',
      impressions: 25000,
      clicks: 650,
      ctr: 2.6,
      cpc: 0.70,
      conversions: 15
    }
  ]

  const ads = [
    {
      id: 1,
      adset_id: 1,
      name: 'Criativo Vídeo - Coleção Verão',
      status: 'ACTIVE',
      format: 'VIDEO',
      impressions: 25000,
      clicks: 450,
      ctr: 1.8,
      cpc: 0.88,
      conversions: 9,
      creative_url: 'https://example.com/video1.mp4'
    },
    {
      id: 2,
      adset_id: 1,
      name: 'Criativo Carrossel - Produtos',
      status: 'ACTIVE',
      format: 'CAROUSEL',
      impressions: 20000,
      clicks: 440,
      ctr: 2.2,
      cpc: 0.82,
      conversions: 9,
      creative_url: 'https://example.com/carousel1'
    },
    {
      id: 3,
      adset_id: 2,
      name: 'Imagem Única - Oferta Especial',
      status: 'ACTIVE',
      format: 'SINGLE_IMAGE',
      impressions: 30000,
      clicks: 600,
      ctr: 2.0,
      cpc: 0.80,
      conversions: 12,
      creative_url: 'https://example.com/image1.jpg'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'PENDING_REVIEW': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Ativa'
      case 'PAUSED': return 'Pausada'
      case 'REJECTED': return 'Rejeitada'
      case 'PENDING_REVIEW': return 'Em Análise'
      default: return status
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value)
  }



  const AdSetForm = ({ adSet = null, onClose }: { adSet?: any, onClose: () => void }) => (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>{adSet ? 'Editar Conjunto de Anúncios' : 'Novo Conjunto de Anúncios'}</DialogTitle>
        <DialogDescription>
          Configure o público-alvo e orçamento para seus anúncios
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="adset-name">Nome do Conjunto</Label>
            <Input id="adset-name" defaultValue={adSet?.name} placeholder="Ex: Público Interesse - Moda" />
          </div>
          <div>
            <Label htmlFor="campaign-select">Campanha</Label>
            <Select defaultValue={adSet?.campaign_id?.toString()}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a campanha" />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map(campaign => (
                  <SelectItem key={campaign.id} value={campaign.id.toString()}>
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="adset-budget">Orçamento Diário (R$)</Label>
            <Input id="adset-budget" type="number" defaultValue={adSet?.budget} placeholder="150" />
          </div>
          <div>
            <Label htmlFor="adset-status">Status</Label>
            <Select defaultValue={adSet?.status || 'PAUSED'}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Ativo</SelectItem>
                <SelectItem value="PAUSED">Pausado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="targeting">Segmentação</Label>
          <Textarea 
            id="targeting" 
            defaultValue={adSet?.targeting}
            placeholder="Ex: Mulheres, 25-45 anos, Interesse: Moda, Localização: Brasil"
            className="min-h-[80px]"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="age-min">Idade Mínima</Label>
            <Input id="age-min" type="number" placeholder="18" />
          </div>
          <div>
            <Label htmlFor="age-max">Idade Máxima</Label>
            <Input id="age-max" type="number" placeholder="65" />
          </div>
          <div>
            <Label htmlFor="gender">Gênero</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="male">Masculino</SelectItem>
                <SelectItem value="female">Feminino</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={onClose}>
          {adSet ? 'Atualizar' : 'Criar'} Conjunto
        </Button>
      </div>
    </DialogContent>
  )

  const AdForm = ({ ad = null, onClose }: { ad?: any, onClose: () => void }) => (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>{ad ? 'Editar Anúncio' : 'Novo Anúncio'}</DialogTitle>
        <DialogDescription>
          Configure o criativo e formato do seu anúncio
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ad-name">Nome do Anúncio</Label>
            <Input id="ad-name" defaultValue={ad?.name} placeholder="Ex: Criativo Vídeo - Coleção Verão" />
          </div>
          <div>
            <Label htmlFor="adset-select">Conjunto de Anúncios</Label>
            <Select defaultValue={ad?.adset_id?.toString()}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o conjunto" />
              </SelectTrigger>
              <SelectContent>
                {adSets.map(adSet => (
                  <SelectItem key={adSet.id} value={adSet.id.toString()}>
                    {adSet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ad-format">Formato</Label>
            <Select defaultValue={ad?.format || 'SINGLE_IMAGE'}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SINGLE_IMAGE">Imagem Única</SelectItem>
                <SelectItem value="VIDEO">Vídeo</SelectItem>
                <SelectItem value="CAROUSEL">Carrossel</SelectItem>
                <SelectItem value="COLLECTION">Coleção</SelectItem>
                <SelectItem value="SLIDESHOW">Slideshow</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="ad-status">Status</Label>
            <Select defaultValue={ad?.status || 'PAUSED'}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Ativo</SelectItem>
                <SelectItem value="PAUSED">Pausado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="creative-url">URL do Criativo</Label>
          <Input id="creative-url" defaultValue={ad?.creative_url} placeholder="https://example.com/image.jpg" />
        </div>
        <div>
          <Label htmlFor="ad-copy">Texto do Anúncio</Label>
          <Textarea 
            id="ad-copy" 
            placeholder="Escreva o texto principal do seu anúncio..."
            className="min-h-[100px]"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="headline">Título</Label>
            <Input id="headline" placeholder="Título chamativo" />
          </div>
          <div>
            <Label htmlFor="cta">Call to Action</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione CTA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LEARN_MORE">Saiba Mais</SelectItem>
                <SelectItem value="SHOP_NOW">Compre Agora</SelectItem>
                <SelectItem value="SIGN_UP">Inscreva-se</SelectItem>
                <SelectItem value="DOWNLOAD">Download</SelectItem>
                <SelectItem value="CONTACT_US">Entre em Contato</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={onClose}>
          {ad ? 'Atualizar' : 'Criar'} Anúncio
        </Button>
      </div>
    </DialogContent>
  )

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meta Ads Manager</h1>
          <p className="text-muted-foreground">
            Gerencie campanhas, conjuntos de anúncios e anúncios usando a Marketing API v23.0
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sincronizar
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                  <Icon className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="flex items-center mt-2">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {metric.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="adsets">Conjuntos de Anúncios</TabsTrigger>
          <TabsTrigger value="ads">Anúncios</TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Campanhas</CardTitle>
                  <CardDescription>
                    Gerencie suas campanhas do Meta Ads. Crie campanhas com diferentes objetivos como conversões, tráfego e alcance.
                  </CardDescription>
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Campanha
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[90vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Criar Nova Campanha Meta</SheetTitle>
                      <SheetDescription>
                        Configure sua campanha seguindo os passos abaixo
                      </SheetDescription>
                    </SheetHeader>

                    {/* Stepper */}
                    <div className="flex items-center justify-center mb-6">
                      <div className="flex items-center space-x-4">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                          1
                        </div>
                        <div className={`h-1 w-16 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                          2
                        </div>
                        <div className={`h-1 w-16 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                          3
                        </div>
                      </div>
                    </div>

                    {/* Container para todos os steps */}
                    <div>
                      {/* Step 1: Informações Básicas */}
                    {step === 1 && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-6 flex items-center">
                            <Settings className="h-5 w-5 mr-2 text-blue-600" />
                            Informações Básicas
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
                              <div>
                                <label className="block text-sm font-medium mb-2">Nome da Campanha</label>
                              <Input
                                value={campaignName}
                                onChange={(e) => setCampaignName(e.target.value)}
                                placeholder="Digite o nome da campanha"
                                className={!step1Validation.isValid && campaignName.length > 0 ? 'border-red-500' : ''}
                              />
                              {!step1Validation.isValid && campaignName.length > 0 && (
                                <div className="mt-1 space-y-1">
                                  {step1Validation.errors.filter(error => error.includes('Nome')).map((error, index) => (
                                    <p key={index} className="text-sm text-red-600 flex items-center">
                                      <AlertTriangle className="h-4 w-4 mr-1" />
                                      {error}
                                    </p>
                                  ))}
                                </div>
                              )}
                              </div>
                            </CardContent>
                          </Card>

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
                            <CardContent>
                              <div>
                              <label className="block text-sm font-medium mb-4">Objetivo da Campanha</label>
                              <RadioGroup value={objective} onValueChange={setObjective}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {campaignObjectives.map((obj) => (
                                    <Tooltip key={obj.id}>
                                      <TooltipTrigger asChild>
                                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                          <RadioGroupItem value={obj.id} id={obj.id} />
                                          <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                              {obj.icon}
                                              <label htmlFor={obj.id} className="font-medium cursor-pointer">
                                                {obj.name}
                                              </label>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">{obj.description}</p>
                                          </div>
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent side="top" className="max-w-xs">
                                        <p>{obj.tooltip}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  ))}
                                </div>
                              </RadioGroup>
                              {!objective && step1Validation.errors.some(error => error.includes('Objetivo')) && (
                                <div className="mt-2">
                                  <p className="text-sm text-red-600 flex items-center">
                                    <AlertTriangle className="h-4 w-4 mr-1" />
                                    Objetivo da campanha é obrigatório
                                  </p>
                                </div>
                              )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Orçamento e Lances */}
                    {step === 2 && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-6 flex items-center">
                            <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                            Orçamento e Lances
                          </h3>
                          
                          {/* Card para Advantage+ Budget */}
                          <Card className="mb-6">
                            <CardContent className="p-4">
                              <div className="bg-blue-50 p-4 rounded-lg border-blue-200 border">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Zap className="h-5 w-5 text-blue-600" />
                                    <label className="text-sm font-medium text-blue-900">
                                      Orçamento de campanha Advantage+
                                    </label>
                                  </div>
                                  <p className="text-sm text-blue-700">
                                    Distribua seu orçamento entre conjuntos de anúncios para gerar mais resultados. Você pode controlar os gastos para cada conjunto de anúncios.
                                  </p>
                                </div>
                                <Switch
                                  checked={advantageBudget}
                                  onCheckedChange={setAdvantageBudget}
                                />
                              </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Card para Configuração de Orçamento */}
                          <Card className="mb-6">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base flex items-center">
                                <Calculator className="h-4 w-4 mr-2 text-green-600" />
                                Configuração de Orçamento
                              </CardTitle>
                              <CardDescription>
                                {advantageBudget ? 'Orçamento gerenciado automaticamente pela Meta' : 'Configure seu orçamento manualmente'}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              {/* Campos de orçamento manual - só aparecem quando Advantage+ está desativado */}
                              {!advantageBudget && (
                              <>
                                <div>
                                  <label className="block text-sm font-medium mb-2">Tipo de Orçamento</label>
                                  <RadioGroup value={budgetType} onValueChange={(value: 'DAILY' | 'LIFETIME') => setBudgetType(value)}>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="DAILY" id="daily" />
                                      <label htmlFor="daily">Orçamento Diário</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="LIFETIME" id="lifetime" />
                                      <label htmlFor="lifetime">Orçamento Total</label>
                                    </div>
                                  </RadioGroup>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium mb-2">
                                    {budgetType === 'DAILY' ? 'Orçamento Diário (R$)' : 'Orçamento Total (R$)'}
                                  </label>
                                  <Input
                                    type="number"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    placeholder="0.00"
                                    min="1"
                                    step="0.01"
                                    className={cn(
                                      !step2Validation.isValid && step2Validation.errors.some(error => error.includes('orçamento')) 
                                        ? "border-red-500 focus:border-red-500" 
                                        : ""
                                    )}
                                  />
                                  {!step2Validation.isValid && step2Validation.errors.some(error => error.includes('orçamento')) && (
                                    <div className="mt-2">
                                      <p className="text-sm text-red-600 flex items-center">
                                        <AlertTriangle className="h-4 w-4 mr-1" />
                                        {step2Validation.errors.find(error => error.includes('orçamento'))}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}

                            {/* Mensagem quando Advantage+ está ativo */}
                            {advantageBudget && (
                              <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Target className="h-5 w-5 text-green-600" />
                                  <span className="text-sm font-medium text-green-900">
                                    Gerenciamento Automático Ativo
                                  </span>
                                </div>
                                <p className="text-sm text-green-700">
                                  A Meta otimizará automaticamente a distribuição do orçamento entre seus conjuntos de anúncios para maximizar os resultados.
                                </p>
                              </div>
                            )}
                            </CardContent>
                          </Card>

                          {/* Card para Estratégias de Lance */}
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base flex items-center">
                                <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
                                Estratégia de Lance
                              </CardTitle>
                              <CardDescription>
                                Escolha como você deseja que a Meta gerencie seus lances
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div>
                                <label className="block text-sm font-medium mb-2">Estratégia de Lance</label>
                              <RadioGroup value={bidStrategy} onValueChange={setBidStrategy}>
                                {bidStrategies.map((strategy) => (
                                  <Tooltip key={strategy.id}>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <RadioGroupItem value={strategy.id} id={strategy.id} className="mt-1" />
                                        <div>
                                          <label htmlFor={strategy.id} className="font-medium cursor-pointer">
                                            {strategy.name}
                                          </label>
                                          <p className="text-sm text-gray-600">{strategy.description}</p>
                                        </div>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="max-w-xs">
                                      <p>{strategy.tooltip}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                ))}
                              </RadioGroup>
                            </div>

                            {(bidStrategy === 'LOWEST_COST_WITH_BID_CAP' || bidStrategy === 'TARGET_COST') && (
                              <div>
                                <label className="block text-sm font-medium mb-2">
                                  {bidStrategy === 'LOWEST_COST_WITH_BID_CAP' ? 'Limite de Lance (R$)' : 'Custo Desejado (R$)'}
                                </label>
                                <Input
                                  type="number"
                                  value={bidAmount}
                                  onChange={(e) => setBidAmount(e.target.value)}
                                  placeholder="0.00"
                                  min="0.01"
                                  step="0.01"
                                  className={cn(
                                    !step2Validation.isValid && step2Validation.errors.some(error => error.includes('lance') || error.includes('custo')) 
                                      ? "border-red-500 focus:border-red-500" 
                                      : ""
                                  )}
                                />
                                {!step2Validation.isValid && step2Validation.errors.some(error => error.includes('lance') || error.includes('custo')) && (
                                  <div className="mt-2">
                                    <p className="text-sm text-red-600 flex items-center">
                                      <AlertTriangle className="h-4 w-4 mr-1" />
                                      {step2Validation.errors.find(error => error.includes('lance') || error.includes('custo'))}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                            </CardContent>
                          </Card>

                          <Separator />

                            {/* A/B Testing */}
                            <div className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                  <TestTube className="h-5 w-5 text-purple-600" />
                                  <label className="text-sm font-medium">Teste A/B</label>
                                </div>
                                <Switch
                                  checked={abTestEnabled}
                                  onCheckedChange={setAbTestEnabled}
                                />
                              </div>
                              
                              {abTestEnabled && (
                                <div className="space-y-4">
                                  <p className="text-sm text-gray-600">
                                    Para testar a eficiência e o desempenho dos anúncios, compare versões e veja qual funciona melhor. Para fazer isso, você pode testar diferentes versões de seus anúncios, públicos ou posicionamentos.
                                  </p>
                                  
                                  <div>
                                    <label className="block text-sm font-medium mb-2">Variável do teste</label>
                                    <Select value={abTestVariable} onValueChange={setAbTestVariable}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione a variável" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="creative">Criativo</SelectItem>
                                        <SelectItem value="audience">Público</SelectItem>
                                        <SelectItem value="placement">Posicionamento</SelectItem>
                                        <SelectItem value="delivery_optimization">Otimização de entrega</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium mb-2">Divisão do orçamento (%)</label>
                                    <div className="flex items-center space-x-4">
                                      <div className="flex-1">
                                        <Input
                                          type="range"
                                          min="10"
                                          max="90"
                                          value={abTestBudgetSplit}
                                          onChange={(e) => setAbTestBudgetSplit(e.target.value)}
                                          className="w-full"
                                        />
                                      </div>
                                      <div className="text-sm font-medium min-w-[80px]">
                                        {abTestBudgetSplit}% / {100 - parseInt(abTestBudgetSplit)}%
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Special Ad Categories */}
                            <div className="p-4 border rounded-lg">
                              <div className="flex items-center space-x-2 mb-4">
                                <Shield className="h-5 w-5 text-orange-600" />
                                <label className="text-sm font-medium">Categorias de anúncio especial</label>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-4">
                                Declare se seus anúncios são relacionados a candidatos e políticas para eleições ou questões políticas, emprego, moradia, crédito, serviços financeiros, emprego, moradia, crédito, questões sociais, eleições ou política.
                              </p>

                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2">Categorias Especiais</label>
                                  <div className="space-y-2">
                                    {[
                                      { 
                                        value: 'EMPLOYMENT', 
                                        label: 'Emprego', 
                                        description: 'Anúncios relacionados a oportunidades de trabalho',
                                        tooltip: 'Anúncios que promovem oportunidades de emprego, recrutamento ou serviços relacionados ao trabalho. Requer verificação adicional e pode ter restrições de segmentação.'
                                      },
                                      { 
                                        value: 'HOUSING', 
                                        label: 'Moradia', 
                                        description: 'Anúncios de imóveis, aluguel ou venda',
                                        tooltip: 'Anúncios relacionados à venda, aluguel ou financiamento de imóveis. Sujeito a leis de habitação justa e restrições de segmentação.'
                                      },
                                      { 
                                        value: 'CREDIT', 
                                        label: 'Crédito', 
                                        description: 'Produtos e serviços financeiros',
                                        tooltip: 'Anúncios de produtos financeiros como empréstimos, cartões de crédito ou serviços bancários. Requer conformidade com regulamentações financeiras.'
                                      },
                                      { 
                                        value: 'ISSUES_ELECTIONS_POLITICS', 
                                        label: 'Eleições ou Política', 
                                        description: 'Conteúdo político ou questões sociais',
                                        tooltip: 'Anúncios sobre candidatos, partidos políticos, eleições ou questões de interesse público. Requer autorização e transparência adicional.'
                                      }
                                    ].map((category) => (
                                      <Tooltip key={category.value}>
                                        <TooltipTrigger asChild>
                                          <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-help">
                                            <input
                                              type="checkbox"
                                              id={category.value}
                                              checked={specialAdCategories.includes(category.value)}
                                              onChange={(e) => {
                                                if (e.target.checked) {
                                                  setSpecialAdCategories([...specialAdCategories, category.value])
                                                } else {
                                                  setSpecialAdCategories(specialAdCategories.filter(cat => cat !== category.value))
                                                }
                                              }}
                                              className="mt-1"
                                            />
                                            <div className="flex-1">
                                              <label htmlFor={category.value} className="block text-sm font-medium cursor-pointer">
                                                {category.label}
                                              </label>
                                              <p className="text-xs text-gray-500">{category.description}</p>
                                            </div>
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="max-w-xs">{category.tooltip}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    ))}
                                  </div>
                                </div>

                                {specialAdCategories.includes('ISSUES_ELECTIONS_POLITICS') && (
                                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <label className="block text-sm font-medium mb-2">País/região da política *</label>
                                    <Select value={politicalCountry} onValueChange={setPoliticalCountry}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione o país" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="BR">Brasil</SelectItem>
                                        <SelectItem value="US">Estados Unidos</SelectItem>
                                        <SelectItem value="CA">Canadá</SelectItem>
                                        <SelectItem value="GB">Reino Unido</SelectItem>
                                        <SelectItem value="AU">Austrália</SelectItem>
                                        <SelectItem value="DE">Alemanha</SelectItem>
                                        <SelectItem value="FR">França</SelectItem>
                                        <SelectItem value="IT">Itália</SelectItem>
                                        <SelectItem value="ES">Espanha</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <p className="text-xs text-yellow-700 mt-1">
                                      Obrigatório para anúncios políticos
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Advantage+ Audience */}
                            <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                  <UserCheck className="h-5 w-5 text-blue-600" />
                                  <label className="text-sm font-medium text-blue-900">Público Advantage+</label>
                                </div>
                                <Switch
                                  checked={advantageAudience}
                                  onCheckedChange={setAdvantageAudience}
                                />
                              </div>
                              
                              <p className="text-sm text-blue-700 mb-4">
                                Use machine learning para encontrar automaticamente as pessoas que têm mais probabilidade de estar interessadas nos seus anúncios. Você pode fornecer sugestões de público opcionais.
                              </p>

                              {!advantageAudience && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium mb-2">Idade mínima</label>
                                      <Select value={audienceMinAge} onValueChange={setAudienceMinAge}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {Array.from({ length: 48 }, (_, i) => i + 18).map(age => (
                                            <SelectItem key={age} value={age.toString()}>{age}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-2">Idade máxima</label>
                                      <Select value={audienceMaxAge} onValueChange={setAudienceMaxAge}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {Array.from({ length: 48 }, (_, i) => i + 18).map(age => (
                                            <SelectItem key={age} value={age.toString()}>{age}</SelectItem>
                                          ))}
                                          <SelectItem value="65+">65+</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Placements */}
                            <div className="p-4 border rounded-lg">
                              <div className="flex items-center space-x-2 mb-4">
                                <Layers className="h-5 w-5 text-green-600" />
                                <label className="text-sm font-medium">Posicionamentos</label>
                              </div>
                              
                              <div className="space-y-4">
                                <RadioGroup value={placementType} onValueChange={setPlacementType}>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="automatic" id="automatic" />
                                    <div>
                                      <label htmlFor="automatic" className="font-medium cursor-pointer">Posicionamentos automáticos (recomendado)</label>
                                      <p className="text-sm text-gray-600">A Meta otimizará automaticamente onde seus anúncios aparecem para obter os melhores resultados.</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="manual" id="manual" />
                                    <div>
                                      <label htmlFor="manual" className="font-medium cursor-pointer">Posicionamentos manuais</label>
                                      <p className="text-sm text-gray-600">Escolha onde seus anúncios aparecerão.</p>
                                    </div>
                                  </div>
                                </RadioGroup>

                                {placementType === 'manual' && (
                                  <div className="space-y-2">
                                    <label className="block text-sm font-medium">Selecione os posicionamentos:</label>
                                    <div className="grid grid-cols-2 gap-2">
                                      {[
                                        { id: 'facebook_feed', name: 'Feed do Facebook' },
                                        { id: 'instagram_feed', name: 'Feed do Instagram' },
                                        { id: 'instagram_stories', name: 'Stories do Instagram' },
                                        { id: 'facebook_stories', name: 'Stories do Facebook' },
                                        { id: 'messenger', name: 'Messenger' },
                                        { id: 'audience_network', name: 'Audience Network' },
                                        { id: 'facebook_reels', name: 'Reels do Facebook' },
                                        { id: 'instagram_reels', name: 'Reels do Instagram' }
                                      ].map(placement => (
                                        <div key={placement.id} className="flex items-center space-x-2">
                                          <input
                                            type="checkbox"
                                            id={placement.id}
                                            checked={selectedPlacements.includes(placement.id)}
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                setSelectedPlacements([...selectedPlacements, placement.id])
                                              } else {
                                                setSelectedPlacements(selectedPlacements.filter(p => p !== placement.id))
                                              }
                                            }}
                                            className="rounded"
                                          />
                                          <label htmlFor={placement.id} className="text-sm cursor-pointer">
                                            {placement.name}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Recognition */}
                            {objective === 'AWARENESS' && (
                              <div className="p-4 border rounded-lg bg-purple-50 border-purple-200">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center space-x-2">
                                    <Eye className="h-5 w-5 text-purple-600" />
                                    <label className="text-sm font-medium text-purple-900">Reconhecimento</label>
                                  </div>
                                  <Switch
                                    checked={recognitionEnabled}
                                    onCheckedChange={setRecognitionEnabled}
                                  />
                                </div>
                                
                                {recognitionEnabled && (
                                  <div className="space-y-4">
                                    <p className="text-sm text-purple-700">
                                      Otimize para pessoas que têm mais probabilidade de se lembrar dos seus anúncios.
                                    </p>
                                    
                                    <div>
                                      <label className="block text-sm font-medium mb-2">Tipo de público para reconhecimento</label>
                                      <RadioGroup value={recognitionAudienceType} onValueChange={setRecognitionAudienceType}>
                                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="balanced" id="balanced" />
                                          <label htmlFor="balanced" className="text-sm cursor-pointer">Equilibrado</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="broader" id="broader" />
                                          <label htmlFor="broader" className="text-sm cursor-pointer">Mais amplo</label>
                                        </div>
                                      </RadioGroup>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                    )}

                    {/* Step 3: Programação */}
                    {step === 3 && (
                      <div className="space-y-6">
                        <div className="flex items-center space-x-2 mb-6">
                          <Calendar className="h-5 w-5 text-green-600" />
                          <h3 className="text-lg font-semibold">Programação</h3>
                        </div>
                        
                        {/* Card para Cronograma */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-green-600" />
                              Cronograma da Campanha
                            </CardTitle>
                            <CardDescription>
                              Defina quando sua campanha deve começar e terminar
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">Data de Início</label>
                              <Input
                                type="datetime-local"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className={cn(
                                  !step3Validation.isValid && step3Validation.errors.some(error => error.includes('início')) 
                                    ? "border-red-500 focus:border-red-500" 
                                    : ""
                                )}
                              />
                              {!step3Validation.isValid && step3Validation.errors.some(error => error.includes('início')) && (
                                <div className="mt-2">
                                  <p className="text-sm text-red-600 flex items-center">
                                    <AlertTriangle className="h-4 w-4 mr-1" />
                                    {step3Validation.errors.find(error => error.includes('início'))}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">Data de Término (Opcional)</label>
                              <Input
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className={cn(
                                  !step3Validation.isValid && step3Validation.errors.some(error => error.includes('término')) 
                                    ? "border-red-500 focus:border-red-500" 
                                    : ""
                                )}
                              />
                              {!step3Validation.isValid && step3Validation.errors.some(error => error.includes('término')) && (
                                <div className="mt-2">
                                  <p className="text-sm text-red-600 flex items-center">
                                    <AlertTriangle className="h-4 w-4 mr-1" />
                                    {step3Validation.errors.find(error => error.includes('término'))}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          </CardContent>
                          </Card>

                        <Separator />

                        <Card>
                          <CardHeader>
                            <div className="flex items-center space-x-2">
                              <Calculator className="h-5 w-5 text-blue-600" />
                              <CardTitle>Resumo da Campanha</CardTitle>
                            </div>
                            <CardDescription>
                              Revisão final das configurações da sua campanha
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2 text-sm">
                            <p><strong>Nome:</strong> {campaignName}</p>
                            <p><strong>Objetivo:</strong> {campaignObjectives.find(obj => obj.id === objective)?.name}</p>
                            
                            {/* Informações de orçamento baseadas no tipo */}
                            {advantageBudget ? (
                              <div className="flex items-center space-x-2">
                                <Zap className="h-4 w-4 text-blue-600" />
                                <span><strong>Orçamento:</strong> Advantage+ (Gerenciado pela Meta)</span>
                              </div>
                            ) : (
                              <p><strong>Orçamento:</strong> R$ {budget} ({budgetType === 'DAILY' ? 'diário' : 'total'})</p>
                            )}
                            
                            <p><strong>Estratégia:</strong> {bidStrategies.find(strategy => strategy.id === bidStrategy)?.name}</p>
                            {bidAmount && <p><strong>Valor do Lance:</strong> R$ {bidAmount}</p>}
                            
                            {/* Informações das novas funcionalidades */}
                            {abTestEnabled && (
                              <div className="flex items-center space-x-2">
                                <TestTube className="h-4 w-4 text-purple-600" />
                                <span><strong>Teste A/B:</strong> {abTestVariable} ({abTestBudgetSplit}%/{100 - parseInt(abTestBudgetSplit)}%)</span>
                              </div>
                            )}
                            
                            {specialAdCategories.length > 0 && (
                              <div className="flex items-center space-x-2">
                                <Shield className="h-4 w-4 text-orange-600" />
                                <span><strong>Categorias Especiais:</strong> {
                                  specialAdCategories.map(cat => {
                                    switch(cat) {
                                      case 'EMPLOYMENT': return 'Emprego'
                                      case 'HOUSING': return 'Moradia'
                                      case 'CREDIT': return 'Crédito'
                                      case 'ISSUES_ELECTIONS_POLITICS': return 'Eleições/Política'
                                      default: return cat
                                    }
                                  }).join(', ')
                                }</span>
                              </div>
                            )}
                            
                            {advantageAudience && (
                              <div className="flex items-center space-x-2">
                                <UserCheck className="h-4 w-4 text-blue-600" />
                                <span><strong>Público:</strong> Advantage+ (Automático)</span>
                              </div>
                            )}
                            
                            {placementType === 'manual' && selectedPlacements.length > 0 && (
                              <div className="flex items-center space-x-2">
                                <Layers className="h-4 w-4 text-green-600" />
                                <span><strong>Posicionamentos:</strong> {selectedPlacements.length} selecionados</span>
                              </div>
                            )}
                            
                            {recognitionEnabled && (
                              <div className="flex items-center space-x-2">
                                <Eye className="h-4 w-4 text-purple-600" />
                                <span><strong>Reconhecimento:</strong> {recognitionAudienceType === 'balanced' ? 'Equilibrado' : 'Mais amplo'}</span>
                              </div>
                            )}
                            
                            <p><strong>Início:</strong> {startDate ? new Date(startDate).toLocaleString('pt-BR') : 'Não definido'}</p>
                            {endDate && <p><strong>Término:</strong> {new Date(endDate).toLocaleString('pt-BR')}</p>}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                    </div>

                    <SheetFooter className="flex justify-between">
                      <div className="flex space-x-2">
                        <SheetClose asChild>
                          <Button variant="outline" onClick={resetForm}>Cancelar</Button>
                        </SheetClose>
                        {step > 1 && (
                          <Button variant="outline" onClick={prevStep}>
                            Voltar
                          </Button>
                        )}
                      </div>
                      
                      <div>
                        {step < 3 ? (
                          <Button 
                            onClick={nextStep}
                            disabled={step === 1 && !canProceedStep1}
                          >
                            Próximo
                          </Button>
                        ) : (
                          <SheetClose asChild>
                            <Button 
                            onClick={handleCreateCampaign}
                            disabled={!canCreateCampaign || loading}
                          >
                            {loading ? 'Criando...' : 'Criar Campanha'}
                            </Button>
                          </SheetClose>
                        )}
                      </div>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar campanhas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="ACTIVE">Ativas</SelectItem>
                    <SelectItem value="PAUSED">Pausadas</SelectItem>
                    <SelectItem value="REJECTED">Rejeitadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Objetivo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Orçamento</TableHead>
                    <TableHead>Gasto</TableHead>
                    <TableHead>Impressões</TableHead>
                    <TableHead>Cliques</TableHead>
                    <TableHead>CTR</TableHead>
                    <TableHead>CPC</TableHead>
                    <TableHead>ROAS</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>{campaign.objective}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(campaign.status)}>
                          {getStatusText(campaign.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(campaign.budget)}/dia</TableCell>
                      <TableCell>{formatCurrency(campaign.spent)}</TableCell>
                      <TableCell>{formatNumber(campaign.impressions)}</TableCell>
                      <TableCell>{formatNumber(campaign.clicks)}</TableCell>
                      <TableCell>{campaign.ctr}%</TableCell>
                      <TableCell>{formatCurrency(campaign.cpc)}</TableCell>
                      <TableCell>{campaign.roas}x</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            {campaign.status === 'ACTIVE' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => navigate(`../campaigns/edit/${campaign.id}`)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ad Sets Tab */}
        <TabsContent value="adsets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Conjuntos de Anúncios</CardTitle>
                  <CardDescription>
                    Configure públicos-alvo, orçamentos e estratégias de lances para seus anúncios.
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Conjunto
                    </Button>
                  </DialogTrigger>
                  <AdSetForm onClose={() => {}} />
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Campanha</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Segmentação</TableHead>
                    <TableHead>Orçamento</TableHead>
                    <TableHead>Gasto</TableHead>
                    <TableHead>Impressões</TableHead>
                    <TableHead>CTR</TableHead>
                    <TableHead>CPC</TableHead>
                    <TableHead>Conversões</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adSets.map((adSet) => (
                    <TableRow key={adSet.id}>
                      <TableCell className="font-medium">{adSet.name}</TableCell>
                      <TableCell>
                        {campaigns.find(c => c.id === adSet.campaign_id)?.name}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(adSet.status)}>
                          {getStatusText(adSet.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{adSet.targeting}</TableCell>
                      <TableCell>{formatCurrency(adSet.budget)}/dia</TableCell>
                      <TableCell>{formatCurrency(adSet.spent)}</TableCell>
                      <TableCell>{formatNumber(adSet.impressions)}</TableCell>
                      <TableCell>{adSet.ctr}%</TableCell>
                      <TableCell>{formatCurrency(adSet.cpc)}</TableCell>
                      <TableCell>{adSet.conversions}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            {adSet.status === 'ACTIVE' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <AdSetForm adSet={adSet} onClose={() => {}} />
                          </Dialog>
                          <Button variant="ghost" size="sm">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ads Tab */}
        <TabsContent value="ads" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Anúncios</CardTitle>
                  <CardDescription>
                    Gerencie os criativos, formatos e conteúdo dos seus anúncios.
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Anúncio
                    </Button>
                  </DialogTrigger>
                  <AdForm onClose={() => {}} />
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Conjunto</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Formato</TableHead>
                    <TableHead>Impressões</TableHead>
                    <TableHead>Cliques</TableHead>
                    <TableHead>CTR</TableHead>
                    <TableHead>CPC</TableHead>
                    <TableHead>Conversões</TableHead>
                    <TableHead>Criativo</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ads.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell className="font-medium">{ad.name}</TableCell>
                      <TableCell>
                        {adSets.find(as => as.id === ad.adset_id)?.name}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(ad.status)}>
                          {getStatusText(ad.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{ad.format}</TableCell>
                      <TableCell>{formatNumber(ad.impressions)}</TableCell>
                      <TableCell>{formatNumber(ad.clicks)}</TableCell>
                      <TableCell>{ad.ctr}%</TableCell>
                      <TableCell>{formatCurrency(ad.cpc)}</TableCell>
                      <TableCell>{ad.conversions}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            {ad.status === 'ACTIVE' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <AdForm ad={ad} onClose={() => {}} />
                          </Dialog>
                          <Button variant="ghost" size="sm">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}