// Biblioteca de criativos com upload e gestão

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Upload,
  Image,
  Video,
  FileText,
  MoreHorizontal,
  Download,
  Edit,
  Trash2,
  Eye,
  Copy,
  Search,
  Filter,
  Grid3X3,
  List,
  Play,
  Pause
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Creative, AdPlatform } from '@/types/ads';
import { PlatformBadge } from './platform-selector';
import { StatusBadge } from './status-badge';

interface CreativeLibraryProps {
  creatives: Creative[];
  onUpload: (files: File[], metadata: CreativeMetadata) => Promise<void>;
  onEdit: (creative: Creative) => void;
  onDelete: (creative: Creative) => void;
  onSelect?: (creative: Creative) => void;
  onPreview: (creative: Creative) => void;
  selectable?: boolean;
  selectedCreatives?: Set<string>;
  loading?: boolean;
  className?: string;
}

interface CreativeMetadata {
  name: string;
  platform: AdPlatform;
  type: 'IMAGE' | 'VIDEO' | 'CAROUSEL' | 'COLLECTION';
  format: string;
  tags?: string[];
}

interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export function CreativeLibrary({
  creatives,
  onUpload,
  onEdit,
  onDelete,
  onSelect,
  onPreview,
  selectable = false,
  selectedCreatives = new Set(),
  loading = false,
  className = ''
}: CreativeLibraryProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [uploadMetadata, setUploadMetadata] = useState<CreativeMetadata>({
    name: '',
    platform: 'META',
    type: 'IMAGE',
    format: '',
    tags: []
  });

  // Filtrar criativos
  const filteredCreatives = React.useMemo(() => {
    return creatives.filter(creative => {
      const matchesSearch = creative.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           creative.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === 'all' || creative.type === filterType;
      const matchesPlatform = filterPlatform === 'all' || creative.platform === filterPlatform;
      
      return matchesSearch && matchesType && matchesPlatform;
    });
  }, [creatives, searchTerm, filterType, filterPlatform]);

  // Configuração do dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newUploads: UploadProgress[] = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const
    }));
    
    setUploadProgress(newUploads);
    
    // Simular upload com progresso
    newUploads.forEach((upload, index) => {
      const interval = setInterval(() => {
        setUploadProgress(prev => 
          prev.map((item, i) => 
            i === index && item.status === 'uploading'
              ? { ...item, progress: Math.min(item.progress + 10, 100) }
              : item
          )
        );
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(prev => 
          prev.map((item, i) => 
            i === index ? { ...item, progress: 100, status: 'completed' } : item
          )
        );
      }, 2000);
    });

    // Chamar função de upload após completar
    setTimeout(() => {
      onUpload(acceptedFiles, uploadMetadata);
      setUploadProgress([]);
      setUploadDialogOpen(false);
    }, 2500);
  }, [onUpload, uploadMetadata]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.webm']
    },
    multiple: true
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'IMAGE':
        return <Image className="w-4 h-4" />;
      case 'VIDEO':
        return <Video className="w-4 h-4" />;
      case 'CAROUSEL':
        return <Grid3X3 className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const CreativeCard = ({ creative }: { creative: Creative }) => (
    <Card 
      className={cn(
        'group cursor-pointer transition-all hover:shadow-md',
        selectable && selectedCreatives.has(creative.id) && 'ring-2 ring-primary'
      )}
      onClick={() => selectable && onSelect?.(creative)}
    >
      <CardContent className="p-4">
        <div className="aspect-video bg-muted rounded-lg mb-3 relative overflow-hidden">
          {creative.thumbnail_url ? (
            <img 
              src={creative.thumbnail_url} 
              alt={creative.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {getFileIcon(creative.type)}
            </div>
          )}
          
          {/* Overlay com ações */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                onPreview(creative);
              }}
            >
              <Eye className="w-4 h-4" />
            </Button>
            {creative.type === 'VIDEO' && (
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  // Play video
                }}
              >
                <Play className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-sm truncate flex-1">{creative.name}</h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onPreview(creative)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(creative)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicar
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(creative)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <PlatformBadge platform={creative.platform} size="sm" />
            <Badge variant="outline" className="text-xs">
              {creative.type}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{creative.format}</span>
            <span>{formatFileSize(creative.file_size || 0)}</span>
          </div>

          <StatusBadge status={creative.status} size="sm" />
        </div>
      </CardContent>
    </Card>
  );

  const CreativeListItem = ({ creative }: { creative: Creative }) => (
    <div 
      className={cn(
        'flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50',
        selectable && selectedCreatives.has(creative.id) && 'bg-primary/5 border-primary'
      )}
      onClick={() => selectable && onSelect?.(creative)}
    >
      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
        {creative.thumbnail_url ? (
          <img 
            src={creative.thumbnail_url} 
            alt={creative.name}
            className="w-full h-full object-cover"
          />
        ) : (
          getFileIcon(creative.type)
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{creative.name}</h4>
        <div className="flex items-center gap-2 mt-1">
          <PlatformBadge platform={creative.platform} size="sm" />
          <Badge variant="outline" className="text-xs">
            {creative.type}
          </Badge>
          <span className="text-sm text-muted-foreground">{creative.format}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <StatusBadge status={creative.status} size="sm" />
        <span className="text-sm text-muted-foreground">
          {formatFileSize(creative.file_size || 0)}
        </span>
        <span className="text-sm text-muted-foreground">
          {new Date(creative.created_at).toLocaleDateString('pt-BR')}
        </span>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onPreview(creative)}>
              <Eye className="w-4 h-4 mr-2" />
              Visualizar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(creative)}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="w-4 h-4 mr-2" />
              Duplicar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="w-4 h-4 mr-2" />
              Download
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(creative)}
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Barra de ferramentas */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar criativos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">Todos os tipos</option>
            <option value="IMAGE">Imagens</option>
            <option value="VIDEO">Vídeos</option>
            <option value="CAROUSEL">Carrossel</option>
            <option value="COLLECTION">Coleção</option>
          </select>

          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">Todas as plataformas</option>
            <option value="META">Meta</option>
            <option value="GOOGLE">Google</option>
            <option value="TIKTOK">TikTok</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload de criativos</DialogTitle>
                <DialogDescription>
                  Faça upload de imagens e vídeos para sua biblioteca
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Metadados */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nome</label>
                    <Input
                      value={uploadMetadata.name}
                      onChange={(e) => setUploadMetadata(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome do criativo"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Plataforma</label>
                    <select
                      value={uploadMetadata.platform}
                      onChange={(e) => setUploadMetadata(prev => ({ ...prev, platform: e.target.value as AdPlatform }))}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="META">Meta</option>
                      <option value="GOOGLE">Google</option>
                      <option value="TIKTOK">TikTok</option>
                    </select>
                  </div>
                </div>

                {/* Área de upload */}
                <div
                  {...getRootProps()}
                  className={cn(
                    'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                    isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
                  )}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  {isDragActive ? (
                    <p>Solte os arquivos aqui...</p>
                  ) : (
                    <div>
                      <p className="text-lg font-medium">Arraste arquivos aqui ou clique para selecionar</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Suporte para imagens (PNG, JPG, GIF, WebP) e vídeos (MP4, MOV, AVI, WebM)
                      </p>
                    </div>
                  )}
                </div>

                {/* Progresso do upload */}
                {uploadProgress.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Fazendo upload...</h4>
                    {uploadProgress.map((upload, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="truncate">{upload.file.name}</span>
                          <span>{upload.progress}%</span>
                        </div>
                        <Progress value={upload.progress} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Lista de criativos */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="aspect-video bg-muted animate-pulse rounded-lg mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded"></div>
                  <div className="h-3 bg-muted animate-pulse rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCreatives.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Image className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">Nenhum criativo encontrado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm || filterType !== 'all' || filterPlatform !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Comece fazendo upload de seus primeiros criativos'
              }
            </p>
            {!searchTerm && filterType === 'all' && filterPlatform === 'all' && (
              <Button onClick={() => setUploadDialogOpen(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Fazer upload
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCreatives.map((creative) => (
            <CreativeCard key={creative.id} creative={creative} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredCreatives.map((creative) => (
            <CreativeListItem key={creative.id} creative={creative} />
          ))}
        </div>
      )}

      {/* Informações de seleção */}
      {selectable && selectedCreatives.size > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
          {selectedCreatives.size} criativo(s) selecionado(s)
        </div>
      )}
    </div>
  );
}