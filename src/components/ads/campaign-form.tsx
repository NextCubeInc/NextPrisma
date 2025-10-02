// Formulário modular para criação/edição de campanhas

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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Info, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { PlatformSelector } from './platform-selector';
import { Campaign, AdPlatform, BudgetType, BuyingType } from '@/types/ads';
import { useLimits } from '@/hooks/use-ads';

// Schema de validação
const campaignSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome muito longo'),
  platform: z.enum(['META', 'GOOGLE', 'TIKTOK']),
  objective: z.string().min(1, 'Objetivo é obrigatório'),
  budget: z.number().min(1, 'Orçamento deve ser maior que 0'),
  budget_type: z.enum(['DAILY', 'LIFETIME']),
  buying_type: z.enum(['AUCTION', 'REACH_AND_FREQUENCY']).optional(),
  start_time: z.date().optional(),
  end_time: z.date().optional(),
  special_ad_categories: z.array(z.string()).optional(),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'PAUSED', 'DRAFT']).default('DRAFT'),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CampaignFormProps {
  campaign?: Campaign;
  onSubmit: (data: CampaignFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
}

// Objetivos por plataforma
const PLATFORM_OBJECTIVES = {
  META: [
    { value: 'AWARENESS', label: 'Reconhecimento da marca' },
    { value: 'TRAFFIC', label: 'Tráfego' },
    { value: 'ENGAGEMENT', label: 'Engajamento' },
    { value: 'LEAD_GENERATION', label: 'Geração de leads' },
    { value: 'CONVERSIONS', label: 'Conversões' },
    { value: 'CATALOG_SALES', label: 'Vendas do catálogo' },
    { value: 'STORE_VISITS', label: 'Visitas à loja' },
    { value: 'REACH', label: 'Alcance' },
    { value: 'VIDEO_VIEWS', label: 'Visualizações de vídeo' },
    { value: 'MESSAGES', label: 'Mensagens' },
  ],
  GOOGLE: [
    { value: 'SEARCH', label: 'Campanhas de pesquisa' },
    { value: 'DISPLAY', label: 'Campanhas de display' },
    { value: 'SHOPPING', label: 'Campanhas de shopping' },
    { value: 'VIDEO', label: 'Campanhas de vídeo' },
    { value: 'APP', label: 'Campanhas de app' },
    { value: 'SMART', label: 'Campanhas inteligentes' },
    { value: 'DISCOVERY', label: 'Campanhas de descoberta' },
    { value: 'LOCAL', label: 'Campanhas locais' },
  ],
  TIKTOK: [
    { value: 'REACH', label: 'Alcance' },
    { value: 'TRAFFIC', label: 'Tráfego' },
    { value: 'VIDEO_VIEWS', label: 'Visualizações de vídeo' },
    { value: 'LEAD_GENERATION', label: 'Geração de leads' },
    { value: 'CONVERSIONS', label: 'Conversões' },
    { value: 'APP_PROMOTION', label: 'Promoção de app' },
    { value: 'CATALOG_SALES', label: 'Vendas do catálogo' },
  ],
};

// Categorias especiais de anúncios
const SPECIAL_AD_CATEGORIES = [
  { value: 'CREDIT', label: 'Crédito' },
  { value: 'EMPLOYMENT', label: 'Emprego' },
  { value: 'HOUSING', label: 'Habitação' },
  { value: 'SOCIAL_ISSUES', label: 'Questões sociais' },
  { value: 'POLITICS', label: 'Política' },
];

export function CampaignForm({
  campaign,
  onSubmit,
  onCancel,
  loading = false,
  className = ''
}: CampaignFormProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<AdPlatform>(
    campaign?.platform || 'META'
  );
  const { checkLimits } = useLimits();
  const [limitCheck, setLimitCheck] = useState<any>(null);

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: campaign?.name || '',
      platform: campaign?.platform || 'META',
      objective: campaign?.objective || '',
      budget: campaign?.budget || 100,
      budget_type: campaign?.budget_type || 'DAILY',
      buying_type: campaign?.buying_type || 'AUCTION',
      start_time: campaign?.start_time ? new Date(campaign.start_time) : undefined,
      end_time: campaign?.end_time ? new Date(campaign.end_time) : undefined,
      special_ad_categories: campaign?.special_ad_categories || [],
      description: campaign?.description || '',
      status: campaign?.status || 'DRAFT',
    },
  });

  // Verificar limites quando a plataforma mudar
  useEffect(() => {
    if (!campaign) { // Apenas para novas campanhas
      checkLimits('campaign', selectedPlatform).then(setLimitCheck);
    }
  }, [selectedPlatform, checkLimits, campaign]);

  const handlePlatformChange = (platform: AdPlatform) => {
    setSelectedPlatform(platform);
    form.setValue('platform', platform);
    form.setValue('objective', ''); // Reset objetivo quando mudar plataforma
  };

  const handleSubmit = async (data: CampaignFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Erro ao salvar campanha:', error);
    }
  };

  const objectives = PLATFORM_OBJECTIVES[selectedPlatform] || [];
  const isEditing = !!campaign;

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
              Você atingiu o limite de campanhas do seu plano atual. 
              Faça upgrade para criar mais campanhas.
            </p>
            <div className="mt-2 text-sm">
              <span className="font-medium">Limite atual:</span> {limitCheck.current}/{limitCheck.limit}
            </div>
          </CardContent>
        </Card>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Informações básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações básicas</CardTitle>
              <CardDescription>
                Configure as informações principais da campanha
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da campanha</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Digite o nome da campanha" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plataforma</FormLabel>
                    <FormControl>
                      <PlatformSelector
                        value={field.value}
                        onChange={handlePlatformChange}
                        disabled={isEditing}
                        variant="select"
                      />
                    </FormControl>
                    <FormDescription>
                      {isEditing ? 'A plataforma não pode ser alterada após a criação' : 
                       'Selecione a plataforma onde a campanha será executada'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="objective"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objetivo da campanha</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o objetivo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {objectives.map((objective) => (
                          <SelectItem key={objective.value} value={objective.value}>
                            {objective.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      O objetivo determina como a plataforma otimizará sua campanha
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o propósito da campanha"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Configurações de orçamento */}
          <Card>
            <CardHeader>
              <CardTitle>Orçamento e cronograma</CardTitle>
              <CardDescription>
                Configure o orçamento e período de execução da campanha
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
                          placeholder="100.00"
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
                          <SelectItem value="LIFETIME">Total da campanha</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {selectedPlatform === 'META' && (
                <FormField
                  control={form.control}
                  name="buying_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de compra</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="AUCTION">Leilão</SelectItem>
                          <SelectItem value="REACH_AND_FREQUENCY">
                            Alcance e frequência
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Leilão é recomendado para a maioria das campanhas
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
                      <FormDescription>
                        Se não definida, a campanha iniciará imediatamente
                      </FormDescription>
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
                      <FormDescription>
                        Se não definida, a campanha executará indefinidamente
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Configurações avançadas */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações avançadas</CardTitle>
              <CardDescription>
                Configurações opcionais para casos específicos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="special_ad_categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categorias especiais de anúncios</FormLabel>
                    <FormDescription>
                      Selecione se sua campanha se enquadra em categorias especiais
                    </FormDescription>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {SPECIAL_AD_CATEGORIES.map((category) => {
                        const isSelected = field.value?.includes(category.value);
                        return (
                          <Badge
                            key={category.value}
                            variant={isSelected ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => {
                              const current = field.value || [];
                              if (isSelected) {
                                field.onChange(current.filter(v => v !== category.value));
                              } else {
                                field.onChange([...current, category.value]);
                              }
                            }}
                          >
                            {category.label}
                          </Badge>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        <SelectItem value="PAUSED">Pausada</SelectItem>
                        <SelectItem value="ACTIVE">Ativa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Campanhas ativas começarão a veicular imediatamente
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading || (!isEditing && limitCheck && !limitCheck.allowed)}
            >
              {loading ? 'Salvando...' : isEditing ? 'Atualizar campanha' : 'Criar campanha'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}