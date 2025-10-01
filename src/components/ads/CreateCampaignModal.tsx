import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Target, DollarSign, Users, Zap, ShoppingCart, Heart, MessageCircle, Eye, MousePointer } from 'lucide-react'

interface CreateCampaignModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const campaignObjectives = [
  {
    id: 'AWARENESS',
    name: 'Reconhecimento',
    description: 'Aumentar o conhecimento da marca',
    icon: <Eye className="h-5 w-5" />,
    category: 'awareness'
  },
  {
    id: 'REACH',
    name: 'Alcance',
    description: 'Mostrar anúncios para o máximo de pessoas',
    icon: <Users className="h-5 w-5" />,
    category: 'awareness'
  },
  {
    id: 'TRAFFIC',
    name: 'Tráfego',
    description: 'Direcionar pessoas para seu site',
    icon: <MousePointer className="h-5 w-5" />,
    category: 'consideration'
  },
  {
    id: 'ENGAGEMENT',
    name: 'Engajamento',
    description: 'Obter mais curtidas, comentários e compartilhamentos',
    icon: <Heart className="h-5 w-5" />,
    category: 'consideration'
  },
  {
    id: 'LEAD_GENERATION',
    name: 'Geração de Leads',
    description: 'Coletar informações de contato',
    icon: <Target className="h-5 w-5" />,
    category: 'consideration'
  },
  {
    id: 'MESSAGES',
    name: 'Mensagens',
    description: 'Incentivar conversas no Messenger',
    icon: <MessageCircle className="h-5 w-5" />,
    category: 'consideration'
  },
  {
    id: 'CONVERSIONS',
    name: 'Conversões',
    description: 'Incentivar ações valiosas no site',
    icon: <Zap className="h-5 w-5" />,
    category: 'conversion'
  },
  {
    id: 'CATALOG_SALES',
    name: 'Vendas do Catálogo',
    description: 'Promover produtos do catálogo',
    icon: <ShoppingCart className="h-5 w-5" />,
    category: 'conversion'
  }
]

const bidStrategies = [
  { id: 'LOWEST_COST_WITHOUT_CAP', name: 'Menor custo', description: 'Obter o máximo de resultados pelo menor custo' },
  { id: 'LOWEST_COST_WITH_BID_CAP', name: 'Limite de lance', description: 'Controlar quanto você paga por resultado' },
  { id: 'TARGET_COST', name: 'Custo desejado', description: 'Manter um custo médio por resultado' },
  { id: 'LOWEST_COST_WITH_MIN_ROAS', name: 'ROAS mínimo', description: 'Manter um retorno mínimo sobre o investimento' }
]

