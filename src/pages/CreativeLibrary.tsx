import { useState, useMemo } from "react";
import { Plus, Grid3X3, List, Filter, Search, MoreHorizontal, Edit, Copy, TestTube, Play, Pause, Image, Video, Eye, MousePointer, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { MetricCard } from "@/components/ui/metric-card";

// Mock data para demonstração
const MOCK_CREATIVES = [
  {
    id: "cr_1",
    name: "Black Friday 50% OFF",
    type: "image",
    file_url: "https://via.placeholder.com/400x300/7A3FFF/FFFFFF?text=Black+Friday",
    thumbnail_url: "https://via.placeholder.com/400x300/7A3FFF/FFFFFF?text=Black+Friday",
    headline: "Não perca! 50% OFF em tudo",
    description: "Promoção especial por tempo limitado. Aproveite!",
    cta: "shop_now",
    platform: "facebook",
    format: "feed",
    objective: "conversions",
    target_audience: "Mulheres 25-45, Interesse em Moda",
    tags: ["Black Friday", "Desconto", "Promoção"],
    status: "active",
    loja: "Fashion Premium",
    metrics: {
      impressions: 125000,
      clicks: 5200,
      ctr: 4.16,
      conversions: 340,
      cpa: 8.38
    },
    version: 1
  },
  {
    id: "cr_2",
    name: "iPhone 15 Launch",
    type: "video",
    file_url: "https://via.placeholder.com/400x300/10B981/FFFFFF?text=iPhone+Video",
    thumbnail_url: "https://via.placeholder.com/400x300/10B981/FFFFFF?text=iPhone+Video",
    headline: "Novo iPhone 15 chegou!",
    description: "Tecnologia de ponta na palma da sua mão",
    cta: "learn_more",
    platform: "instagram",
    format: "reels",
    objective: "traffic",
    target_audience: "Homens 20-40, Interesse em Tecnologia",
    tags: ["iPhone", "Tecnologia", "Lançamento"],
    status: "testing",
    loja: "Tech Solutions",
    metrics: {
      impressions: 89000,
      clicks: 3400,
      ctr: 3.82,
      conversions: 156,
      cpa: 12.45
    },
    version: 2
  },
  {
    id: "cr_3",
    name: "Summer Collection",
    type: "carousel",
    file_url: "https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Summer",
    thumbnail_url: "https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Summer",
    headline: "Coleção Verão 2024",
    description: "Looks frescos para a estação mais quente",
    cta: "shop_now",
    platform: "facebook",
    format: "feed",
    objective: "conversions",
    target_audience: "Mulheres 18-35, Interesse em Fashion",
    tags: ["Verão", "Coleção", "Fashion"],
    status: "paused",
    loja: "Fashion Premium",
    metrics: {
      impressions: 67000,
      clicks: 2100,
      ctr: 3.13,
      conversions: 89,
      cpa: 15.20
    },
    version: 1
  }
];

const CTA_OPTIONS = [
  { value: "shop_now", label: "Comprar Agora" },
  { value: "learn_more", label: "Saiba Mais" },
  { value: "sign_up", label: "Cadastre-se" },
  { value: "contact_us", label: "Entre em Contato" },
  { value: "download", label: "Baixar App" }
];

const PLATFORM_OPTIONS = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "google", label: "Google Ads" },
  { value: "tiktok", label: "TikTok" }
];

