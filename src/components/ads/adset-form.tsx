// Formulário para criação/edição de conjuntos de anúncios com targeting

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Info, AlertCircle, Target, Users, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { AdSet, AdPlatform, BudgetType } from '@/types/ads';
import { useLimits, useTargetingOptions } from '@/hooks/use-ads';

// Schema de validação
const adSetSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome muito longo'),
  campaign_id: z.string().min(1, 'Campanha é obrigatória'),
  optimization_goal: z.string().min(1, 'Meta de otimização é obrigatória'),
  billing_event: z.string().min(1, 'Evento de cobrança é obrigatório'),
  bid_strategy: z.string().min(1, 'Estratégia de lance é obrigatória'),
  budget: z.number().min(1, 'Orçamento deve ser maior que 0'),
  budget_type: z.enum(['DAILY', 'LIFETIME']),
  bid_amount: z.number().optional(),
  start_time: z.date().optional(),
  end_time: z.date().optional(),
  status: z.enum(['ACTIVE', 'PAUSED', 'DRAFT']).default('DRAFT'),
  // Targeting
  targeting: z.object({
    age_min: z.number().min(13).max(65).optional(),
    age_max: z.number().min(13).max(65).optional(),
    genders: z.array(z.string()).optional(),
    locations: z.array(z.string()).optional(),
    interests: z.array(z.string()).optional(),
    behaviors: z.array(z.string()).optional(),
    custom_audiences: z.array(z.string()).optional(),
    lookalike_audiences: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    device_platforms: z.array(z.string()).optional(),
    placements: z.array(z.string()).optional(),
  }).optional(),
});

type AdSetFormData = z.infer<typeof adSetSchema>;

interface AdSetFormProps {
  adSet?: AdSet;
  campaignId?: string;
  platform: AdPlatform;
  onSubmit: (data: AdSetFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
}

// Configurações por plataforma
const PLATFORM_CONFIG = {
  META: {
    optimizationGoals: [
      { value: 'REACH', label: 'Alcance' },
      { value: 'IMPRESSIONS', label: 'Impressões' },
      { value: 'LINK_CLICKS', label: 'Cliques no link' },
      { value: 'POST_ENGAGEMENT', label: 'Engajamento' },
      { value: 'PAGE_LIKES', label: 'Curtidas na página' },
      { value: 'LEAD_GENERATION', label: 'Geração de leads' },
      { value: 'CONVERSIONS', label: 'Conversões' },
      { value: 'VIDEO_VIEWS', label: 'Visualizações de vídeo' },
      { value: 'MESSAGES', label: 'Mensagens' },
    ],
    billingEvents: [
      { value: 'IMPRESSIONS', label: 'Impressões' },
      { value: 'CLICKS', label: 'Cliques' },
      { value: 'CONVERSIONS', label: 'Conversões' },
      { value: 'VIDEO_VIEWS', label: 'Visualizações de vídeo' },
    ],
    bidStrategies: [
      { value: 'LOWEST_COST_WITHOUT_CAP', label: 'Menor custo' },
      { value: 'LOWEST_COST_WITH_BID_CAP', label: 'Menor custo com limite' },
      { value: 'TARGET_COST', label: 'Custo alvo' },
    ],
    placements: [
      { value: 'facebook_feeds', label: 'Feed do Facebook' },
      { value: 'facebook_stories', label: 'Stories do Facebook' },
      { value: 'facebook_reels', label: 'Reels do Facebook' },
      { value: 'instagram_feeds', label: 'Feed do Instagram' },
      { value: 'instagram_stories', label: 'Stories do Instagram' },
      { value: 'instagram_reels', label: 'Reels do Instagram' },
      { value: 'messenger', label: 'Messenger' },
      { value: 'audience_network', label: 'Audience Network' },
    ],
  },
  GOOGLE: {
    optimizationGoals: [
      { value: 'CLICKS', label: 'Cliques' },
      { value: 'IMPRESSIONS', label: 'Impressões' },
      { value: 'CONVERSIONS', label: 'Conversões' },
      { value: 'CONVERSION_VALUE', label: 'Valor de conversão' },
      { value: 'TARGET_CPA', label: 'CPA alvo' },
      { value: 'TARGET_ROAS', label: 'ROAS alvo' },
    ],
    billingEvents: [
      { value: 'CLICKS', label: 'Cliques (CPC)' },
      { value: 'IMPRESSIONS', label: 'Impressões (CPM)' },
      { value: 'CONVERSIONS', label: 'Conversões (CPA)' },
    ],
    bidStrategies: [
      { value: 'MANUAL_CPC', label: 'CPC manual' },
      { value: 'ENHANCED_CPC', label: 'CPC aprimorado' },
      { value: 'MAXIMIZE_CLICKS', label: 'Maximizar cliques' },
      { value: 'MAXIMIZE_CONVERSIONS', label: 'Maximizar conversões' },
      { value: 'TARGET_CPA', label: 'CPA alvo' },
      { value: 'TARGET_ROAS', label: 'ROAS alvo' },
    ],
    placements: [
      { value: 'google_search', label: 'Pesquisa do Google' },
      { value: 'search_partners', label: 'Parceiros de pesquisa' },
      { value: 'display_network', label: 'Rede de display' },
      { value: 'youtube', label: 'YouTube' },
      { value: 'gmail', label: 'Gmail' },
      { value: 'discover', label: 'Discover' },
    ],
  },
  TIKTOK: {
    optimizationGoals: [
      { value: 'REACH', label: 'Alcance' },
      { value: 'VIDEO_VIEWS', label: 'Visualizações de vídeo' },
      { value: 'TRAFFIC', label: 'Tráfego' },
      { value: 'CONVERSIONS', label: 'Conversões' },
      { value: 'APP_INSTALL', label: 'Instalações de app' },
      { value: 'LEAD_GENERATION', label: 'Geração de leads' },
    ],
    billingEvents: [
      { value: 'IMPRESSIONS', label: 'Impressões' },
      { value: 'CLICKS', label: 'Cliques' },
      { value: 'VIDEO_VIEWS', label: 'Visualizações de vídeo' },
      { value: 'CONVERSIONS', label: 'Conversões' },
    ],
    bidStrategies: [
      { value: 'LOWEST_COST', label: 'Menor custo' },
      { value: 'BID_CAP', label: 'Limite de lance' },
      { value: 'COST_CAP', label: 'Limite de custo' },
    ],
    placements: [
      { value: 'tiktok', label: 'TikTok' },
      { value: 'pangle', label: 'Pangle' },
      { value: 'global_app_bundle', label: 'Global App Bundle' },
    ],
  },
};

const GENDERS = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Feminino' },
  { value: 'unknown', label: 'Não especificado' },
];

