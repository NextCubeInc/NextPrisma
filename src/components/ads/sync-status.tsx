import React, { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  RefreshCw,
  Play,
  Square,
  MoreHorizontal,
  Calendar,
  Database,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useSyncJobs, useSyncStats, useAutoSync } from '@/hooks/use-sync';
import { SyncJob } from '@/lib/sync/sync-manager';

interface SyncStatusProps {
  platformConfigId: string;
}

export function SyncStatus({ platformConfigId }: SyncStatusProps) {
  const { jobs, loading, startCampaignSync, startMetricsSync, cancelJob } = useSyncJobs(platformConfigId);
  const { stats } = useSyncStats(platformConfigId);
  const { isAutoSyncing, startAutoSync } = useAutoSync();
  const [showAllJobs, setShowAllJobs] = useState(false);

  const getStatusIcon = (status: SyncJob['status']) => {
    switch (status) {
      case 'running':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: SyncJob['status']) => {
    const variants = {
      pending: 'secondary',
      running: 'default',
      completed: 'success',
      failed: 'destructive',
    } as const;

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status === 'running' ? 'Executando' :
         status === 'completed' ? 'Concluído' :
         status === 'failed' ? 'Falhou' : 'Pendente'}
      </Badge>
    );
  };

  const getSyncTypeLabel = (syncType: string) => {
    const labels = {
      campaigns: 'Campanhas',
      adsets: 'Conjuntos de Anúncios',
      ads: 'Anúncios',
      creatives: 'Criativos',
      metrics: 'Métricas',
    };
    return labels[syncType as keyof typeof labels] || syncType;
  };

  const handleQuickSync = async (type: 'campaigns' | 'metrics') => {
    if (type === 'campaigns') {
      await startCampaignSync({
        date_preset: 'last_7_days',
      });
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateRange = {
        since: yesterday.toISOString().split('T')[0],
        until: yesterday.toISOString().split('T')[0],
      };
      await startMetricsSync('campaign', dateRange);
    }
  };

  const runningJobs = jobs.filter(job => job.status === 'running');
  const recentJobs = jobs.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Sincronização
          </CardTitle>
          <CardDescription>
            Gerencie a sincronização de dados com as plataformas de anúncios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleQuickSync('campaigns')}
              disabled={loading}
              size="sm"
            >
              <Database className="h-4 w-4 mr-2" />
              Sincronizar Campanhas
            </Button>
            <Button
              onClick={() => handleQuickSync('metrics')}
              disabled={loading}
              size="sm"
              variant="outline"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Sincronizar Métricas
            </Button>
            <Button
              onClick={startAutoSync}
              disabled={isAutoSyncing}
              size="sm"
              variant="outline"
            >
              <Play className="h-4 w-4 mr-2" />
              {isAutoSyncing ? 'Sincronizando...' : 'Sincronização Automática'}
            </Button>
          </div>

          {/* Running Jobs Progress */}
          {runningJobs.length > 0 && (
            <div className="space-y-2">
              <Separator />
              <div className="text-sm font-medium">Jobs em Execução</div>
              {runningJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="text-sm">{getSyncTypeLabel(job.sync_type)}</span>
                  </div>
                  <Button
                    onClick={() => cancelJob(job.id)}
                    size="sm"
                    variant="ghost"
                  >
                    <Square className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sync Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Jobs</p>
                <p className="text-2xl font-bold">{stats.totalJobs}</p>
              </div>
              <Database className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Em Execução</p>
                <p className="text-2xl font-bold text-blue-600">{stats.runningJobs}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Concluídos</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedJobs}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Falharam</p>
                <p className="text-2xl font-bold text-red-600">{stats.failedJobs}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Jobs Recentes</CardTitle>
              <CardDescription>
                {stats.lastSyncAt && (
                  <>
                    Última sincronização: {formatDistanceToNow(new Date(stats.lastSyncAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </>
                )}
              </CardDescription>
            </div>
            <Dialog open={showAllJobs} onOpenChange={setShowAllJobs}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Ver Todos
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Histórico de Sincronização</DialogTitle>
                  <DialogDescription>
                    Todos os jobs de sincronização para esta configuração
                  </DialogDescription>
                </DialogHeader>
                <SyncJobsTable jobs={jobs} onCancel={cancelJob} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <SyncJobsTable jobs={recentJobs} onCancel={cancelJob} compact />
        </CardContent>
      </Card>
    </div>
  );
}

interface SyncJobsTableProps {
  jobs: SyncJob[];
  onCancel: (jobId: string) => void;
  compact?: boolean;
}

function SyncJobsTable({ jobs, onCancel, compact = false }: SyncJobsTableProps) {
  const getSyncTypeLabel = (syncType: string) => {
    const labels = {
      campaigns: 'Campanhas',
      adsets: 'Conjuntos de Anúncios',
      ads: 'Anúncios',
      creatives: 'Criativos',
      metrics: 'Métricas',
    };
    return labels[syncType as keyof typeof labels] || syncType;
  };

  const getStatusIcon = (status: SyncJob['status']) => {
    switch (status) {
      case 'running':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: SyncJob['status']) => {
    const variants = {
      pending: 'secondary',
      running: 'default',
      completed: 'success',
      failed: 'destructive',
    } as const;

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status === 'running' ? 'Executando' :
         status === 'completed' ? 'Concluído' :
         status === 'failed' ? 'Falhou' : 'Pendente'}
      </Badge>
    );
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum job de sincronização encontrado
      </div>
    );
  }

  return (
    <div className={compact ? "max-h-64 overflow-y-auto" : ""}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Registros</TableHead>
            <TableHead>Iniciado</TableHead>
            {!compact && <TableHead>Concluído</TableHead>}
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(job.status)}
                  {getSyncTypeLabel(job.sync_type)}
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(job.status)}
              </TableCell>
              <TableCell>
                {job.records_synced !== undefined ? job.records_synced : '-'}
              </TableCell>
              <TableCell>
                {job.started_at ? format(new Date(job.started_at), 'dd/MM HH:mm') : '-'}
              </TableCell>
              {!compact && (
                <TableCell>
                  {job.completed_at ? format(new Date(job.completed_at), 'dd/MM HH:mm') : '-'}
                </TableCell>
              )}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {job.status === 'running' && (
                      <DropdownMenuItem onClick={() => onCancel(job.id)}>
                        <Square className="h-4 w-4 mr-2" />
                        Cancelar
                      </DropdownMenuItem>
                    )}
                    {job.error_message && (
                      <DropdownMenuItem>
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Ver Erro
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}