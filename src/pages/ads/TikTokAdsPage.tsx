import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Play, 
  Pause, 
  MoreHorizontal,
  TrendingUp,
  Eye,
  MousePointer,
  DollarSign
} from 'lucide-react';

export default function TikTokAdsPage() {
  const [activeTab, setActiveTab] = useState('campaigns');

  const metrics = [
    {
      title: 'Impressões',
      value: '2.1M',
      change: '+12.5%',
      icon: Eye,
      color: 'text-blue-600'
    },
    {
      title: 'Cliques',
      value: '45.2K',
      change: '+8.3%',
      icon: MousePointer,
      color: 'text-green-600'
    },
    {
      title: 'CTR',
      value: '2.15%',
      change: '+0.3%',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Gasto',
      value: 'R$ 8.450',
      change: '+15.2%',
      icon: DollarSign,
      color: 'text-red-600'
    }
  ];

  const campaigns = [
    {
      id: 1,
      name: 'Campanha de Reconhecimento - TikTok',
      status: 'Ativa',
      budget: 'R$ 500/dia',
      impressions: '125.4K',
      clicks: '2.8K',
      ctr: '2.24%',
      spent: 'R$ 1.250'
    },
    {
      id: 2,
      name: 'Promoção de Verão - TikTok',
      status: 'Pausada',
      budget: 'R$ 300/dia',
      impressions: '89.2K',
      clicks: '1.9K',
      ctr: '2.13%',
      spent: 'R$ 890'
    },
    {
      id: 3,
      name: 'Lançamento de Produto - TikTok',
      status: 'Ativa',
      budget: 'R$ 750/dia',
      impressions: '198.7K',
      clicks: '4.2K',
      ctr: '2.11%',
      spent: 'R$ 2.100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">TikTok Ads Manager</h1>
          <p className="text-muted-foreground">Gerencie suas campanhas do TikTok Ads</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Criar Campanha
        </Button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                    <p className={`text-sm ${metric.color}`}>{metric.change}</p>
                  </div>
                  <IconComponent className={`w-8 h-8 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted">
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-background">
            Campanhas
          </TabsTrigger>
          <TabsTrigger value="adgroups" className="data-[state=active]:bg-background">
            Grupos de Anúncios
          </TabsTrigger>
          <TabsTrigger value="ads" className="data-[state=active]:bg-background">
            Anúncios
          </TabsTrigger>
          <TabsTrigger value="audiences" className="data-[state=active]:bg-background">
            Públicos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          {/* Filters and Actions */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex flex-1 gap-2">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input 
                      placeholder="Pesquisar campanhas..." 
                      className="pl-10 bg-background border-input"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="border-input">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-input">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaigns Table */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Campanhas Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Nome da Campanha</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Orçamento</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Impressões</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Cliques</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">CTR</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Gasto</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-foreground">{campaign.name}</div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant={campaign.status === 'Ativa' ? 'default' : 'secondary'}
                            className={campaign.status === 'Ativa' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                          >
                            {campaign.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{campaign.budget}</td>
                        <td className="py-3 px-4 text-muted-foreground">{campaign.impressions}</td>
                        <td className="py-3 px-4 text-muted-foreground">{campaign.clicks}</td>
                        <td className="py-3 px-4 text-muted-foreground">{campaign.ctr}</td>
                        <td className="py-3 px-4 text-muted-foreground">{campaign.spent}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              {campaign.status === 'Ativa' ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adgroups" className="space-y-4">
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium text-foreground mb-2">Grupos de Anúncios</h3>
              <p className="text-muted-foreground">Gerencie seus grupos de anúncios do TikTok aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ads" className="space-y-4">
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium text-foreground mb-2">Anúncios</h3>
              <p className="text-muted-foreground">Visualize e gerencie seus anúncios individuais do TikTok.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audiences" className="space-y-4">
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium text-foreground mb-2">Públicos</h3>
              <p className="text-muted-foreground">Crie e gerencie seus públicos-alvo do TikTok.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}