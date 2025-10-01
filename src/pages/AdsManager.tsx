import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Calendar, CalendarDays, Plus, Search, Filter, Download, BarChart3, Copy, Edit, TestTube, MoreHorizontal, Play, Pause, Trash2 } from 'lucide-react'
import { CampaignsTable } from '@/components/ads/CampaignsTable'
import { AdSetsTable } from '@/components/ads/AdSetsTable'
import { AdsTable } from '@/components/ads/AdsTable'
import { CreateCampaignModal } from '@/components/ads/CreateCampaignModal'

interface Campaign {
  id: string
  name: string
  status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED'
  objective: string
  budget: number
  budget_type: 'DAILY' | 'LIFETIME'
  bid_strategy: string
  results: number
  reach: number
  impressions: number
  cost_per_result: number
  spend: number
  created_at: string
}

interface AdSet {
  id: string
  campaign_id: string
  name: string
  status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED'
  targeting: any
  budget: number
  results: number
  reach: number
  impressions: number
  ctr: number
  spend: number
}

interface Ad {
  id: string
  adset_id: string
  name: string
  status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED'
  format: string
  results: number
  reach: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  spend: number
}

export default function AdsManager() {
  const { user } = useAuth()
  const { activeClient, checkPlanLimit } = useWorkspace()
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [adSets, setAdSets] = useState<AdSet[]>([])
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateRange, setDateRange] = useState('7')
  const [activeTab, setActiveTab] = useState('campaigns')
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Carregar dados
  useEffect(() => {
    if (user && activeClient) {
      loadAdsData()
    }
  }, [user, activeClient])

  const loadAdsData = async () => {
    try {
      setLoading(true)
      
      // Buscar campanhas
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('ads_campaigns')
        .select('*')
        .eq('account_id', activeClient.id)
        .order('created_at', { ascending: false })

      if (campaignsError) throw campaignsError
      setCampaigns(campaignsData || [])

      // Buscar conjuntos de anúncios
      const { data: adSetsData, error: adSetsError } = await supabase
        .from('ads_sets')
        .select('*')
        .in('campaign_id', campaignsData?.map(c => c.id) || [])
        .order('created_at', { ascending: false })

      if (adSetsError) throw adSetsError
      setAdSets(adSetsData || [])

      // Buscar anúncios
      const { data: adsData, error: adsError } = await supabase
        .from('ads')
        .select('*')
        .in('adset_id', adSetsData?.map(a => a.id) || [])
        .order('created_at', { ascending: false })

      if (adsError) throw adsError
      setAds(adsData || [])

    } catch (error) {
      console.error('Erro ao carregar dados dos anúncios:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCampaign = async () => {
    // Verificar limite do plano
    const canCreate = await checkPlanLimit('campaigns', campaigns.length)
    if (!canCreate) {
      // Modal de upgrade será mostrado pelo checkPlanLimit
      return
    }
    
    setShowCreateModal(true)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'default'
      case 'PAUSED': return 'secondary'
      case 'DELETED': return 'destructive'
      case 'ARCHIVED': return 'outline'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <Play className="h-3 w-3" />
      case 'PAUSED': return <Pause className="h-3 w-3" />
      case 'DELETED': return <Trash2 className="h-3 w-3" />
      default: return <Pause className="h-3 w-3" />
    }
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter.toUpperCase()
    return matchesSearch && matchesStatus
  })

  const filteredAdSets = adSets.filter(adSet => {
    const matchesSearch = adSet.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || adSet.status === statusFilter.toUpperCase()
    return matchesSearch && matchesStatus
  })

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ad.status === statusFilter.toUpperCase()
    return matchesSearch && matchesStatus
  })

  if (!activeClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Selecione um cliente para gerenciar anúncios</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciador de Anúncios</h1>
          <p className="text-muted-foreground">Cliente: {activeClient.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleCreateCampaign} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Criar Campanha
          </Button>
        </div>
      </div>

      {/* Filtros e Ações */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Filtros de Status */}
            <div className="flex items-center gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                Todos os anúncios
              </Button>
              <Button
                variant={statusFilter === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('active')}
              >
                Ativos
              </Button>
              <Button
                variant={statusFilter === 'paused' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('paused')}
              >
                Pausados
              </Button>
            </div>

            {/* Filtro de Data */}
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-48">
                <CalendarDays className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>

            {/* Busca */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Ações Rápidas */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Duplicar
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button variant="outline" size="sm">
                <TestTube className="h-4 w-4 mr-2" />
                Teste A/B
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Relatórios
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs e Tabelas */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">
            Campanhas ({filteredCampaigns.length})
          </TabsTrigger>
          <TabsTrigger value="adsets">
            Conjuntos de Anúncios ({filteredAdSets.length})
          </TabsTrigger>
          <TabsTrigger value="ads">
            Anúncios ({filteredAds.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="mt-6">
          <CampaignsTable 
            campaigns={filteredCampaigns} 
            loading={loading}
            onRefresh={loadAdsData}
          />
        </TabsContent>

        <TabsContent value="adsets" className="mt-6">
          <AdSetsTable 
            adSets={filteredAdSets} 
            campaigns={campaigns}
            loading={loading}
            onRefresh={loadAdsData}
          />
        </TabsContent>

        <TabsContent value="ads" className="mt-6">
          <AdsTable 
            ads={filteredAds} 
            adSets={adSets}
            loading={loading}
            onRefresh={loadAdsData}
          />
        </TabsContent>
      </Tabs>

      {/* Modal de Criação de Campanha */}
      <CreateCampaignModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={loadAdsData}
      />
    </div>
  )
}