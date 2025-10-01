import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronDown, ChevronRight, MoreHorizontal, Play, Pause, Edit, Copy, Trash2, BarChart3, Image, Video, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase'

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

interface AdSet {
  id: string
  name: string
}

interface AdsTableProps {
  ads: Ad[]
  adSets: AdSet[]
  loading: boolean
  onRefresh: () => void
}

export function AdsTable({ ads, adSets, loading, onRefresh }: AdsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const toggleRow = (adId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(adId)) {
      newExpanded.delete(adId)
    } else {
      newExpanded.add(adId)
    }
    setExpandedRows(newExpanded)
  }

  const getAdSetName = (adSetId: string) => {
    const adSet = adSets.find(a => a.id === adSetId)
    return adSet?.name || 'Conjunto não encontrado'
  }

  const handleStatusChange = async (adId: string, newStatus: string) => {
    try {
      setActionLoading(adId)
      
      const { error } = await supabase
        .from('ads')
        .update({ status: newStatus })
        .eq('id', adId)

      if (error) throw error
      
      onRefresh()
    } catch (error) {
      console.error('Erro ao alterar status:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDuplicate = async (ad: Ad) => {
    try {
      setActionLoading(ad.id)
      
      const { error } = await supabase
        .from('ads')
        .insert({
          adset_id: ad.adset_id,
          name: `${ad.name} (Cópia)`,
          status: 'PAUSED',
          format: ad.format,
          creative_id: ad.creative_id
        })

      if (error) throw error
      
      onRefresh()
    } catch (error) {
      console.error('Erro ao duplicar anúncio:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (adId: string) => {
    if (!confirm('Tem certeza que deseja excluir este anúncio?')) return
    
    try {
      setActionLoading(adId)
      
      const { error } = await supabase
        .from('ads')
        .update({ status: 'DELETED' })
        .eq('id', adId)

      if (error) throw error
      
      onRefresh()
    } catch (error) {
      console.error('Erro ao excluir anúncio:', error)
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

  const getFormatIcon = (format: string) => {
    switch (format?.toLowerCase()) {
      case 'video':
        return <Video className="h-4 w-4" />
      case 'image':
        return <Image className="h-4 w-4" />
      case 'carousel':
        return <Image className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getFormatLabel = (format: string) => {
    switch (format?.toLowerCase()) {
      case 'video': return 'Vídeo'
      case 'image': return 'Imagem'
      case 'carousel': return 'Carrossel'
      case 'collection': return 'Coleção'
      default: return format || 'Não definido'
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

  if (ads.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <Image className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">Nenhum anúncio encontrado</h3>
              <p className="text-muted-foreground">
                Crie conjuntos de anúncios primeiro para adicionar anúncios
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
              <TableHead>Nome do Anúncio</TableHead>
              <TableHead>Conjunto de Anúncios</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Formato</TableHead>
              <TableHead>Resultados</TableHead>
              <TableHead>Alcance</TableHead>
              <TableHead>Impressões</TableHead>
              <TableHead>Cliques</TableHead>
              <TableHead>CTR</TableHead>
              <TableHead>CPC</TableHead>
              <TableHead>Gasto</TableHead>
              <TableHead className="w-8"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ads.map((ad) => (
              <React.Fragment key={ad.id}>
                <TableRow className="hover:bg-muted/50">
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRow(ad.id)}
                      className="h-6 w-6 p-0"
                    >
                      {expandedRows.has(ad.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{ad.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {getAdSetName(ad.adset_id)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(ad.status)}>
                      {ad.status === 'ACTIVE' ? 'Ativo' : 
                       ad.status === 'PAUSED' ? 'Pausado' :
                       ad.status === 'DELETED' ? 'Excluído' : 'Arquivado'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getFormatIcon(ad.format)}
                      <span className="text-sm">{getFormatLabel(ad.format)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatNumber(ad.results)}</TableCell>
                  <TableCell>{formatNumber(ad.reach)}</TableCell>
                  <TableCell>{formatNumber(ad.impressions)}</TableCell>
                  <TableCell>{formatNumber(ad.clicks)}</TableCell>
                  <TableCell>{formatPercentage(ad.ctr)}</TableCell>
                  <TableCell>{formatCurrency(ad.cpc)}</TableCell>
                  <TableCell>{formatCurrency(ad.spend)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          disabled={actionLoading === ad.id}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {ad.status === 'ACTIVE' ? (
                          <DropdownMenuItem onClick={() => handleStatusChange(ad.id, 'PAUSED')}>
                            <Pause className="h-4 w-4 mr-2" />
                            Pausar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleStatusChange(ad.id, 'ACTIVE')}>
                            <Play className="h-4 w-4 mr-2" />
                            Ativar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDuplicate(ad)}>
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
                          onClick={() => handleDelete(ad.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                
                {expandedRows.has(ad.id) && (
                  <TableRow>
                    <TableCell colSpan={13} className="bg-muted/30 p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">ID do Anúncio:</span>
                          <p className="text-muted-foreground">{ad.id}</p>
                        </div>
                        <div>
                          <span className="font-medium">Frequência:</span>
                          <p className="text-muted-foreground">
                            {ad.reach > 0 
                              ? (ad.impressions / ad.reach).toFixed(2)
                              : '0'
                            }
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">CPM:</span>
                          <p className="text-muted-foreground">
                            {ad.impressions > 0 
                              ? formatCurrency((ad.spend / ad.impressions) * 1000)
                              : formatCurrency(0)
                            }
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">Taxa de Conversão:</span>
                          <p className="text-muted-foreground">
                            {ad.clicks > 0 
                              ? formatPercentage((ad.results / ad.clicks) * 100)
                              : '0%'
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