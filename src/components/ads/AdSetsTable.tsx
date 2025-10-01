import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronDown, ChevronRight, MoreHorizontal, Play, Pause, Edit, Copy, Trash2, BarChart3, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'

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

interface Campaign {
  id: string
  name: string
}

interface AdSetsTableProps {
  adSets: AdSet[]
  campaigns: Campaign[]
  loading: boolean
  onRefresh: () => void
}

export function AdSetsTable({ adSets, campaigns, loading, onRefresh }: AdSetsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const toggleRow = (adSetId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(adSetId)) {
      newExpanded.delete(adSetId)
    } else {
      newExpanded.add(adSetId)
    }
    setExpandedRows(newExpanded)
  }

  const getCampaignName = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId)
    return campaign?.name || 'Campanha não encontrada'
  }

  const handleStatusChange = async (adSetId: string, newStatus: string) => {
    try {
      setActionLoading(adSetId)
      
      const { error } = await supabase
        .from('ads_sets')
        .update({ status: newStatus })
        .eq('id', adSetId)

      if (error) throw error
      
      onRefresh()
    } catch (error) {
      console.error('Erro ao alterar status:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDuplicate = async (adSet: AdSet) => {
    try {
      setActionLoading(adSet.id)
      
      const { error } = await supabase
        .from('ads_sets')
        .insert({
          campaign_id: adSet.campaign_id,
          name: `${adSet.name} (Cópia)`,
          status: 'PAUSED',
          targeting: adSet.targeting,
          budget: adSet.budget,
          budget_type: adSet.budget_type
        })

      if (error) throw error
      
      onRefresh()
    } catch (error) {
      console.error('Erro ao duplicar conjunto de anúncios:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (adSetId: string) => {
    if (!confirm('Tem certeza que deseja excluir este conjunto de anúncios?')) return
    
    try {
      setActionLoading(adSetId)
      
      const { error } = await supabase
        .from('ads_sets')
        .update({ status: 'DELETED' })
        .eq('id', adSetId)

      if (error) throw error
      
      onRefresh()
    } catch (error) {
      console.error('Erro ao excluir conjunto de anúncios:', error)
    } finally {
      setActionLoading(null)
    }
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  const getTargetingDescription = (targeting: any) => {
    if (!targeting) return 'Público não definido'
    
    const parts = []
    if (targeting.age_min && targeting.age_max) {
      parts.push(`${targeting.age_min}-${targeting.age_max} anos`)
    }
    if (targeting.genders && targeting.genders.length > 0) {
      const genderMap = { 1: 'Homens', 2: 'Mulheres' }
      parts.push(targeting.genders.map((g: number) => genderMap[g]).join(', '))
    }
    if (targeting.geo_locations && targeting.geo_locations.countries) {
      parts.push(targeting.geo_locations.countries.join(', '))
    }
    
    return parts.length > 0 ? parts.join(' • ') : 'Público amplo'
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="space-y-4 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (adSets.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <Users className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">Nenhum conjunto de anúncios encontrado</h3>
              <p className="text-muted-foreground">
                Crie campanhas primeiro para adicionar conjuntos de anúncios
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>Nome do Conjunto</TableHead>
              <TableHead>Campanha</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Público</TableHead>
              <TableHead>Orçamento</TableHead>
              <TableHead>Resultados</TableHead>
              <TableHead>Alcance</TableHead>
              <TableHead>Impressões</TableHead>
              <TableHead>CTR</TableHead>
              <TableHead>Gasto</TableHead>
              <TableHead className="w-8"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adSets.map((adSet) => (
              <React.Fragment key={adSet.id}>
                <TableRow className="hover:bg-muted/50">
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRow(adSet.id)}
                      className="h-6 w-6 p-0"
                    >
                      {expandedRows.has(adSet.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{adSet.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {getCampaignName(adSet.campaign_id)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(adSet.status)}>
                      {adSet.status === 'ACTIVE' ? 'Ativo' : 
                       adSet.status === 'PAUSED' ? 'Pausado' :
                       adSet.status === 'DELETED' ? 'Excluído' : 'Arquivado'}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-48 truncate">
                    {getTargetingDescription(adSet.targeting)}
                  </TableCell>
                  <TableCell>{formatCurrency(adSet.budget)}</TableCell>
                  <TableCell>{formatNumber(adSet.results)}</TableCell>
                  <TableCell>{formatNumber(adSet.reach)}</TableCell>
                  <TableCell>{formatNumber(adSet.impressions)}</TableCell>
                  <TableCell>{formatPercentage(adSet.ctr)}</TableCell>
                  <TableCell>{formatCurrency(adSet.spend)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          disabled={actionLoading === adSet.id}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {adSet.status === 'ACTIVE' ? (
                          <DropdownMenuItem onClick={() => handleStatusChange(adSet.id, 'PAUSED')}>
                            <Pause className="h-4 w-4 mr-2" />
                            Pausar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleStatusChange(adSet.id, 'ACTIVE')}>
                            <Play className="h-4 w-4 mr-2" />
                            Ativar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDuplicate(adSet)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Ver Relatório
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(adSet.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                
                {expandedRows.has(adSet.id) && (
                  <TableRow>
                    <TableCell colSpan={12} className="bg-muted/30 p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">ID do Conjunto:</span>
                          <p className="text-muted-foreground">{adSet.id}</p>
                        </div>
                        <div>
                          <span className="font-medium">Segmentação:</span>
                          <p className="text-muted-foreground">
                            {getTargetingDescription(adSet.targeting)}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">CPC:</span>
                          <p className="text-muted-foreground">
                            {adSet.impressions > 0 
                              ? formatCurrency(adSet.spend / adSet.impressions)
                              : formatCurrency(0)
                            }
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">CPM:</span>
                          <p className="text-muted-foreground">
                            {adSet.impressions > 0 
                              ? formatCurrency((adSet.spend / adSet.impressions) * 1000)
                              : formatCurrency(0)
                            }
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}