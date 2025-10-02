// Componente de badge de status para anúncios

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Play, Pause, Square, AlertCircle } from 'lucide-react';

type AdStatus = 'ACTIVE' | 'PAUSED' | 'DELETED' | 'PENDING' | 'REJECTED' | 'DRAFT';
type ApprovalStatus = 'APPROVED' | 'PENDING' | 'REJECTED' | 'UNDER_REVIEW';

interface StatusConfig {
  label: string;
  color: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  icon?: React.ReactNode;
  description: string;
}

const STATUS_CONFIG: Record<AdStatus, StatusConfig> = {
  ACTIVE: {
    label: 'Ativo',
    color: 'success',
    icon: <Play className="w-3 h-3" />,
    description: 'Campanha está rodando'
  },
  PAUSED: {
    label: 'Pausado',
    color: 'warning',
    icon: <Pause className="w-3 h-3" />,
    description: 'Campanha pausada'
  },
  DELETED: {
    label: 'Excluído',
    color: 'destructive',
    icon: <Square className="w-3 h-3" />,
    description: 'Campanha excluída'
  },
  PENDING: {
    label: 'Pendente',
    color: 'secondary',
    icon: <AlertCircle className="w-3 h-3" />,
    description: 'Aguardando aprovação'
  },
  REJECTED: {
    label: 'Rejeitado',
    color: 'destructive',
    icon: <AlertCircle className="w-3 h-3" />,
    description: 'Rejeitado pela plataforma'
  },
  DRAFT: {
    label: 'Rascunho',
    color: 'outline',
    icon: <Square className="w-3 h-3" />,
    description: 'Em desenvolvimento'
  }
};

const APPROVAL_STATUS_CONFIG: Record<ApprovalStatus, StatusConfig> = {
  APPROVED: {
    label: 'Aprovado',
    color: 'success',
    description: 'Criativo aprovado'
  },
  PENDING: {
    label: 'Pendente',
    color: 'warning',
    description: 'Aguardando revisão'
  },
  REJECTED: {
    label: 'Rejeitado',
    color: 'destructive',
    description: 'Criativo rejeitado'
  },
  UNDER_REVIEW: {
    label: 'Em Revisão',
    color: 'secondary',
    description: 'Sendo analisado'
  }
};

interface StatusBadgeProps {
  status: AdStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({ 
  status, 
  size = 'md', 
  showIcon = true,
  className = '' 
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  
  if (!config) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  return (
    <Badge 
      variant={config.color as any}
      className={`${sizeClasses[size]} ${className} flex items-center gap-1`}
      title={config.description}
    >
      {showIcon && config.icon}
      {config.label}
    </Badge>
  );
}

interface ApprovalStatusBadgeProps {
  status: ApprovalStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ApprovalStatusBadge({ 
  status, 
  size = 'md',
  className = '' 
}: ApprovalStatusBadgeProps) {
  const config = APPROVAL_STATUS_CONFIG[status];
  
  if (!config) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  return (
    <Badge 
      variant={config.color as any}
      className={`${sizeClasses[size]} ${className}`}
      title={config.description}
    >
      {config.label}
    </Badge>
  );
}

// Componente para mudança rápida de status
interface StatusSwitcherProps {
  currentStatus: AdStatus;
  onStatusChange: (status: AdStatus) => void;
  availableStatuses?: AdStatus[];
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusSwitcher({
  currentStatus,
  onStatusChange,
  availableStatuses = ['ACTIVE', 'PAUSED'],
  disabled = false,
  size = 'md'
}: StatusSwitcherProps) {
  const currentConfig = STATUS_CONFIG[currentStatus];

  if (!currentConfig) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={size}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          {currentConfig.icon}
          {currentConfig.label}
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableStatuses.map((status) => {
          const config = STATUS_CONFIG[status];
          if (!config || status === currentStatus) return null;

          return (
            <DropdownMenuItem
              key={status}
              onClick={() => onStatusChange(status)}
              className="flex items-center gap-2"
            >
              {config.icon}
              <div>
                <div className="font-medium">{config.label}</div>
                <div className="text-xs text-muted-foreground">
                  {config.description}
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Componente para exibir múltiplos status
interface StatusGroupProps {
  status: AdStatus;
  approvalStatus?: ApprovalStatus;
  className?: string;
}

export function StatusGroup({ 
  status, 
  approvalStatus,
  className = '' 
}: StatusGroupProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <StatusBadge status={status} size="sm" />
      {approvalStatus && (
        <ApprovalStatusBadge status={approvalStatus} size="sm" />
      )}
    </div>
  );
}

// Hook para obter configuração de status
export function useStatusConfig(status: AdStatus) {
  return STATUS_CONFIG[status] || null;
}

export function useApprovalStatusConfig(status: ApprovalStatus) {
  return APPROVAL_STATUS_CONFIG[status] || null;
}

// Utilitários para status
export const StatusUtils = {
  isActive: (status: AdStatus) => status === 'ACTIVE',
  isPaused: (status: AdStatus) => status === 'PAUSED',
  isDeleted: (status: AdStatus) => status === 'DELETED',
  isPending: (status: AdStatus) => status === 'PENDING',
  isRejected: (status: AdStatus) => status === 'REJECTED',
  isDraft: (status: AdStatus) => status === 'DRAFT',
  
  canEdit: (status: AdStatus) => ['DRAFT', 'PAUSED', 'PENDING'].includes(status),
  canActivate: (status: AdStatus) => ['PAUSED', 'DRAFT'].includes(status),
  canPause: (status: AdStatus) => status === 'ACTIVE',
  canDelete: (status: AdStatus) => !['DELETED'].includes(status),
  
  getAvailableTransitions: (status: AdStatus): AdStatus[] => {
    switch (status) {
      case 'DRAFT':
        return ['ACTIVE', 'PAUSED'];
      case 'ACTIVE':
        return ['PAUSED'];
      case 'PAUSED':
        return ['ACTIVE'];
      case 'PENDING':
        return [];
      case 'REJECTED':
        return ['DRAFT'];
      case 'DELETED':
        return [];
      default:
        return [];
    }
  }
};