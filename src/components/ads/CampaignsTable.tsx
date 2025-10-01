import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronDown, ChevronRight, MoreHorizontal, Play, Pause, Edit, Copy, Trash2, BarChart3 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

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

interface CampaignsTableProps {
  campaigns: Campaign[]
  loading: boolean
  onRefresh: () => void
}

export function CampaignsTable({ campaigns, loading, onRefresh }: CampaignsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const toggleRow = (campaignId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(campaignId)) {
      newExpanded.delete(campaignId)
    } else {
      newExpanded.add(campaignId)
    }
    setExpandedRows(newExpanded)
  }

  const handleStatusChange = async (campaignId: string, newStatus: string) => {
    try {
      setActionLoading(campaignId)
      
      const { error } = await supabase
        .from('ads_campaigns')
        .update({ status: newStatus })
        .eq('id', campaignId)

      if (error) throw error
      
      onRefresh()
    } catch (error) {
      console.error('Erro ao alterar status:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDuplicate = async (campaign: Campaign) => {
    try {
      setActionLoading(campaign.id)
      
      const { error } = await supabase
        .from('ads_campaigns')
        .insert({
          account_id: campaign.account_id,
          user_id: campaign.user_id,
          name: `${campaign.name} (Cópia)`,
          status: 'PAUSED',
          objective: campaign.objective,
          budget: campaign.budget,
          budget_type: campaign.budget_type,
          bid_strategy: campaign.bid_strategy
        })

      if (error) throw error
      
      onRefresh()
    } catch (error) {
      console.error('Erro ao duplicar campanha:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (campaignId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta campanha?')) return
    
    try {
      setActionLoading(campaignId)
      
      const { error } = await supabase
        .from('ads_campaigns')
        .update({ status: 'DELETED' })
        .eq('id', campaignId)

      if (error) throw error
      
      onRefresh()
    } catch (error) {
      console.error('Erro ao excluir campanha:', error)
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

  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">Nenhuma campanha encontrada</h3>
              <p className="text-muted-foreground">
                Crie sua primeira campanha para começar a anunciar
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
              <TableHead>Nome da Campanha</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Objetivo</TableHead>
              <TableHead>Estratégia de Lance</TableHead>
              <TableHead>Orçamento</TableHead>
              <TableHead>Resultados</TableHead>
              <TableHead>Alcance</TableHead>
              <TableHead>Impressões</TableHead>
              <TableHead>Custo por Resultado</TableHead>
              <TableHead>Gasto</TableHead>
              <TableHead className="w-8"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <React.Fragment key={campaign.id}>
                <TableRow className="hover:bg-muted/50">
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRow(campaign.id)}
                      className="h-6 w-6 p-0"
                    >
                      {expandedRows.has(campaign.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(campaign.status)}>
                      {campaign.status === 'ACTIVE' ? 'Ativo' : 
                       campaign.status === 'PAUSED' ? 'Pausado' :
                       campaign.status === 'DELETED' ? 'Excluído' : 'Arquivado'}
                    </Badge>
                  </TableCell>
                  <TableCell>{campaign.objective || '-'}</TableCell>
                  <TableCell>{campaign.bid_strategy || '-'}</TableCell>
                  <TableCell>
                    {formatCurrency(campaign.budget)} 
                    <span className="text-xs text-muted-foreground ml-1">
                      /{campaign.budget_type === 'DAILY' ? 'dia' : 'total'}
                    </span>
                  </TableCell>
                  <TableCell>{formatNumber(campaign.results)}</TableCell>
                  <TableCell>{formatNumber(campaign.reach)}</TableCell>
                  <TableCell>{formatNumber(campaign.impressions)}</TableCell>
                  <TableCell>{formatCurrency(campaign.cost_per_result)}</TableCell>
                  <TableCell>{formatCurrency(campaign.spend)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          disabled={actionLoading === campaign.id}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {campaign.status === 'ACTIVE' ? (
                          <DropdownMenuItem onClick={() => handleStatusChange(campaign.id, 'PAUSED')}>
                            <Pause className="h-4 w-4 mr-2" />
                            Pausar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleStatusChange(campaign.id, 'ACTIVE')}>
                            <Play className="h-4 w-4 mr-2" />
                            Ativar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDuplicate(campaign)}>
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
                          onClick={() => handleDelete(campaign.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                
                {expandedRows.has(campaign.id) && (
                  <TableRow>
                    <TableCell colSpan={12} className="bg-muted/30 p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">ID da Campanha:</span>
                          <p className="text-muted-foreground">{campaign.id}</p>
                        </div>
                        <div>
                          <span className="font-medium">Criado em:</span>
                          <p className="text-muted-foreground">
                            {new Date(campaign.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">CTR:</span>
                          <p className="text-muted-foreground">
                            {campaign.impressions > 0 
                              ? ((campaign.results / campaign.impressions) * 100).toFixed(2) + '%'
                              : '0%'
                            }
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">CPC:</span>
                          <p className="text-muted-foreground">
                            {campaign.results > 0 
                              ? formatCurrency(campaign.spend / campaign.results)
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