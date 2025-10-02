// Componente de tabela modular para anúncios

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  MoreHorizontal,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Play,
  Pause,
  Copy,
  BarChart3
} from 'lucide-react';
import { StatusBadge, StatusSwitcher } from './status-badge';
import { PlatformBadge } from './platform-selector';
import { Campaign, AdSet, Ad, Creative, AdPlatform } from '@/types/ads';

type TableEntity = Campaign | AdSet | Ad | Creative;
type EntityType = 'campaign' | 'adset' | 'ad' | 'creative';

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (item: T) => React.ReactNode;
}

interface AdsTableProps<T extends TableEntity> {
  data: T[];
  entityType: EntityType;
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onStatusChange?: (item: T, status: string) => void;
  onDuplicate?: (item: T) => void;
  onViewMetrics?: (item: T) => void;
  className?: string;
}

export function AdsTable<T extends TableEntity>({
  data,
  entityType,
  columns,
  loading = false,
  searchable = true,
  filterable = true,
  selectable = false,
  onEdit,
  onDelete,
  onStatusChange,
  onDuplicate,
  onViewMetrics,
  className = ''
}: AdsTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Filtrar dados baseado na busca
  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item as any).platform?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  // Ordenar dados
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = (a as any)[sortConfig.key];
      const bValue = (b as any)[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(sortedData.map(item => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getEntityActions = (item: T) => {
    const actions = [];

    if (onEdit) {
      actions.push(
        <DropdownMenuItem key="edit" onClick={() => onEdit(item)}>
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </DropdownMenuItem>
      );
    }

    if (onDuplicate) {
      actions.push(
        <DropdownMenuItem key="duplicate" onClick={() => onDuplicate(item)}>
          <Copy className="w-4 h-4 mr-2" />
          Duplicar
        </DropdownMenuItem>
      );
    }

    if (onViewMetrics) {
      actions.push(
        <DropdownMenuItem key="metrics" onClick={() => onViewMetrics(item)}>
          <BarChart3 className="w-4 h-4 mr-2" />
          Ver Métricas
        </DropdownMenuItem>
      );
    }

    if (onStatusChange) {
      const canActivate = item.status === 'PAUSED' || item.status === 'DRAFT';
      const canPause = item.status === 'ACTIVE';

      if (canActivate) {
        actions.push(
          <DropdownMenuItem key="activate" onClick={() => onStatusChange(item, 'ACTIVE')}>
            <Play className="w-4 h-4 mr-2" />
            Ativar
          </DropdownMenuItem>
        );
      }

      if (canPause) {
        actions.push(
          <DropdownMenuItem key="pause" onClick={() => onStatusChange(item, 'PAUSED')}>
            <Pause className="w-4 h-4 mr-2" />
            Pausar
          </DropdownMenuItem>
        );
      }
    }

    if (onDelete) {
      if (actions.length > 0) {
        actions.push(<DropdownMenuSeparator key="separator" />);
      }
      actions.push(
        <DropdownMenuItem 
          key="delete" 
          onClick={() => onDelete(item)}
          className="text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Excluir
        </DropdownMenuItem>
      );
    }

    return actions;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {searchable && (
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar..."
                className="pl-10"
                disabled
              />
            </div>
          </div>
        )}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                {selectable && <TableHead className="w-12"></TableHead>}
                {columns.map((column) => (
                  <TableHead key={column.key} style={{ width: column.width }}>
                    {column.label}
                  </TableHead>
                ))}
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {selectable && <TableCell></TableCell>}
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      <div className="h-4 bg-muted animate-pulse rounded"></div>
                    </TableCell>
                  ))}
                  <TableCell></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Barra de ferramentas */}
      {(searchable || filterable) && (
        <div className="flex items-center gap-4">
          {searchable && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
          
          {filterable && (
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          )}
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      )}

      {/* Ações em lote */}
      {selectable && selectedItems.size > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm text-muted-foreground">
            {selectedItems.size} item(s) selecionado(s)
          </span>
          <Button variant="outline" size="sm">
            <Play className="w-4 h-4 mr-2" />
            Ativar
          </Button>
          <Button variant="outline" size="sm">
            <Pause className="w-4 h-4 mr-2" />
            Pausar
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
        </div>
      )}

      {/* Tabela */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedItems.size === sortedData.length && sortedData.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead 
                  key={column.key} 
                  style={{ width: column.width }}
                  className={column.sortable ? 'cursor-pointer hover:bg-muted/50' : ''}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortConfig?.key === column.key && (
                      <span className="text-xs">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (selectable ? 1 : 0) + 1} 
                  className="text-center py-8 text-muted-foreground"
                >
                  Nenhum {entityType === 'campaign' ? 'campanha' : 
                           entityType === 'adset' ? 'conjunto de anúncios' :
                           entityType === 'ad' ? 'anúncio' : 'criativo'} encontrado
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((item) => (
                <TableRow key={item.id}>
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.has(item.id)}
                        onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render ? column.render(item) : (item as any)[column.key]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {getEntityActions(item)}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {sortedData.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Mostrando {sortedData.length} de {data.length} resultados
          </span>
        </div>
      )}
    </div>
  );
}

