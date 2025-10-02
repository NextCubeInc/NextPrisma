// Componente modular que se adapta às especificidades de cada plataforma

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { AdPlatform } from '@/types/ads';
import { Facebook, Instagram, Youtube, Music } from 'lucide-react';

interface PlatformSpecificFormProps {
  platform: AdPlatform;
  onSubmit: (data: any) => void;
  className?: string;
}

// Configurações específicas por plataforma
const platformConfigs = {
  META: {
    name: 'Meta Ads',
    icon: Facebook,
    color: 'bg-blue-500',
    objectives: [
      'AWARENESS',
      'TRAFFIC',
      'ENGAGEMENT',
      'LEADS',
      'APP_PROMOTION',
      'SALES'
    ],
    placements: [
      'Facebook Feed',
      'Instagram Feed',
      'Instagram Stories',
      'Facebook Stories',
      'Messenger',
      'Audience Network'
    ],
    ageRanges: [
      '13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'
    ],
    specificFields: [
      {
        key: 'detailed_targeting',
        label: 'Segmentação Detalhada',
        type: 'textarea',
        placeholder: 'Interesses, comportamentos, dados demográficos...'
      },
      {
        key: 'custom_audiences',
        label: 'Públicos Personalizados',
        type: 'select',
        options: ['Visitantes do site', 'Lista de clientes', 'Engajamento']
      },
      {
        key: 'lookalike_audiences',
        label: 'Públicos Similares',
        type: 'switch',
        description: 'Criar públicos similares automaticamente'
      }
    ]
  },
  GOOGLE: {
    name: 'Google Ads',
    icon: Youtube,
    color: 'bg-red-500',
    objectives: [
      'SEARCH',
      'DISPLAY',
      'VIDEO',
      'SHOPPING',
      'APP',
      'SMART'
    ],
    placements: [
      'Google Search',
      'Google Display Network',
      'YouTube',
      'Gmail',
      'Google Shopping',
      'Google Maps'
    ],
    ageRanges: [
      '18-24', '25-34', '35-44', '45-54', '55-64', '65+'
    ],
    specificFields: [
      {
        key: 'keywords',
        label: 'Palavras-chave',
        type: 'textarea',
        placeholder: 'Digite as palavras-chave separadas por vírgula...'
      },
      {
        key: 'match_types',
        label: 'Tipos de Correspondência',
        type: 'select',
        options: ['Exata', 'Frase', 'Ampla', 'Ampla modificada']
      },
      {
        key: 'quality_score_optimization',
        label: 'Otimização de Quality Score',
        type: 'switch',
        description: 'Otimizar automaticamente para melhor Quality Score'
      }
    ]
  },
  TIKTOK: {
    name: 'TikTok Ads',
    icon: Music,
    color: 'bg-black',
    objectives: [
      'AWARENESS',
      'TRAFFIC',
      'VIDEO_VIEWS',
      'LEAD_GENERATION',
      'APP_PROMOTION',
      'CONVERSIONS'
    ],
    placements: [
      'TikTok Feed',
      'TikTok Stories',
      'Pangle Network',
      'BuzzVideo',
      'TopBuzz'
    ],
    ageRanges: [
      '13-17', '18-24', '25-34', '35-44', '45-54', '55+'
    ],
    specificFields: [
      {
        key: 'video_duration',
        label: 'Duração do Vídeo',
        type: 'select',
        options: ['9-15s', '16-30s', '31-60s']
      },
      {
        key: 'trending_hashtags',
        label: 'Hashtags Trending',
        type: 'textarea',
        placeholder: 'Use hashtags populares para maior alcance...'
      },
      {
        key: 'spark_ads',
        label: 'Spark Ads',
        type: 'switch',
        description: 'Usar posts orgânicos como anúncios'
      }
    ]
  }
};