const DEVICE_PLATFORMS = [
  { value: 'mobile', label: 'Mobile' },
  { value: 'desktop', label: 'Desktop' },
  { value: 'tablet', label: 'Tablet' },
];

export function AdSetForm({
  adSet,
  campaignId,
  platform,
  onSubmit,
  onCancel,
  loading = false,
  className = ''
}: AdSetFormProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const { checkLimits } = useLimits();
  const { getTargetingOptions } = useTargetingOptions();
  const [limitCheck, setLimitCheck] = useState<any>(null);
  const [targetingOptions, setTargetingOptions] = useState<any>({});

  const config = PLATFORM_CONFIG[platform];
  const isEditing = !!adSet;

  const form = useForm<AdSetFormData>({
    resolver: zodResolver(adSetSchema),
    defaultValues: {
      name: adSet?.name || '',
      campaign_id: adSet?.campaign_id || campaignId || '',
      optimization_goal: adSet?.optimization_goal || '',
      billing_event: adSet?.billing_event || '',
      bid_strategy: adSet?.bid_strategy || '',
      budget: adSet?.budget || 50,
      budget_type: adSet?.budget_type || 'DAILY',
      bid_amount: adSet?.bid_amount || undefined,
      start_time: adSet?.start_time ? new Date(adSet.start_time) : undefined,
      end_time: adSet?.end_time ? new Date(adSet.end_time) : undefined,
      status: adSet?.status || 'DRAFT',
      targeting: adSet?.targeting || {
        age_min: 18,
        age_max: 65,
        genders: [],
        locations: [],
        interests: [],
        behaviors: [],
        custom_audiences: [],
        lookalike_audiences: [],
        languages: [],
        device_platforms: ['mobile', 'desktop'],
        placements: [],
      },
    },
  });

  // Verificar limites e carregar opções de targeting
  useEffect(() => {
    if (!isEditing) {
      checkLimits('adset', platform).then(setLimitCheck);
    }
    getTargetingOptions(platform).then(setTargetingOptions);
  }, [platform, checkLimits, getTargetingOptions, isEditing]);

  const handleSubmit = async (data: AdSetFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Erro ao salvar conjunto de anúncios:', error);
    }
  };

  const watchBidStrategy = form.watch('bid_strategy');
  const needsBidAmount = watchBidStrategy?.includes('CAP') || watchBidStrategy?.includes('TARGET');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Verificação de limites */}
      {!isEditing && limitCheck && !limitCheck.allowed && (
        <Card className="border-destructive">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <CardTitle className="text-destructive">Limite atingido</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Você atingiu o limite de conjuntos de anúncios do seu plano atual.
            </p>
            <div className="mt-2 text-sm">
              <span className="font-medium">Limite atual:</span> {limitCheck.current}/{limitCheck.limit}
            </div>
          </CardContent>
        </Card>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                Básico
              </TabsTrigger>
              <TabsTrigger value="budget" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Orçamento
              </TabsTrigger>
              <TabsTrigger value="targeting" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Público
              </TabsTrigger>
              <TabsTrigger value="placements" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Posicionamentos
              </TabsTrigger>
            </TabsList>

            {/* Aba Básico */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações básicas</CardTitle>
                  <CardDescription>
                    Configure as informações principais do conjunto de anúncios
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do conjunto de anúncios</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Digite o nome do conjunto de anúncios" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="optimization_goal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta de otimização</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a meta de otimização" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {config.optimizationGoals.map((goal) => (
                              <SelectItem key={goal.value} value={goal.value}>
                                {goal.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Como você quer que o algoritmo otimize seus anúncios
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="billing_event"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Evento de cobrança</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {config.billingEvents.map((event) => (
                                <SelectItem key={event.value} value={event.value}>
                                  {event.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bid_strategy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estratégia de lance</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {config.bidStrategies.map((strategy) => (
                                <SelectItem key={strategy.value} value={strategy.value}>
                                  {strategy.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status inicial</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="DRAFT">Rascunho</SelectItem>
                            <SelectItem value="PAUSED">Pausado</SelectItem>
                            <SelectItem value="ACTIVE">Ativo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Orçamento */}
            <TabsContent value="budget" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Orçamento e lances</CardTitle>
                  <CardDescription>
                    Configure o orçamento e estratégia de lances
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Orçamento (R$)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              min="1"
                              step="0.01"
                              placeholder="50.00"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="budget_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de orçamento</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="DAILY">Diário</SelectItem>
                              <SelectItem value="LIFETIME">Total</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {needsBidAmount && (
                    <FormField
                      control={form.control}
                      name="bid_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor do lance (R$)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              min="0.01"
                              step="0.01"
                              placeholder="1.00"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                            />
                          </FormControl>
                          <FormDescription>
                            Valor máximo que você está disposto a pagar
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="start_time"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data de início (opcional)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP', { locale: ptBR })
                                  ) : (
                                    <span>Selecione uma data</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="end_time"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data de término (opcional)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP', { locale: ptBR })
                                  ) : (
                                    <span>Selecione uma data</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => {
                                  const startTime = form.getValues('start_time');
                                  return date < (startTime || new Date());
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Público */}
            <TabsContent value="targeting" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Definição de público</CardTitle>
                  <CardDescription>
                    Configure quem verá seus anúncios
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Demografia */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Demografia</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="targeting.age_min"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Idade mínima</FormLabel>
                            <FormControl>
                              <Input 
                                type="number"
                                min="13"
                                max="65"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="targeting.age_max"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Idade máxima</FormLabel>
                            <FormControl>
                              <Input 
                                type="number"
                                min="13"
                                max="65"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="targeting.genders"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gênero</FormLabel>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {GENDERS.map((gender) => {
                              const isSelected = field.value?.includes(gender.value);
                              return (
                                <Badge
                                  key={gender.value}
                                  variant={isSelected ? 'default' : 'outline'}
                                  className="cursor-pointer"
                                  onClick={() => {
                                    const current = field.value || [];
                                    if (isSelected) {
                                      field.onChange(current.filter(v => v !== gender.value));
                                    } else {
                                      field.onChange([...current, gender.value]);
                                    }
                                  }}
                                >
                                  {gender.label}
                                </Badge>
                              );
                            })}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Localização */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Localização</h4>
                    <FormField
                      control={form.control}
                      name="targeting.locations"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Localizações</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Digite cidades, estados ou países"
                              // Implementar autocomplete de localizações
                            />
                          </FormControl>
                          <FormDescription>
                            Adicione localizações onde seus anúncios devem aparecer
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Dispositivos */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Dispositivos</h4>
                    <FormField
                      control={form.control}
                      name="targeting.device_platforms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Plataformas de dispositivo</FormLabel>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {DEVICE_PLATFORMS.map((device) => {
                              const isSelected = field.value?.includes(device.value);
                              return (
                                <Badge
                                  key={device.value}
                                  variant={isSelected ? 'default' : 'outline'}
                                  className="cursor-pointer"
                                  onClick={() => {
                                    const current = field.value || [];
                                    if (isSelected) {
                                      field.onChange(current.filter(v => v !== device.value));
                                    } else {
                                      field.onChange([...current, device.value]);
                                    }
                                  }}
                                >
                                  {device.label}
                                </Badge>
                              );
                            })}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Posicionamentos */}
            <TabsContent value="placements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Posicionamentos</CardTitle>
                  <CardDescription>
                    Escolha onde seus anúncios aparecerão
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="targeting.placements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Posicionamentos disponíveis</FormLabel>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                          {config.placements.map((placement) => {
                            const isSelected = field.value?.includes(placement.value);
                            return (
                              <div
                                key={placement.value}
                                className={cn(
                                  'flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors',
                                  isSelected ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                                )}
                                onClick={() => {
                                  const current = field.value || [];
                                  if (isSelected) {
                                    field.onChange(current.filter(v => v !== placement.value));
                                  } else {
                                    field.onChange([...current, placement.value]);
                                  }
                                }}
                              >
                                <Checkbox checked={isSelected} readOnly />
                                <span className="text-sm">{placement.label}</span>
                              </div>
                            );
                          })}
                        </div>
                        <FormDescription>
                          Selecione onde você quer que seus anúncios apareçam
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Ações */}
          <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading || (!isEditing && limitCheck && !limitCheck.allowed)}
            >
              {loading ? 'Salvando...' : isEditing ? 'Atualizar conjunto' : 'Criar conjunto'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}