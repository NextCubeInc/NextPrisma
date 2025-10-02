// Página de gerenciamento de conjuntos de anúncios

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import { AdSet, AdPlatform } from '@/types/ads';
import { useAdSets } from '@/hooks/use-ads';
import { PlatformSelector } from '@/components/ads/platform-selector';
import { AdsTable } from '@/components/ads/ads-table';
import { AdSetForm } from '@/components/ads/adset-form';

export default function AdSetsPage() {
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState<AdPlatform>('META');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingAdSet, setEditingAdSet] = useState<AdSet | null>(null);

  const { 
    adSets, 
    loading, 
    createAdSet, 
    updateAdSet, 
    deleteAdSet,
    duplicateAdSet 
  } = useAdSets(selectedPlatform);

  const handleCreateAdSet = async (data: any) => {
    try {
      await createAdSet(data);
      setCreateDialogOpen(false);
    } catch (error) {
      console.error('Erro ao criar conjunto de anúncios:', error);
    }
  };

  const handleEditAdSet = async (data: any) => {
    if (!editingAdSet) return;
    
    try {
      await updateAdSet(editingAdSet.id, data);
      setEditingAdSet(null);
    } catch (error) {
      console.error('Erro ao editar conjunto de anúncios:', error);
    }
  };

  const handleDeleteAdSet = async (adSet: AdSet) => {
    if (confirm(`Tem certeza que deseja excluir o conjunto de anúncios "${adSet.name}"?`)) {
      try {
        await deleteAdSet(adSet.id);
      } catch (error) {
        console.error('Erro ao excluir conjunto de anúncios:', error);
      }
    }
  };

  const handleDuplicateAdSet = async (adSet: AdSet) => {
    try {
      await duplicateAdSet(adSet.id);
    } catch (error) {
      console.error('Erro ao duplicar conjunto de anúncios:', error);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/ads')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Conjuntos de anúncios</h1>
            <p className="text-muted-foreground">
              Gerencie seus conjuntos de anúncios e targeting
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <PlatformSelector
            value={selectedPlatform}
            onChange={setSelectedPlatform}
            variant="select"
          />

          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo conjunto
          </Button>
        </div>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adSets.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {adSets.filter(a => a.status === 'ACTIVE').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pausados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {adSets.filter(a => a.status === 'PAUSED').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Arquivados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {adSets.filter(a => a.status === 'ARCHIVED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de conjuntos de anúncios */}
      <Card>
        <CardHeader>
          <CardTitle>Seus conjuntos de anúncios</CardTitle>
          <CardDescription>
            Lista de todos os conjuntos de anúncios na plataforma {selectedPlatform}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdsTable
            type="adsets"
            data={adSets}
            loading={loading}
            onEdit={setEditingAdSet}
            onDelete={handleDeleteAdSet}
            onDuplicate={handleDuplicateAdSet}
            onViewMetrics={(adSet) => {
              router.push(`/ads/adsets/${adSet.id}/metrics`);
            }}
          />
        </CardContent>
      </Card>

      {/* Dialog de criação */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo conjunto de anúncios</DialogTitle>
            <DialogDescription>
              Configure as informações e targeting do seu novo conjunto de anúncios
            </DialogDescription>
          </DialogHeader>

          <AdSetForm
            platform={selectedPlatform}
            onSubmit={handleCreateAdSet}
            onCancel={() => setCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de edição */}
      <Dialog open={!!editingAdSet} onOpenChange={() => setEditingAdSet(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar conjunto de anúncios</DialogTitle>
            <DialogDescription>
              Atualize as informações do conjunto de anúncios
            </DialogDescription>
          </DialogHeader>

          {editingAdSet && (
            <AdSetForm
              adSet={editingAdSet}
              platform={selectedPlatform}
              onSubmit={handleEditAdSet}
              onCancel={() => setEditingAdSet(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}