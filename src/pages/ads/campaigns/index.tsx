// Página de gerenciamento de campanhas

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
import { Campaign, AdPlatform } from '@/types/ads';
import { useCampaigns } from '@/hooks/use-ads';
import { PlatformSelector } from '@/components/ads/platform-selector';
import { AdsTable } from '@/components/ads/ads-table';
import { CampaignForm } from '@/components/ads/campaign-form';
import { MetricsGrid } from '@/components/ads/metrics-display';

export default function CampaignsPage() {
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState<AdPlatform>('META');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const { 
    campaigns, 
    loading, 
    createCampaign, 
    updateCampaign, 
    deleteCampaign,
    duplicateCampaign 
  } = useCampaigns(selectedPlatform);

  const handleCreateCampaign = async (data: any) => {
    try {
      await createCampaign(data);
      setCreateDialogOpen(false);
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
    }
  };

  const handleEditCampaign = async (data: any) => {
    if (!editingCampaign) return;
    
    try {
      await updateCampaign(editingCampaign.id, data);
      setEditingCampaign(null);
    } catch (error) {
      console.error('Erro ao editar campanha:', error);
    }
  };

  const handleDeleteCampaign = async (campaign: Campaign) => {
    if (confirm(`Tem certeza que deseja excluir a campanha "${campaign.name}"?`)) {
      try {
        await deleteCampaign(campaign.id);
      } catch (error) {
        console.error('Erro ao excluir campanha:', error);
      }
    }
  };

  const handleDuplicateCampaign = async (campaign: Campaign) => {
    try {
      await duplicateCampaign(campaign.id);
    } catch (error) {
      console.error('Erro ao duplicar campanha:', error);
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
            <h1 className="text-3xl font-bold">Campanhas</h1>
            <p className="text-muted-foreground">
              Gerencie suas campanhas publicitárias
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
            Nova campanha
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
            <div className="text-2xl font-bold">{campaigns.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {campaigns.filter(c => c.status === 'ACTIVE').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pausadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {campaigns.filter(c => c.status === 'PAUSED').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Arquivadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {campaigns.filter(c => c.status === 'ARCHIVED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de campanhas */}
      <Card>
        <CardHeader>
          <CardTitle>Suas campanhas</CardTitle>
          <CardDescription>
            Lista de todas as campanhas na plataforma {selectedPlatform}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdsTable
            type="campaigns"
            data={campaigns}
            loading={loading}
            onEdit={setEditingCampaign}
            onDelete={handleDeleteCampaign}
            onDuplicate={handleDuplicateCampaign}
            onViewMetrics={(campaign) => {
              router.push(`/ads/campaigns/${campaign.id}/metrics`);
            }}
          />
        </CardContent>
      </Card>

      {/* Dialog de criação */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova campanha</DialogTitle>
            <DialogDescription>
              Configure as informações da sua nova campanha
            </DialogDescription>
          </DialogHeader>

          <CampaignForm
            platform={selectedPlatform}
            onSubmit={handleCreateCampaign}
            onCancel={() => setCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de edição */}
      <Dialog open={!!editingCampaign} onOpenChange={() => setEditingCampaign(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar campanha</DialogTitle>
            <DialogDescription>
              Atualize as informações da campanha
            </DialogDescription>
          </DialogHeader>

          {editingCampaign && (
            <CampaignForm
              campaign={editingCampaign}
              platform={selectedPlatform}
              onSubmit={handleEditCampaign}
              onCancel={() => setEditingCampaign(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}