export function PlatformSpecificForm({ platform, onSubmit, className = '' }: PlatformSpecificFormProps) {
  const config = platformConfigs[platform];
  const Icon = config.icon;

  const [formData, setFormData] = React.useState<any>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateFormData = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${config.color} text-white`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              {config.name}
              <Badge variant="outline">{platform}</Badge>
            </CardTitle>
            <CardDescription>
              Configuração específica para {config.name}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campos comuns a todas as plataformas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="campaign_name">Nome da Campanha</Label>
              <Input
                id="campaign_name"
                placeholder="Digite o nome da campanha"
                value={formData.campaign_name || ''}
                onChange={(e) => updateFormData('campaign_name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objective">Objetivo</Label>
              <Select
                value={formData.objective || ''}
                onValueChange={(value) => updateFormData('objective', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o objetivo" />
                </SelectTrigger>
                <SelectContent>
                  {config.objectives.map((objective) => (
                    <SelectItem key={objective} value={objective}>
                      {objective.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Orçamento Diário (R$)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="0.00"
                value={formData.budget || ''}
                onChange={(e) => updateFormData('budget', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age_range">Faixa Etária</Label>
              <Select
                value={formData.age_range || ''}
                onValueChange={(value) => updateFormData('age_range', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a faixa etária" />
                </SelectTrigger>
                <SelectContent>
                  {config.ageRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range} anos
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Posicionamentos */}
          <div className="space-y-2">
            <Label>Posicionamentos</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {config.placements.map((placement) => (
                <div key={placement} className="flex items-center space-x-2">
                  <Switch
                    id={`placement_${placement}`}
                    checked={formData.placements?.includes(placement) || false}
                    onCheckedChange={(checked) => {
                      const currentPlacements = formData.placements || [];
                      if (checked) {
                        updateFormData('placements', [...currentPlacements, placement]);
                      } else {
                        updateFormData('placements', currentPlacements.filter((p: string) => p !== placement));
                      }
                    }}
                  />
                  <Label htmlFor={`placement_${placement}`} className="text-sm">
                    {placement}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Campos específicos da plataforma */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">
              Configurações Específicas - {config.name}
            </h3>
            
            <div className="space-y-4">
              {config.specificFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  
                  {field.type === 'textarea' && (
                    <Textarea
                      id={field.key}
                      placeholder={field.placeholder}
                      value={formData[field.key] || ''}
                      onChange={(e) => updateFormData(field.key, e.target.value)}
                      rows={3}
                    />
                  )}
                  
                  {field.type === 'select' && (
                    <Select
                      value={formData[field.key] || ''}
                      onValueChange={(value) => updateFormData(field.key, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Selecione ${field.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {field.type === 'switch' && (
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={field.key}
                        checked={formData[field.key] || false}
                        onCheckedChange={(checked) => updateFormData(field.key, checked)}
                      />
                      <Label htmlFor={field.key} className="text-sm text-muted-foreground">
                        {field.description}
                      </Label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
            <Button type="submit" className={config.color}>
              Criar Campanha
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Componente de demonstração da modularidade
export function PlatformModularityDemo() {
  const [selectedPlatform, setSelectedPlatform] = React.useState<AdPlatform>('META');

  const handleFormSubmit = (data: any) => {
    console.log(`Dados da campanha ${selectedPlatform}:`, data);
    // Aqui seria feita a integração com a API específica da plataforma
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">UI Modular Multi-Plataforma</h2>
        <p className="text-muted-foreground">
          O mesmo componente se adapta automaticamente às especificidades de cada plataforma
        </p>
      </div>

      {/* Seletor de plataforma */}
      <div className="flex justify-center gap-4">
        {(['META', 'GOOGLE', 'TIKTOK'] as AdPlatform[]).map((platform) => {
          const config = platformConfigs[platform];
          const Icon = config.icon;
          
          return (
            <Button
              key={platform}
              variant={selectedPlatform === platform ? 'default' : 'outline'}
              onClick={() => setSelectedPlatform(platform)}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              {config.name}
            </Button>
          );
        })}
      </div>

      {/* Formulário modular */}
      <PlatformSpecificForm
        platform={selectedPlatform}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}