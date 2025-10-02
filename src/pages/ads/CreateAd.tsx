import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Stepper, Step } from '@/components/ui/stepper';
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  Video, 
  Type, 
  Link as LinkIcon,
  Eye,
  Upload,
  Play,
  FileText,
  Smartphone,
  Monitor,
  Tablet,
  MousePointer,
  Heart,
  MessageCircle,
  Share,
  ShoppingCart,
  Download,
  Phone,
  Mail,
  Calendar,
  MapPin,
  ExternalLink,
  Zap,
  Target,
  Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Interfaces
interface AdFormData {
  // Step 1: Configurações Básicas
  name: string;
  adsetId: string;
  status: string;
  
  // Step 2: Formato e Criativo
  adFormat: string;
  creativeType: string;
  primaryText: string;
  headline: string;
  description: string;
  
  // Step 3: Mídia
  imageUrl: string;
  videoUrl: string;
  carouselImages: string[];
  
  // Step 4: Destino
  destinationUrl: string;
  displayUrl: string;
  callToAction: string;
  
  // Step 5: Configurações Avançadas
  trackingParams: string;
  pixelEvents: string[];
  customConversions: string[];
}

// Formatos de anúncio disponíveis
const adFormats = [
  {
    id: 'SINGLE_IMAGE',
    title: 'Imagem Única',
    description: 'Um anúncio com uma única imagem',
    icon: ImageIcon,
    recommended: true
  },
  {
    id: 'SINGLE_VIDEO',
    title: 'Vídeo Único',
    description: 'Um anúncio com um único vídeo',
    icon: Video,
    recommended: true
  },
  {
    id: 'CAROUSEL',
    title: 'Carrossel',
    description: 'Múltiplas imagens ou vídeos',
    icon: ImageIcon,
    recommended: false
  },
  {
    id: 'COLLECTION',
    title: 'Coleção',
    description: 'Vitrine de produtos',
    icon: ShoppingCart,
    recommended: false
  }
];

// Chamadas para ação
const callToActions = [
  { value: 'LEARN_MORE', label: 'Saiba Mais', icon: ExternalLink },
  { value: 'SHOP_NOW', label: 'Compre Agora', icon: ShoppingCart },
  { value: 'SIGN_UP', label: 'Inscreva-se', icon: Download },
  { value: 'DOWNLOAD', label: 'Baixar', icon: Download },
  { value: 'CONTACT_US', label: 'Entre em Contato', icon: Phone },
  { value: 'SEND_MESSAGE', label: 'Enviar Mensagem', icon: MessageCircle },
  { value: 'CALL_NOW', label: 'Ligar Agora', icon: Phone },
  { value: 'APPLY_NOW', label: 'Candidatar-se', icon: FileText },
  { value: 'BOOK_TRAVEL', label: 'Reservar Viagem', icon: Calendar },
  { value: 'GET_DIRECTIONS', label: 'Como Chegar', icon: MapPin },
];

// Dispositivos de preview
const previewDevices = [
  { id: 'mobile', label: 'Mobile', icon: Smartphone },
  { id: 'desktop', label: 'Desktop', icon: Monitor },
  { id: 'tablet', label: 'Tablet', icon: Tablet },
];

