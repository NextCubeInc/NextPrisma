import React from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Puzzle,
  BarChart3,
  Download,
  RefreshCw
} from 'lucide-react'

export default function GoogleAdsPage() {
  const { '*': splat } = useParams<{ '*': string }>()
  const pathParts = splat?.split('/') || []
  const section = pathParts[1] || 'campaigns'

  const metrics = [
    { label: 'Impressões', value: '1.8M', change: '+15%', trend: 'up' },
    { label: 'Cliques', value: '32.1K', change: '+12%', trend: 'up' },
    { label: 'CTR', value: '1.78%', change: '+3%', trend: 'up' },
    { label: 'CPC', value: 'R$ 1.25', change: '-8%', trend: 'down' },
    { label: 'Conversões', value: '890', change: '+22%', trend: 'up' },
    { label: 'ROAS', value: '3.8x', change: '+10%', trend: 'up' }
  ]

  const campaigns = [
    { 
      id: 1, 
      name: 'Pesquisa - Produtos Premium', 
      status: 'Ativa', 
      budget: 'R$ 300/dia',
      spent: 'R$ 285',
      impressions: '95K',
      clicks: '1.8K',
      ctr: '1.89%',
      cpc: 'R$ 1.15'
    },
    { 
      id: 2, 
      name: 'Display - Remarketing', 
      status: 'Ativa', 
      budget: 'R$ 150/dia',
      spent: 'R$ 142',
      impressions: '180K',
      clicks: '2.1K',
      ctr: '1.17%',
      cpc: 'R$ 0.95'
    },
    { 
      id: 3, 
      name: 'Shopping - Catálogo Completo', 
      status: 'Pausada', 
      budget: 'R$ 400/dia',
      spent: 'R$ 0',
      impressions: '0',
      clicks: '0',
      ctr: '0%',
      cpc: 'R$ 0'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativa': return 'bg-green-100 text-green-800'
      case 'Pausada': return 'bg-yellow-100 text-yellow-800'
      case 'Rejeitada': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderContent = () => {
    switch (section) {
      case 'campaigns':
        return (
          <div className="space-y-6">
            {/* Campaigns Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Campanhas</CardTitle>
                    <CardDescription>Gerencie suas campanhas do Google Ads</CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Campanha
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-medium">{campaign.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                            <span className="text-sm text-gray-500">{campaign.budget}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{campaign.impressions}</div>
                          <div className="text-gray-500">Impressões</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{campaign.clicks}</div>
                          <div className="text-gray-500">Cliques</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{campaign.ctr}</div>
                          <div className="text-gray-500">CTR</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{campaign.cpc}</div>
                          <div className="text-gray-500">CPC</div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )
      
      case 'adgroups':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Grupos de Anúncios</CardTitle>
              <CardDescription>Configure grupos de anúncios e palavras-chave</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum grupo de anúncios encontrado</h3>
                <p className="text-gray-500 mb-4">Crie seu primeiro grupo de anúncios para começar</p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Grupo de Anúncios
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      
      case 'ads':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Anúncios</CardTitle>
              <CardDescription>Crie e gerencie seus anúncios do Google</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum anúncio encontrado</h3>
                <p className="text-gray-500 mb-4">Crie seu primeiro anúncio para começar a anunciar</p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Anúncio
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      
      case 'extensions':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Extensões</CardTitle>
              <CardDescription>Adicione extensões para melhorar seus anúncios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Puzzle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma extensão configurada</h3>
                <p className="text-gray-500 mb-4">Adicione extensões para melhorar a performance dos seus anúncios</p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Extensão
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      
      default:
        return (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Seção não encontrada</h3>
                <p className="text-gray-500">A seção solicitada não existe</p>
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header with Tabs */}
      <div className="bg-card border-b px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Google Ads Manager</h2>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Criar Campanha
          </Button>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-1">
          <Button
            variant="default"
            className="px-4 py-2 text-sm font-medium rounded-md"
          >
            <Target className="w-4 h-4 mr-2" />
            Campanhas
            <Badge variant="secondary" className="ml-2">
              {campaigns.length}
            </Badge>
          </Button>
          <Button
            variant="ghost"
            className="px-4 py-2 text-sm font-medium rounded-md"
          >
            <Users className="w-4 h-4 mr-2" />
            Grupos de Anúncios
            <Badge variant="secondary" className="ml-2">
              0
            </Badge>
          </Button>
          <Button
            variant="ghost"
            className="px-4 py-2 text-sm font-medium rounded-md"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Anúncios
            <Badge variant="secondary" className="ml-2">
              0
            </Badge>
          </Button>
          <Button
            variant="ghost"
            className="px-4 py-2 text-sm font-medium rounded-md"
          >
            <Puzzle className="w-4 h-4 mr-2" />
            Extensões
            <Badge variant="secondary" className="ml-2">
              0
            </Badge>
          </Button>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="paused">Pausado</SelectItem>
              <SelectItem value="ended">Finalizado</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all-time">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="yesterday">Ontem</SelectItem>
              <SelectItem value="last-7-days">Últimos 7 dias</SelectItem>
              <SelectItem value="last-30-days">Últimos 30 dias</SelectItem>
              <SelectItem value="all-time">Todo o período</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Mais Filtros
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Visão Geral das Métricas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
              <div className={`text-xs mt-1 ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change} vs. período anterior
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {renderContent()}
    </div>
  )
}