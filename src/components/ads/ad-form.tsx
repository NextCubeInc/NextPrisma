// Formulário para criação e edição de anúncios

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertTriangle,
  Plus,
  Image,
  Video,
  ExternalLink,
  Eye,
  Settings,
  Target,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Ad, AdSet, Creative, AdPlatform, AdStatus } from '@/types/ads';
import { useLimits } from '@/hooks/use-ads';
import { CreativeLibrary } from './creative-library';

const adFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome muito longo'),
  ad_set_id: z.string().min(1, 'Conjunto de anúncios é obrigatório'),
  creative_id: z.string().min(1, 'Criativo é obrigatório'),
  headline: z.string().min(1, 'Título é obrigatório').max(255, 'Título muito longo'),
  description: z.string().max(500, 'Descrição muito longa').optional(),
  call_to_action: z.string().optional(),
  destination_url: z.string().url('URL inválida').optional(),
  display_url: z.string().optional(),
  tracking_urls: z.record(z.string()).optional(),
  status: z.enum(['ACTIVE', 'PAUSED', 'ARCHIVED']).default('PAUSED'),
  
  // Configurações específicas da plataforma
  platform_config: z.object({
    // Meta específico
    instagram_actor_id: z.string().optional(),
    page_id: z.string().optional(),
    
    // Google específico
    final_urls: z.array(z.string()).optional(),
    path1: z.string().optional(),
    path2: z.string().optional(),
    
    // TikTok específico
    identity_type: z.enum(['CUSTOMIZED_USER', 'AUTHORIZED_BC']).optional(),
    identity_id: z.string().optional(),
  }).optional(),
});

type AdFormData = z.infer<typeof adFormSchema>;