export function CreateCampaignModal({ open, onOpenChange, onSuccess }: CreateCampaignModalProps) {
  const { user } = useAuth()
  const { activeClient } = useWorkspace()
  
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  
  // Dados da campanha
  const [campaignName, setCampaignName] = useState('')
  const [objective, setObjective] = useState('')
  const [budgetType, setBudgetType] = useState<'DAILY' | 'LIFETIME'>('DAILY')
  const [budget, setBudget] = useState('')
  const [bidStrategy, setBidStrategy] = useState('')
  const [bidAmount, setBidAmount] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleSubmit = async () => {
    if (!user || !activeClient) return

    try {
      setLoading(true)

      // Buscar o ID correto do usuário
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single()

      if (userError) throw userError

      // Criar campanha
      const { error: campaignError } = await supabase
        .from('ads_campaigns')
        .insert({
          account_id: activeClient.id,
          user_id: userData.id,
          name: campaignName,
          objective: objective,
          budget_type: budgetType,
          budget: parseFloat(budget),
          bid_strategy: bidStrategy,
          status: 'PAUSED'
        })

      if (campaignError) throw campaignError

      onSuccess()
      onOpenChange(false)
      resetForm()
    } catch (error) {
      console.error('Erro ao criar campanha:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setCampaignName('')
    setObjective('')
    setBudgetType('DAILY')
    setBudget('')
    setBidStrategy('')
    setBidAmount('')
    setStartDate('')
    setEndDate('')
  }

  const getObjectivesByCategory = (category: string) => {
    return campaignObjectives.filter(obj => obj.category === category)
  }

  const selectedObjective = campaignObjectives.find(obj => obj.id === objective)

  const canProceedToStep2 = campaignName && objective
  const canSubmit = canProceedToStep2 && budget && bidStrategy

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Criar Nova Campanha
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Indicador de Etapas */}
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                1
              </div>
              <span>Objetivo</span>
            </div>
            <div className="w-8 h-px bg-border" />
            <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                2
              </div>
              <span>Orçamento</span>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              {/* Nome da Campanha */}
              <div className="space-y-2">
                <Label htmlFor="campaignName">Nome da Campanha</Label>
                <Input
                  id="campaignName"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Ex: Campanha de Verão 2024"
                />
              </div>

              {/* Objetivos */}
              <div className="space-y-4">
                <Label>Objetivo da Campanha</Label>
                
                {/* Reconhecimento */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      RECONHECIMENTO
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <RadioGroup value={objective} onValueChange={setObjective}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {getObjectivesByCategory('awareness').map((obj) => (
                          <div key={obj.id} className="flex items-start space-x-3">
                            <RadioGroupItem value={obj.id} id={obj.id} className="mt-1" />
                            <div className="flex-1 cursor-pointer" onClick={() => setObjective(obj.id)}>
                              <div className="flex items-center gap-2 mb-1">
                                {obj.icon}
                                <Label htmlFor={obj.id} className="font-medium cursor-pointer">
                                  {obj.name}
                                </Label>
                              </div>
                              <p className="text-sm text-muted-foreground">{obj.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Consideração */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      CONSIDERAÇÃO
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <RadioGroup value={objective} onValueChange={setObjective}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {getObjectivesByCategory('consideration').map((obj) => (
                          <div key={obj.id} className="flex items-start space-x-3">
                            <RadioGroupItem value={obj.id} id={obj.id} className="mt-1" />
                            <div className="flex-1 cursor-pointer" onClick={() => setObjective(obj.id)}>
                              <div className="flex items-center gap-2 mb-1">
                                {obj.icon}
                                <Label htmlFor={obj.id} className="font-medium cursor-pointer">
                                  {obj.name}
                                </Label>
                              </div>
                              <p className="text-sm text-muted-foreground">{obj.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Conversão */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      CONVERSÃO
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <RadioGroup value={objective} onValueChange={setObjective}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {getObjectivesByCategory('conversion').map((obj) => (
                          <div key={obj.id} className="flex items-start space-x-3">
                            <RadioGroupItem value={obj.id} id={obj.id} className="mt-1" />
                            <div className="flex-1 cursor-pointer" onClick={() => setObjective(obj.id)}>
                              <div className="flex items-center gap-2 mb-1">
                                {obj.icon}
                                <Label htmlFor={obj.id} className="font-medium cursor-pointer">
                                  {obj.name}
                                </Label>
                              </div>
                              <p className="text-sm text-muted-foreground">{obj.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Resumo do Objetivo */}
              {selectedObjective && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      {selectedObjective.icon}
                      <div>
                        <h3 className="font-medium">{selectedObjective.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedObjective.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tipo de Orçamento */}
              <div className="space-y-3">
                <Label>Tipo de Orçamento</Label>
                <RadioGroup value={budgetType} onValueChange={(value: 'DAILY' | 'LIFETIME') => setBudgetType(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="DAILY" id="daily" />
                    <Label htmlFor="daily">Orçamento diário</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="LIFETIME" id="lifetime" />
                    <Label htmlFor="lifetime">Orçamento vitalício</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Valor do Orçamento */}
              <div className="space-y-2">
                <Label htmlFor="budget">
                  Orçamento {budgetType === 'DAILY' ? 'Diário' : 'Vitalício'} (R$)
                </Label>
                <Input
                  id="budget"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="0.00"
                  min="1"
                  step="0.01"
                />
              </div>

              {/* Estratégia de Lance */}
              <div className="space-y-3">
                <Label>Estratégia de Lance</Label>
                <RadioGroup value={bidStrategy} onValueChange={setBidStrategy}>
                  {bidStrategies.map((strategy) => (
                    <div key={strategy.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <RadioGroupItem value={strategy.id} id={strategy.id} className="mt-1" />
                      <div className="flex-1 cursor-pointer" onClick={() => setBidStrategy(strategy.id)}>
                        <Label htmlFor={strategy.id} className="font-medium cursor-pointer">
                          {strategy.name}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">{strategy.description}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Valor do Lance (se aplicável) */}
              {(bidStrategy === 'LOWEST_COST_WITH_BID_CAP' || bidStrategy === 'TARGET_COST') && (
                <div className="space-y-2">
                  <Label htmlFor="bidAmount">
                    {bidStrategy === 'TARGET_COST' ? 'Custo Desejado (R$)' : 'Limite de Lance (R$)'}
                  </Label>
                  <Input
                    id="bidAmount"
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                  />
                </div>
              )}

              {/* Datas (Opcional) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data de Início (Opcional)</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Data de Término (Opcional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex justify-between w-full">
            <div>
              {step === 2 && (
                <Button variant="outline" onClick={() => setStep(1)}>
                  Voltar
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              {step === 1 ? (
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!canProceedToStep2}
                >
                  Continuar
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={!canSubmit || loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Criando...' : 'Criar Campanha'}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}