// Colunas predefinidas para diferentes tipos de entidade
export const campaignColumns: Column<Campaign>[] = [
  {
    key: 'name',
    label: 'Nome',
    sortable: true,
    width: '300px',
    render: (campaign) => (
      <div>
        <div className="font-medium">{campaign.name}</div>
        <div className="text-sm text-muted-foreground">
          ID: {campaign.platform_campaign_id}
        </div>
      </div>
    )
  },
  {
    key: 'platform',
    label: 'Plataforma',
    sortable: true,
    width: '120px',
    render: (campaign) => (
      <PlatformBadge platform={campaign.platform} size="sm" />
    )
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    width: '120px',
    render: (campaign) => (
      <StatusBadge status={campaign.status} size="sm" />
    )
  },
  {
    key: 'objective',
    label: 'Objetivo',
    sortable: true,
    width: '150px'
  },
  {
    key: 'budget',
    label: 'Orçamento',
    sortable: true,
    width: '120px',
    render: (campaign) => (
      <div>
        <div className="font-medium">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(campaign.budget)}
        </div>
        <div className="text-xs text-muted-foreground">
          {campaign.budget_type === 'DAILY' ? 'Diário' : 'Total'}
        </div>
      </div>
    )
  },
  {
    key: 'created_at',
    label: 'Criado em',
    sortable: true,
    width: '120px',
    render: (campaign) => new Date(campaign.created_at).toLocaleDateString('pt-BR')
  }
];

export const adSetColumns: Column<AdSet>[] = [
  {
    key: 'name',
    label: 'Nome',
    sortable: true,
    width: '300px',
    render: (adSet) => (
      <div>
        <div className="font-medium">{adSet.name}</div>
        <div className="text-sm text-muted-foreground">
          ID: {adSet.platform_adset_id}
        </div>
      </div>
    )
  },
  {
    key: 'platform',
    label: 'Plataforma',
    sortable: true,
    width: '120px',
    render: (adSet) => (
      <PlatformBadge platform={adSet.platform} size="sm" />
    )
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    width: '120px',
    render: (adSet) => (
      <StatusBadge status={adSet.status} size="sm" />
    )
  },
  {
    key: 'optimization_goal',
    label: 'Otimização',
    sortable: true,
    width: '150px'
  },
  {
    key: 'budget',
    label: 'Orçamento',
    sortable: true,
    width: '120px',
    render: (adSet) => (
      <div>
        <div className="font-medium">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(adSet.budget)}
        </div>
        <div className="text-xs text-muted-foreground">
          {adSet.budget_type === 'DAILY' ? 'Diário' : 'Total'}
        </div>
      </div>
    )
  },
  {
    key: 'bid_amount',
    label: 'Lance',
    sortable: true,
    width: '100px',
    render: (adSet) => adSet.bid_amount ? 
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(adSet.bid_amount) : '-'
  }
];

export const adColumns: Column<Ad>[] = [
  {
    key: 'name',
    label: 'Nome',
    sortable: true,
    width: '300px',
    render: (ad) => (
      <div>
        <div className="font-medium">{ad.name}</div>
        <div className="text-sm text-muted-foreground">
          ID: {ad.platform_ad_id}
        </div>
      </div>
    )
  },
  {
    key: 'platform',
    label: 'Plataforma',
    sortable: true,
    width: '120px',
    render: (ad) => (
      <PlatformBadge platform={ad.platform} size="sm" />
    )
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    width: '120px',
    render: (ad) => (
      <StatusBadge status={ad.status} size="sm" />
    )
  },
  {
    key: 'creative_uuid',
    label: 'Criativo',
    sortable: false,
    width: '150px',
    render: (ad) => (
      <Badge variant="outline" className="text-xs">
        {ad.creative_uuid ? 'Vinculado' : 'Sem criativo'}
      </Badge>
    )
  },
  {
    key: 'created_at',
    label: 'Criado em',
    sortable: true,
    width: '120px',
    render: (ad) => new Date(ad.created_at).toLocaleDateString('pt-BR')
  }
];

export const creativeColumns: Column<Creative>[] = [
  {
    key: 'name',
    label: 'Nome',
    sortable: true,
    width: '300px',
    render: (creative) => (
      <div>
        <div className="font-medium">{creative.name}</div>
        <div className="text-sm text-muted-foreground">
          {creative.type} - {creative.format}
        </div>
      </div>
    )
  },
  {
    key: 'platform',
    label: 'Plataforma',
    sortable: true,
    width: '120px',
    render: (creative) => (
      <PlatformBadge platform={creative.platform} size="sm" />
    )
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    width: '120px',
    render: (creative) => (
      <StatusBadge status={creative.status} size="sm" />
    )
  },
  {
    key: 'approval_status',
    label: 'Aprovação',
    sortable: true,
    width: '120px',
    render: (creative) => (
      <Badge 
        variant={
          creative.approval_status === 'APPROVED' ? 'default' :
          creative.approval_status === 'REJECTED' ? 'destructive' :
          'secondary'
        }
        className="text-xs"
      >
        {creative.approval_status === 'APPROVED' ? 'Aprovado' :
         creative.approval_status === 'REJECTED' ? 'Rejeitado' :
         creative.approval_status === 'PENDING' ? 'Pendente' :
         'Em Revisão'}
      </Badge>
    )
  },
  {
    key: 'created_at',
    label: 'Criado em',
    sortable: true,
    width: '120px',
    render: (creative) => new Date(creative.created_at).toLocaleDateString('pt-BR')
  }
];