interface AdFormProps {
  ad?: Ad;
  adSets: AdSet[];
  creatives: Creative[];
  platform: AdPlatform;
  onSubmit: (data: AdFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
}

export function AdForm({
  ad,
  adSets,
  creatives,
  platform,
  onSubmit,
  onCancel,
  loading = false,
  className = ''
}: AdFormProps) {
  const [selectedCreative, setSelectedCreative] = useState<Creative | null>(
    ad ? creatives.find(c => c.id === ad.creative_id) || null : null
  );
  const [creativeLibraryOpen, setCreativeLibraryOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');

  const { checkLimits } = useLimits();
  const [limitsCheck, setLimitsCheck] = useState<any>(null);

  const form = useForm<AdFormData>({
    resolver: zodResolver(adFormSchema),
    defaultValues: {
      name: ad?.name || '',
      ad_set_id: ad?.ad_set_id || '',
      creative_id: ad?.creative_id || '',
      headline: ad?.headline || '',
      description: ad?.description || '',
      call_to_action: ad?.call_to_action || '',
      destination_url: ad?.destination_url || '',
      display_url: ad?.display_url || '',
      tracking_urls: ad?.tracking_urls || {},
      status: ad?.status || 'PAUSED',
      platform_config: ad?.platform_config || {},
    },
  });

  // Verificar limites ao carregar
  useEffect(() => {
    if (!ad) {
      checkLimits('ads', platform).then(setLimitsCheck);
    }
  }, [ad, platform, checkLimits]);

  // Atualizar criativo selecionado quando o ID mudar
  useEffect(() => {
    const creativeId = form.watch('creative_id');
    if (creativeId) {
      const creative = creatives.find(c => c.id === creativeId);
      setSelectedCreative(creative || null);
    }
  }, [form.watch('creative_id'), creatives]);

  const handleSubmit = async (data: AdFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Erro ao salvar anúncio:', error);
    }
  };

  const handleCreativeSelect = (creative: Creative) => {
    form.setValue('creative_id', creative.id);
    setSelectedCreative(creative);
    setCreativeLibraryOpen(false);
  };

  const getCallToActionOptions = () => {
    switch (platform) {
      case 'META':
        return [
          { value: 'LEARN_MORE', label: 'Saiba mais' },
          { value: 'SHOP_NOW', label: 'Compre agora' },
          { value: 'BOOK_TRAVEL', label: 'Reserve viagem' },
          { value: 'DOWNLOAD', label: 'Download' },
          { value: 'SIGN_UP', label: 'Inscreva-se' },
          { value: 'WATCH_MORE', label: 'Assista mais' },
          { value: 'CONTACT_US', label: 'Entre em contato' },
          { value: 'APPLY_NOW', label: 'Candidate-se' },
          { value: 'GET_QUOTE', label: 'Solicitar orçamento' },
        ];
      case 'GOOGLE':
        return [
          { value: 'LEARN_MORE', label: 'Saiba mais' },
          { value: 'SHOP_NOW', label: 'Compre agora' },
          { value: 'DOWNLOAD', label: 'Download' },
          { value: 'SIGN_UP', label: 'Inscreva-se' },
          { value: 'CONTACT_US', label: 'Entre em contato' },
          { value: 'GET_QUOTE', label: 'Solicitar orçamento' },
        ];
      case 'TIKTOK':
        return [
          { value: 'LEARN_MORE', label: 'Saiba mais' },
          { value: 'SHOP_NOW', label: 'Compre agora' },
          { value: 'DOWNLOAD', label: 'Download' },
          { value: 'SIGN_UP', label: 'Inscreva-se' },
          { value: 'CONTACT_US', label: 'Entre em contato' },
        ];
      default:
        return [];
    }
  };

  const AdPreview = () => {
    if (!selectedCreative) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Pré-visualização</h4>
          <div className="flex items-center gap-2">
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
            >
              Mobile
            </Button>
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
            >
              Desktop
            </Button>
          </div>
        </div>

        <div className={cn(
          'border rounded-lg p-4 bg-white',
          previewMode === 'mobile' ? 'max-w-sm mx-auto' : 'max-w-md'
        )}>
          {/* Cabeçalho do anúncio */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">Sua Empresa</div>
              <div className="text-xs text-muted-foreground">Patrocinado</div>
            </div>
          </div>

          {/* Conteúdo do anúncio */}
          <div className="space-y-3">
            {form.watch('headline') && (
              <h3 className="font-medium text-sm leading-tight">
                {form.watch('headline')}
              </h3>
            )}

            {form.watch('description') && (
              <p className="text-sm text-muted-foreground">
                {form.watch('description')}
              </p>
            )}

            {/* Mídia */}
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              {selectedCreative.thumbnail_url ? (
                <img 
                  src={selectedCreative.thumbnail_url} 
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {selectedCreative.type === 'VIDEO' ? (
                    <Video className="w-8 h-8 text-muted-foreground" />
                  ) : (
                    <Image className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
              )}
            </div>

            {/* Call to Action */}
            {form.watch('call_to_action') && (
              <Button className="w-full" size="sm">
                {getCallToActionOptions().find(
                  option => option.value === form.watch('call_to_action')
                )?.label || form.watch('call_to_action')}
              </Button>
            )}

            {/* URL de exibição */}
            {form.watch('display_url') && (
              <div className="text-xs text-muted-foreground">
                {form.watch('display_url')}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Verificação de limites */}
      {!ad && limitsCheck && !limitsCheck.allowed && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Você atingiu o limite de {limitsCheck.limit} anúncios do seu plano atual.
            Considere fazer upgrade para criar mais anúncios.
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulário principal */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações básicas</CardTitle>
                  <CardDescription>
                    Configure as informações principais do anúncio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do anúncio</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Anúncio Produto X - Público Y" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ad_set_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conjunto de anúncios</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um conjunto de anúncios" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {adSets.map((adSet) => (
                              <SelectItem key={adSet.id} value={adSet.id}>
                                {adSet.name}
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
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status inicial</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ACTIVE">Ativo</SelectItem>
                            <SelectItem value="PAUSED">Pausado</SelectItem>
                            <SelectItem value="ARCHIVED">Arquivado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Criativo</CardTitle>
                  <CardDescription>
                    Selecione o criativo que será usado neste anúncio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedCreative ? (
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                        {selectedCreative.thumbnail_url ? (
                          <img 
                            src={selectedCreative.thumbnail_url} 
                            alt={selectedCreative.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {selectedCreative.type === 'VIDEO' ? (
                              <Video className="w-6 h-6 text-muted-foreground" />
                            ) : (
                              <Image className="w-6 h-6 text-muted-foreground" />
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{selectedCreative.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {selectedCreative.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {selectedCreative.format}
                          </span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCreativeLibraryOpen(true)}
                      >
                        Alterar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-24 border-dashed"
                      onClick={() => setCreativeLibraryOpen(true)}
                    >
                      <Plus className="w-6 h-6 mr-2" />
                      Selecionar criativo
                    </Button>
                  )}

                  <FormField
                    control={form.control}
                    name="creative_id"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Conteúdo do anúncio</CardTitle>
                  <CardDescription>
                    Configure o texto e chamadas para ação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="headline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título principal</FormLabel>
                        <FormControl>
                          <Input placeholder="Título chamativo do seu anúncio" {...field} />
                        </FormControl>
                        <FormDescription>
                          Máximo 255 caracteres
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
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descrição detalhada do produto ou serviço"
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Máximo 500 caracteres
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="call_to_action"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chamada para ação</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma ação" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {getCallToActionOptions().map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>URLs e rastreamento</CardTitle>
                  <CardDescription>
                    Configure os links de destino e rastreamento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="destination_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de destino</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://seusite.com/pagina-destino"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Para onde os usuários serão direcionados ao clicar
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="display_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de exibição</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="seusite.com"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          URL simplificada mostrada no anúncio
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Pré-visualização */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Pré-visualização
                  </CardTitle>
                  <CardDescription>
                    Veja como seu anúncio aparecerá para os usuários
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AdPreview />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading || (!ad && limitsCheck && !limitsCheck.allowed)}
            >
              {loading ? 'Salvando...' : ad ? 'Atualizar anúncio' : 'Criar anúncio'}
            </Button>
          </div>
        </form>
      </Form>

      {/* Dialog da biblioteca de criativos */}
      <Dialog open={creativeLibraryOpen} onOpenChange={setCreativeLibraryOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Selecionar criativo</DialogTitle>
            <DialogDescription>
              Escolha um criativo da sua biblioteca para usar neste anúncio
            </DialogDescription>
          </DialogHeader>
          
          <CreativeLibrary
            creatives={creatives.filter(c => c.platform === platform)}
            onUpload={async () => {}} // Implementar se necessário
            onEdit={() => {}}
            onDelete={() => {}}
            onSelect={handleCreativeSelect}
            onPreview={() => {}}
            selectable={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}