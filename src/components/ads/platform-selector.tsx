// Componente para seleção de plataforma de anúncios

import React from 'react';
import { AdPlatform } from '@/types/ads';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PlatformInfo {
  id: AdPlatform;
  name: string;
  icon: string;
  color: string;
  description: string;
  features: string[];
}

const PLATFORMS: PlatformInfo[] = [
  {
    id: 'META',
    name: 'Meta Ads',
    icon: '📘',
    color: 'bg-blue-500',
    description: 'Facebook e Instagram',
    features: ['Targeting avançado', 'Múltiplos formatos', 'Lookalike audiences']
  },
  {
    id: 'GOOGLE',
    name: 'Google Ads',
    icon: '🔍',
    color: 'bg-green-500',
    description: 'Pesquisa e Display',
    features: ['Intenção de compra', 'YouTube', 'Shopping ads']
  },
  {
    id: 'TIKTOK',
    name: 'TikTok Ads',
    icon: '🎵',
    color: 'bg-pink-500',
    description: 'Vídeos virais',
    features: ['Público jovem', 'Conteúdo criativo', 'Spark Ads']
  }
];

interface PlatformSelectorProps {
  selectedPlatform?: AdPlatform;
  onPlatformChange: (platform: AdPlatform) => void;
  mode?: 'cards' | 'select' | 'tabs';
  disabled?: boolean;
  showFeatures?: boolean;
  className?: string;
}

export function PlatformSelector({
  selectedPlatform,
  onPlatformChange,
  mode = 'cards',
  disabled = false,
  showFeatures = true,
  className = ''
}: PlatformSelectorProps) {
  if (mode === 'select') {
    return (
      <Select
        value={selectedPlatform}
        onValueChange={onPlatformChange}
        disabled={disabled}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder="Selecione uma plataforma" />
        </SelectTrigger>
        <SelectContent>
          {PLATFORMS.map((platform) => (
            <SelectItem key={platform.id} value={platform.id}>
              <div className="flex items-center gap-2">
                <span>{platform.icon}</span>
                <span>{platform.name}</span>
                <span className="text-sm text-muted-foreground">
                  {platform.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (mode === 'tabs') {
    return (
      <div className={`flex gap-1 p-1 bg-muted rounded-lg ${className}`}>
        {PLATFORMS.map((platform) => (
          <Button
            key={platform.id}
            variant={selectedPlatform === platform.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPlatformChange(platform.id)}
            disabled={disabled}
            className="flex items-center gap-2"
          >
            <span>{platform.icon}</span>
            <span>{platform.name}</span>
          </Button>
        ))}
      </div>
    );
  }

  // Mode: cards (default)
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {PLATFORMS.map((platform) => (
        <div
          key={platform.id}
          className={`
            relative p-6 border rounded-lg cursor-pointer transition-all
            ${selectedPlatform === platform.id 
              ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
              : 'border-border hover:border-primary/50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onClick={() => !disabled && onPlatformChange(platform.id)}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg ${platform.color} flex items-center justify-center text-white text-lg`}>
              {platform.icon}
            </div>
            <div>
              <h3 className="font-semibold">{platform.name}</h3>
              <p className="text-sm text-muted-foreground">{platform.description}</p>
            </div>
          </div>

          {/* Features */}
          {showFeatures && (
            <div className="space-y-2">
              {platform.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          )}

          {/* Selection indicator */}
          {selectedPlatform === platform.id && (
            <div className="absolute top-2 right-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-primary-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Componente para exibir informações da plataforma selecionada
interface PlatformInfoProps {
  platform: AdPlatform;
  className?: string;
}

export function PlatformInfo({ platform, className = '' }: PlatformInfoProps) {
  const platformInfo = PLATFORMS.find(p => p.id === platform);
  
  if (!platformInfo) return null;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`w-8 h-8 rounded-lg ${platformInfo.color} flex items-center justify-center text-white`}>
        {platformInfo.icon}
      </div>
      <div>
        <span className="font-medium">{platformInfo.name}</span>
        <span className="text-sm text-muted-foreground ml-2">
          {platformInfo.description}
        </span>
      </div>
    </div>
  );
}

// Badge para plataforma
interface PlatformBadgeProps {
  platform: AdPlatform;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function PlatformBadge({ 
  platform, 
  size = 'md', 
  showIcon = true,
  className = '' 
}: PlatformBadgeProps) {
  const platformInfo = PLATFORMS.find(p => p.id === platform);
  
  if (!platformInfo) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  return (
    <Badge 
      variant="secondary" 
      className={`${sizeClasses[size]} ${className}`}
    >
      {showIcon && <span className="mr-1">{platformInfo.icon}</span>}
      {platformInfo.name}
    </Badge>
  );
}

// Hook para obter informações da plataforma
export function usePlatformInfo(platform: AdPlatform) {
  return PLATFORMS.find(p => p.id === platform) || null;
}