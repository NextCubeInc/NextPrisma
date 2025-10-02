// Página de gerenciamento de anúncios

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
import { Ad, AdPlatform } from '@/types/ads';
import { useAdsList } from '@/hooks/use-ads';
import { PlatformSelector } from '@/components/ads/platform-selector';
import { AdsTable } from '@/components/ads/ads-table';
import { AdForm } from '@/components/ads/ad-form';

export default function AdsPage() {
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState<AdPlatform>('META');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);

  const { 
    ads, 
    loading, 
    createAd, 
    updateAd, 
    deleteAd,
    duplicateAd 
  } = useAdsList(selectedPlatform);

  const handleCreateAd = async (data: any) => {
    try {
      await createAd(data);
      setCreateDialogOpen(false);
    } catch (error) {
      console.error('Erro ao criar anúncio:', error);
    }
  };

  const handleEditAd = async (data: any) => {
    if (!editingAd) return;
    
    try {
      await updateAd(editingAd.id, data);
      setEditingAd(null);
    } catch (error) {
      console.error('Erro ao editar anúncio:', error);
    }
  };

  const handleDeleteAd = async (ad: Ad) => {
    if (confirm(`Tem certeza que deseja excluir o anúncio "${ad.name}"?`)) {
      try {
        await deleteAd(ad.id);
      } catch (error) {
        console.error('Erro ao excluir anúncio:', error);
      }
    }
  };

  const handleDuplicateAd = async (ad: Ad) => {
    try {
      await duplicateAd(ad.id);
    } catch (error) {
      console.error('Erro ao duplicar anúncio:', error);
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
            <h1 className="text-3xl font-bold">Anúncios</h1>
            <p className="text-muted-foreground">
              Gerencie seus anúncios e criativos
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
            Novo anúncio
          </Button>
        </div>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ads.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {ads.filter(a => a.status === 'ACTIVE').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pausados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {ads.filter(a => a.status === 'PAUSED').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {ads.filter(a => a.approval_status === 'APPROVED').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Em revisão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {ads.filter(a => a.approval_status === 'PENDING').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de anúncios */}
      <Card>
        <CardHeader>
          <CardTitle>Seus anúncios</CardTitle>
          <CardDescription>
            Lista de todos os anúncios na plataforma {selectedPlatform}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdsTable
            type="ads"
            data={ads}
            loading={loading}
            onEdit={setEditingAd}
            onDelete={handleDeleteAd}
            onDuplicate={handleDuplicateAd}
            onViewMetrics={(ad) => {
              router.push(`/ads/ads/${ad.id}/metrics`);
            }}
          />
        </CardContent>
      </Card>

      {/* Dialog de criação */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo anúncio</DialogTitle>
            <DialogDescription>
              Configure as informações do seu novo anúncio
            </DialogDescription>
          </DialogHeader>

          <AdForm
            platform={selectedPlatform}
            onSubmit={handleCreateAd}
            onCancel={() => setCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de edição */}
      <Dialog open={!!editingAd} onOpenChange={() => setEditingAd(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar anúncio</DialogTitle>
            <DialogDescription>
              Atualize as informações do anúncio
            </DialogDescription>
          </DialogHeader>

          {editingAd && (
            <AdForm
              ad={editingAd}
              platform={selectedPlatform}
              onSubmit={handleEditAd}
              onCancel={() => setEditingAd(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}