export default function CreateAd() {
  const navigate = useNavigate();
  const { clientId, adsetId } = useParams();
  
  const [formData, setFormData] = useState<AdFormData>({
    // Step 1: Configurações Básicas
    name: '',
    adsetId: adsetId || '',
    status: 'PAUSED',
    
    // Step 2: Formato e Criativo
    adFormat: 'SINGLE_IMAGE',
    creativeType: 'IMAGE',
    primaryText: '',
    headline: '',
    description: '',
    
    // Step 3: Mídia
    imageUrl: '',
    videoUrl: '',
    carouselImages: [],
    
    // Step 4: Destino
    destinationUrl: '',
    displayUrl: '',
    callToAction: 'LEARN_MORE',
    
    // Step 5: Configurações Avançadas
    trackingParams: '',
    pixelEvents: [],
    customConversions: [],
  });

  const [previewDevice, setPreviewDevice] = useState('mobile');

  const handleInputChange = (field: keyof AdFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInputChange = (field: keyof AdFormData, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter(item => item !== value)
    }));
  };

  const handleFinalStepCompleted = async () => {
    try {
      console.log('Criando anúncio:', formData);
      // Aqui seria feita a chamada para a API
      navigate(`/client/${clientId}/ads-manager/meta/ads`);
    } catch (error) {
      console.error('Erro ao criar anúncio:', error);
    }
  };

  // Step 1: Configurações Básicas
  const renderStep1 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Configurações Básicas
          </CardTitle>
          <CardDescription>
            Defina as informações fundamentais do seu anúncio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ad-name">Nome do Anúncio</Label>
            <Input
              id="ad-name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ex: Anúncio Produto - Público Jovem"
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Este nome é apenas para organização interna
            </p>
          </div>

          <div>
            <Label>Status Inicial</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PAUSED">Pausado</SelectItem>
                <SelectItem value="ACTIVE">Ativo</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              Recomendamos iniciar pausado para revisar antes de ativar
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Step 2: Formato e Criativo
  const renderStep2 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Formato do Anúncio
          </CardTitle>
          <CardDescription>
            Escolha como seu anúncio será exibido
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Formato do Anúncio */}
          <div>
            <Label className="text-base font-medium">Formato</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              {adFormats.map((format) => (
                <Card 
                  key={format.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-md",
                    formData.adFormat === format.id 
                      ? "ring-2 ring-blue-500 bg-blue-50" 
                      : "hover:bg-gray-50"
                  )}
                  onClick={() => handleInputChange('adFormat', format.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <format.icon className="w-5 h-5 mt-1 text-blue-600" />
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            {format.title}
                            {format.recommended && (
                              <Badge variant="secondary" className="text-xs">Recomendado</Badge>
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">{format.description}</p>
                        </div>
                      </div>
                      {formData.adFormat === format.id && (
                        <Badge variant="default">Selecionado</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Textos do Anúncio */}
          <div>
            <Label className="text-base font-medium">Textos do Anúncio</Label>
            <div className="space-y-4 mt-3">
              <div>
                <Label htmlFor="primary-text">Texto Principal</Label>
                <Textarea
                  id="primary-text"
                  value={formData.primaryText}
                  onChange={(e) => handleInputChange('primaryText', e.target.value)}
                  placeholder="Escreva o texto principal que aparecerá no seu anúncio..."
                  className="mt-1"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.primaryText.length}/125 caracteres recomendados
                </p>
              </div>

              <div>
                <Label htmlFor="headline">Título</Label>
                <Input
                  id="headline"
                  value={formData.headline}
                  onChange={(e) => handleInputChange('headline', e.target.value)}
                  placeholder="Título chamativo para seu anúncio"
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.headline.length}/40 caracteres recomendados
                </p>
              </div>

              <div>
                <Label htmlFor="description">Descrição (Opcional)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descrição adicional"
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.description.length}/30 caracteres recomendados
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Step 3: Mídia
  const renderStep3 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Mídia do Anúncio
          </CardTitle>
          <CardDescription>
            Adicione imagens ou vídeos ao seu anúncio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.adFormat === 'SINGLE_IMAGE' && (
            <div>
              <Label>Imagem do Anúncio</Label>
              <div className="mt-2">
                {formData.imageUrl ? (
                  <div className="relative">
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="w-full max-w-md h-48 object-cover rounded-lg border"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="absolute top-2 right-2"
                      onClick={() => handleInputChange('imageUrl', '')}
                    >
                      Remover
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Adicionar Imagem</h4>
                    <p className="text-gray-500 mb-4">Arraste uma imagem ou clique para selecionar</p>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Selecionar Imagem
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Recomendado: 1200x628 pixels, formato JPG ou PNG
              </p>
            </div>
          )}

          {formData.adFormat === 'SINGLE_VIDEO' && (
            <div>
              <Label>Vídeo do Anúncio</Label>
              <div className="mt-2">
                {formData.videoUrl ? (
                  <div className="relative">
                    <video 
                      src={formData.videoUrl} 
                      className="w-full max-w-md h-48 object-cover rounded-lg border"
                      controls
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="absolute top-2 right-2"
                      onClick={() => handleInputChange('videoUrl', '')}
                    >
                      Remover
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Video className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Adicionar Vídeo</h4>
                    <p className="text-gray-500 mb-4">Arraste um vídeo ou clique para selecionar</p>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Selecionar Vídeo
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Recomendado: MP4, máximo 4GB, 15 segundos para melhor performance
              </p>
            </div>
          )}

          {/* Especificações Técnicas */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-900 mb-2">Especificações Recomendadas</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Proporção: 1.91:1 (Feed) ou 9:16 (Stories)</p>
                <p>• Resolução mínima: 1080x1080 pixels</p>
                <p>• Formato: JPG, PNG (imagens) ou MP4 (vídeos)</p>
                <p>• Tamanho máximo: 30MB (imagens) ou 4GB (vídeos)</p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );

  // Step 4: Destino
  const renderStep4 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Destino do Anúncio
          </CardTitle>
          <CardDescription>
            Configure para onde as pessoas irão quando clicarem
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* URL de Destino */}
          <div>
            <Label htmlFor="destination-url">URL de Destino</Label>
            <Input
              id="destination-url"
              value={formData.destinationUrl}
              onChange={(e) => handleInputChange('destinationUrl', e.target.value)}
              placeholder="https://seusite.com/pagina-destino"
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              A página para onde as pessoas serão direcionadas
            </p>
          </div>

          {/* URL de Exibição */}
          <div>
            <Label htmlFor="display-url">URL de Exibição (Opcional)</Label>
            <Input
              id="display-url"
              value={formData.displayUrl}
              onChange={(e) => handleInputChange('displayUrl', e.target.value)}
              placeholder="seusite.com"
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              URL simplificada que aparecerá no anúncio
            </p>
          </div>

          {/* Chamada para Ação */}
          <div>
            <Label className="text-base font-medium">Chamada para Ação</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
              {callToActions.map((cta) => (
                <Card 
                  key={cta.value}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-sm",
                    formData.callToAction === cta.value 
                      ? "ring-2 ring-blue-500 bg-blue-50" 
                      : "hover:bg-gray-50"
                  )}
                  onClick={() => handleInputChange('callToAction', cta.value)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <cta.icon className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">{cta.label}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Parâmetros de Rastreamento */}
          <div>
            <Label htmlFor="tracking-params">Parâmetros UTM (Opcional)</Label>
            <Input
              id="tracking-params"
              value={formData.trackingParams}
              onChange={(e) => handleInputChange('trackingParams', e.target.value)}
              placeholder="utm_source=facebook&utm_medium=cpc&utm_campaign=promocao"
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Para rastrear a origem do tráfego no Google Analytics
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Step 5: Preview e Revisar
  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Preview do Anúncio
            </CardTitle>
            <CardDescription>
              Veja como seu anúncio aparecerá
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Seletor de Dispositivo */}
            <div className="flex gap-2 mb-4">
              {previewDevices.map((device) => (
                <Button
                  key={device.id}
                  variant={previewDevice === device.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewDevice(device.id)}
                >
                  <device.icon className="w-4 h-4 mr-1" />
                  {device.label}
                </Button>
              ))}
            </div>

            {/* Preview do Anúncio */}
            <div className={cn(
              "border rounded-lg p-4 bg-white",
              previewDevice === 'mobile' && "max-w-sm mx-auto",
              previewDevice === 'tablet' && "max-w-md mx-auto",
              previewDevice === 'desktop' && "max-w-lg"
            )}>
              {/* Header do Post */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">S</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Sua Empresa</p>
                  <p className="text-xs text-gray-500">Patrocinado</p>
                </div>
              </div>

              {/* Texto Principal */}
              {formData.primaryText && (
                <p className="text-sm mb-3">{formData.primaryText}</p>
              )}

              {/* Mídia */}
              <div className="mb-3">
                {formData.adFormat === 'SINGLE_IMAGE' && formData.imageUrl ? (
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded"
                  />
                ) : formData.adFormat === 'SINGLE_VIDEO' && formData.videoUrl ? (
                  <video 
                    src={formData.videoUrl} 
                    className="w-full h-48 object-cover rounded"
                    controls
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Link Preview */}
              <div className="border rounded p-3 bg-gray-50">
                <p className="text-xs text-gray-500 uppercase mb-1">
                  {formData.displayUrl || 'seusite.com'}
                </p>
                <h4 className="font-medium text-sm mb-1">
                  {formData.headline || 'Título do seu anúncio'}
                </h4>
                {formData.description && (
                  <p className="text-xs text-gray-600">{formData.description}</p>
                )}
              </div>

              {/* CTA Button */}
              <Button className="w-full mt-3" size="sm">
                {callToActions.find(cta => cta.value === formData.callToAction)?.label || 'Saiba Mais'}
              </Button>

              {/* Engajamento */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <div className="flex gap-4">
                  <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600">
                    <Heart className="w-4 h-4" />
                    <span className="text-xs">Curtir</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs">Comentar</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600">
                    <Share className="w-4 h-4" />
                    <span className="text-xs">Compartilhar</span>
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumo */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Anúncio</CardTitle>
            <CardDescription>
              Revise todas as configurações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Configurações Básicas</h4>
              <div className="text-sm space-y-1">
                <p><span className="text-muted-foreground">Nome:</span> {formData.name || 'Não definido'}</p>
                <p><span className="text-muted-foreground">Status:</span> {formData.status === 'PAUSED' ? 'Pausado' : 'Ativo'}</p>
                <p><span className="text-muted-foreground">Formato:</span> {adFormats.find(f => f.id === formData.adFormat)?.title}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Conteúdo</h4>
              <div className="text-sm space-y-1">
                <p><span className="text-muted-foreground">Texto principal:</span> {formData.primaryText ? `${formData.primaryText.substring(0, 50)}...` : 'Não definido'}</p>
                <p><span className="text-muted-foreground">Título:</span> {formData.headline || 'Não definido'}</p>
                <p><span className="text-muted-foreground">CTA:</span> {callToActions.find(cta => cta.value === formData.callToAction)?.label}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Destino</h4>
              <div className="text-sm space-y-1">
                <p><span className="text-muted-foreground">URL:</span> {formData.destinationUrl || 'Não definido'}</p>
                {formData.trackingParams && (
                  <p><span className="text-muted-foreground">UTM:</span> Configurado</p>
                )}
              </div>
            </div>

            {/* Aviso */}
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-1">Pronto para Criar!</h4>
              <p className="text-sm text-green-800">
                Seu anúncio será criado pausado. Você pode ativá-lo após a revisão.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/client/${clientId}/ads-manager/meta/ads`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Criar Anúncio</h1>
              <p className="text-muted-foreground">Meta Ads Manager</p>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <Stepper
          onFinalStepCompleted={handleFinalStepCompleted}
          onCancel={() => navigate(`/client/${clientId}/ads-manager/meta/ads`)}
          backButtonText="Anterior"
          nextButtonText="Próximo"
          completeButtonText="Criar Anúncio"
        >
          <Step 
            title="Configurações Básicas"
            description="Nome e status do anúncio"
            isValid={() => formData.name.length > 0}
          >
            {renderStep1()}
          </Step>
          
          <Step 
            title="Formato e Criativo"
            description="Textos e formato do anúncio"
            isValid={() => formData.primaryText.length > 0 && formData.headline.length > 0}
          >
            {renderStep2()}
          </Step>
          
          <Step 
            title="Mídia"
            description="Imagens ou vídeos"
            isValid={() => 
              (formData.adFormat === 'SINGLE_IMAGE' && formData.imageUrl.length > 0) ||
              (formData.adFormat === 'SINGLE_VIDEO' && formData.videoUrl.length > 0) ||
              formData.adFormat === 'CAROUSEL' ||
              formData.adFormat === 'COLLECTION'
            }
          >
            {renderStep3()}
          </Step>
          
          <Step 
            title="Destino"
            description="URL e chamada para ação"
            isValid={() => formData.destinationUrl.length > 0}
          >
            {renderStep4()}
          </Step>
          
          <Step 
            title="Preview e Revisar"
            description="Visualize e confirme"
            isValid={() => true}
          >
            {renderStep5()}
          </Step>
        </Stepper>
      </div>
    </div>
  );
}