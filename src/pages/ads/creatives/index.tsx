// Página de gerenciamento de criativos

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { AdPlatform } from '@/types/ads';
import { useCreatives } from '@/hooks/use-ads';
import { PlatformSelector } from '@/components/ads/platform-selector';
import { CreativeLibrary } from '@/components/ads/creative-library';

export default function CreativesPage() {
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState<AdPlatform>('META');

  const { 
    creatives, 
    loading, 
    createCreative, 
    updateCreative, 
    deleteCreative 
  } = useCreatives(selectedPlatform);

  const handleCreateCreative = async (data: any) => {
    try {
      await createCreative(data);
    } catch (error) {
      console.error('Erro ao criar criativo:', error);
    }
  };

  const handleUpdateCreative = async (id: string, data: any) => {
    try {
      await updateCreative(id, data);
    } catch (error) {
      console.error('Erro ao atualizar criativo:', error);
    }
  };

  const handleDeleteCreative = async (id: string) => {
    try {
      await deleteCreative(id);
    } catch (error) {
      console.error('Erro ao excluir criativo:', error);
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
            <h1 className="text-3xl font-bold">Biblioteca de criativos</h1>
            <p className="text-muted-foreground">
              Gerencie seus criativos e assets publicitários
            </p>
          </div>
        </div>

        <PlatformSelector
          value={selectedPlatform}
          onChange={setSelectedPlatform}
          variant="select"
        />
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creatives.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Imagens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {creatives.filter(c => c.type === 'IMAGE').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vídeos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {creatives.filter(c => c.type === 'VIDEO').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {creatives.filter(c => c.approval_status === 'APPROVED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Biblioteca de criativos */}
      <Card>
        <CardHeader>
          <CardTitle>Seus criativos</CardTitle>
          <CardDescription>
            Biblioteca de criativos para a plataforma {selectedPlatform}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreativeLibrary
            creatives={creatives}
            loading={loading}
            onUpload={handleCreateCreative}
            onUpdate={handleUpdateCreative}
            onDelete={handleDeleteCreative}
            platform={selectedPlatform}
            selectable={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}