// Creative Upload Modal Component
function CreativeUploadModal({ isOpen, onClose, onSave, initialData = null }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    type: initialData?.type || "image",
    headline: initialData?.headline || "",
    description: initialData?.description || "",
    cta: initialData?.cta || "shop_now",
    platform: initialData?.platform || "facebook",
    format: initialData?.format || "feed",
    objective: initialData?.objective || "conversions",
    target_audience: initialData?.target_audience || "",
    tags: initialData?.tags || [],
    status: initialData?.status || "draft"
  });

  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = () => {
    const creativeData = {
      ...formData,
      id: initialData?.id || `cr_${Date.now()}`,
      file_url: `https://via.placeholder.com/400x300/7A3FFF/FFFFFF?text=${encodeURIComponent(formData.name)}`,
      thumbnail_url: `https://via.placeholder.com/400x300/7A3FFF/FFFFFF?text=${encodeURIComponent(formData.name)}`,
      loja: "Fashion Premium", // Seria dinâmico baseado no workspace
      metrics: initialData?.metrics || {
        impressions: 0,
        clicks: 0,
        ctr: 0,
        conversions: 0,
        cpa: 0
      },
      version: initialData?.version || 1
    };

    onSave(creativeData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {initialData ? "Editar Criativo" : "Novo Criativo"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Image className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Arraste e solte seu arquivo aqui ou clique para selecionar
              </p>
              <Button variant="outline" size="sm">
                Selecionar Arquivo
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome do Criativo</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Black Friday 50% OFF"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Imagem</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="carousel">Carrossel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Headline</Label>
            <Input
              value={formData.headline}
              onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
              placeholder="Título principal do anúncio"
            />
          </div>

          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Texto de apoio do anúncio"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>CTA</Label>
              <Select value={formData.cta} onValueChange={(value) => setFormData(prev => ({ ...prev, cta: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CTA_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Plataforma</Label>
              <Select value={formData.platform} onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORM_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Adicionar tag"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                  {tag} ×
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="bg-gradient-primary hover:bg-gradient-primary/90 text-white">
              {initialData ? "Atualizar" : "Criar"} Criativo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// A/B Test Modal Component
function ABTestModal({ isOpen, onClose, onStart, creative }) {
  const [testConfig, setTestConfig] = useState({
    name: `Teste A/B - ${creative?.name || ""}`,
    metric: "ctr",
    duration: 7,
    budget_split: 50,
    creative_b_id: ""
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Configurar Teste A/B</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Criativo A */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Criativo A (Original)</h3>
              <div className="border border-border rounded-lg p-4">
                <img 
                  src={creative?.thumbnail_url} 
                  alt={creative?.name} 
                  className="w-full h-32 object-cover rounded-md mb-2" 
                />
                <p className="font-medium text-foreground">{creative?.name}</p>
                <p className="text-sm text-muted-foreground">{creative?.headline}</p>
              </div>
            </div>

            {/* Criativo B */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Criativo B (Variante)</h3>
              <Select value={testConfig.creative_b_id} onValueChange={(value) => setTestConfig(prev => ({ ...prev, creative_b_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar criativo" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_CREATIVES
                    .filter(c => c.id !== creative?.id)
                    .map(c => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome do Teste</Label>
              <Input
                value={testConfig.name}
                onChange={(e) => setTestConfig(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Métrica Principal</Label>
              <Select value={testConfig.metric} onValueChange={(value) => setTestConfig(prev => ({ ...prev, metric: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ctr">CTR (Taxa de Clique)</SelectItem>
                  <SelectItem value="conversions">Conversões</SelectItem>
                  <SelectItem value="cpa">CPA (Custo por Aquisição)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Duração (dias)</Label>
              <Input
                type="number"
                value={testConfig.duration}
                onChange={(e) => setTestConfig(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Divisão do Orçamento (%)</Label>
              <Input
                type="number"
                value={testConfig.budget_split}
                onChange={(e) => setTestConfig(prev => ({ ...prev, budget_split: parseInt(e.target.value) }))}
                max={100}
                min={0}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                onStart(testConfig);
                onClose();
              }}
              className="bg-gradient-primary hover:bg-gradient-primary/90 text-white"
            >
              Iniciar Teste A/B
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Creative Card Component
function CreativeCard({ creative, onEdit, onDuplicate, onABTest }) {
  const statusColors = {
    active: "bg-green-500/10 text-green-400 border-green-500/20",
    paused: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    testing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    draft: "bg-gray-500/10 text-gray-400 border-gray-500/20"
  };

  const statusLabels = {
    active: "Ativo",
    paused: "Pausado",
    testing: "Testando",
    draft: "Rascunho"
  };

  const platformColors = {
    facebook: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    instagram: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    google: "bg-green-500/10 text-green-400 border-green-500/20",
    tiktok: "bg-purple-500/10 text-purple-400 border-purple-500/20"
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-elegant transition-smooth group">
      <CardHeader className="pb-2">
        <div className="relative">
          {/* Image/Video */}
          <div className="relative rounded-lg overflow-hidden mb-3">
            <img 
              src={creative.thumbnail_url} 
              alt={creative.name}
              className="w-full h-40 object-cover"
            />
            {creative.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Play className="w-6 h-6 text-white ml-1" />
                </div>
              </div>
            )}
            
            {/* Status Badges */}
            <div className="absolute top-2 left-2 flex gap-2">
              <Badge variant="outline" className={statusColors[creative.status]}>
                {statusLabels[creative.status]}
              </Badge>
              <Badge variant="outline" className={platformColors[creative.platform]}>
                {creative.platform}
              </Badge>
            </div>

            {/* Actions Menu */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0 bg-black/50 hover:bg-black/70">
                    <MoreHorizontal className="w-4 h-4 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border">
                  <DropdownMenuItem onClick={() => onEdit(creative)} className="text-foreground hover:bg-accent/50">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(creative)} className="text-foreground hover:bg-accent/50">
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onABTest(creative)} className="text-foreground hover:bg-accent/50">
                    <TestTube className="w-4 h-4 mr-2" />
                    Teste A/B
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground truncate">{creative.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{creative.headline}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {creative.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {creative.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{creative.tags.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">Impressões</span>
            </div>
            <p className="font-semibold text-foreground">
              {creative.metrics.impressions.toLocaleString()}
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <MousePointer className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">CTR</span>
            </div>
            <p className="font-semibold text-green-400">
              {creative.metrics.ctr}%
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">Conversões</span>
            </div>
            <p className="font-semibold text-foreground">
              {creative.metrics.conversions}
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">CPA</span>
            </div>
            <p className="font-semibold text-foreground">
              R$ {creative.metrics.cpa}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CreativeLibrary() {
  const { currentWorkspace } = useWorkspace();
  const isGeneralWorkspace = currentWorkspace.type === "general";
  
  const [creatives, setCreatives] = useState(MOCK_CREATIVES);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagsFilter, setTagsFilter] = useState("");
  
  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showABTestModal, setShowABTestModal] = useState(false);
  const [editingCreative, setEditingCreative] = useState(null);
  const [testingCreative, setTestingCreative] = useState(null);

  // Filter creatives based on workspace and filters
  const filteredCreatives = useMemo(() => {
    return creatives.filter(creative => {
      // Workspace filter
      const matchesWorkspace = isGeneralWorkspace || creative.loja === currentWorkspace.name;
      
      // Search filter
      const matchesSearch = creative.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           creative.headline.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Type filter
      const matchesType = typeFilter === "all" || creative.type === typeFilter;
      
      // Platform filter
      const matchesPlatform = platformFilter === "all" || creative.platform === platformFilter;
      
      // Status filter
      const matchesStatus = statusFilter === "all" || creative.status === statusFilter;
      
      // Tags filter
      const matchesTags = !tagsFilter || creative.tags.some(tag => 
        tag.toLowerCase().includes(tagsFilter.toLowerCase())
      );
      
      return matchesWorkspace && matchesSearch && matchesType && matchesPlatform && matchesStatus && matchesTags;
    });
  }, [creatives, isGeneralWorkspace, currentWorkspace.name, searchTerm, typeFilter, platformFilter, statusFilter, tagsFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCreatives = filteredCreatives.length;
    const activeCreatives = filteredCreatives.filter(c => c.status === "active").length;
    const totalImpressions = filteredCreatives.reduce((sum, c) => sum + c.metrics.impressions, 0);
    const avgCTR = filteredCreatives.length > 0 
      ? filteredCreatives.reduce((sum, c) => sum + c.metrics.ctr, 0) / filteredCreatives.length 
      : 0;
    const avgCPA = filteredCreatives.length > 0 
      ? filteredCreatives.reduce((sum, c) => sum + c.metrics.cpa, 0) / filteredCreatives.length 
      : 0;

    return { totalCreatives, activeCreatives, totalImpressions, avgCTR, avgCPA };
  }, [filteredCreatives]);

  // Get common tags for quick filters
  const commonTags = useMemo(() => {
    const tagCounts = {};
    filteredCreatives.forEach(creative => {
      creative.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([tag]) => tag);
  }, [filteredCreatives]);

  const handleSaveCreative = (creativeData) => {
    if (editingCreative) {
      setCreatives(prev => prev.map(c => c.id === editingCreative.id ? creativeData : c));
    } else {
      setCreatives(prev => [...prev, creativeData]);
    }
    setEditingCreative(null);
  };

  const handleEditCreative = (creative) => {
    setEditingCreative(creative);
    setShowUploadModal(true);
  };

  const handleDuplicateCreative = (creative) => {
    const duplicated = {
      ...creative,
      id: `cr_${Date.now()}`,
      name: `${creative.name} - Cópia`,
      status: "draft"
    };
    setCreatives(prev => [...prev, duplicated]);
  };

  const handleABTest = (creative) => {
    setTestingCreative(creative);
    setShowABTestModal(true);
  };

  const handleStartABTest = (testConfig) => {
    console.log("Iniciando teste A/B:", testConfig);
    // Aqui seria feita a integração com a API para iniciar o teste
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Biblioteca de Criativos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os seus ativos criativos em um só lugar
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Exportar Relatório
          </Button>
          <Button 
            onClick={() => setShowUploadModal(true)}
            className="bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-glow"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Criativo
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Total de Criativos"
          value={stats.totalCreatives}
          icon={Image}
        />
        <MetricCard
          title="Criativos Ativos"
          value={stats.activeCreatives}
          change={`${((stats.activeCreatives / stats.totalCreatives) * 100).toFixed(1)}%`}
          changeType="positive"
          icon={Play}
        />
        <MetricCard
          title="Impressões Totais"
          value={stats.totalImpressions.toLocaleString()}
          icon={Eye}
        />
        <MetricCard
          title="CTR Médio"
          value={`${stats.avgCTR.toFixed(2)}%`}
          icon={MousePointer}
        />
        <MetricCard
          title="CPA Médio"
          value={`R$ ${stats.avgCPA.toFixed(2)}`}
          icon={DollarSign}
        />
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and View Mode */}
            <div className="flex gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome ou headline..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Filter Selects */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    <SelectItem value="image">Imagem</SelectItem>
                    <SelectItem value="video">Vídeo</SelectItem>
                    <SelectItem value="carousel">Carrossel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Plataforma</Label>
                <Select value={platformFilter} onValueChange={setPlatformFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Plataformas</SelectItem>
                    {PLATFORM_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="paused">Pausado</SelectItem>
                    <SelectItem value="testing">Testando</SelectItem>
                    <SelectItem value="draft">Rascunho</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Filtrar por Tags</Label>
                <Input
                  placeholder="Digite uma tag..."
                  value={tagsFilter}
                  onChange={(e) => setTagsFilter(e.target.value)}
                />
              </div>
            </div>

            {/* Quick Tag Filters */}
            {commonTags.length > 0 && (
              <div className="space-y-2">
                <Label>Tags Populares</Label>
                <div className="flex flex-wrap gap-2">
                  {commonTags.map(tag => (
                    <Button
                      key={tag}
                      variant="outline"
                      size="sm"
                      onClick={() => setTagsFilter(tag)}
                      className={tagsFilter === tag ? "bg-primary text-primary-foreground" : ""}
                    >
                      {tag}
                    </Button>
                  ))}
                  {tagsFilter && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTagsFilter("")}
                    >
                      Limpar Filtro
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCreatives.map(creative => (
            <CreativeCard
              key={creative.id}
              creative={creative}
              onEdit={handleEditCreative}
              onDuplicate={handleDuplicateCreative}
              onABTest={handleABTest}
            />
          ))}
        </div>
      ) : (
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardContent className="p-0">
            <div className="text-center py-12 text-muted-foreground">
              <List className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Visualização em lista será implementada em breve</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredCreatives.length === 0 && (
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardContent className="text-center py-12">
            <Image className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum criativo encontrado
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || typeFilter !== "all" || platformFilter !== "all" || statusFilter !== "all" || tagsFilter
                ? "Tente ajustar os filtros para encontrar seus criativos"
                : "Comece criando seu primeiro criativo"
              }
            </p>
            <Button 
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-primary hover:bg-gradient-primary/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Criativo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <CreativeUploadModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setEditingCreative(null);
        }}
        onSave={handleSaveCreative}
        initialData={editingCreative}
      />

      <ABTestModal
        isOpen={showABTestModal}
        onClose={() => {
          setShowABTestModal(false);
          setTestingCreative(null);
        }}
        onStart={handleStartABTest}
        creative={testingCreative}
      />
    </div>
  );
}