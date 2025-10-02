import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  BarChart3, 
  Target, 
  Users, 
  Image, 
  Settings, 
  TrendingUp,
  Facebook,
  Chrome,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

interface AdsSidebarProps {
  clientId: string
}

export function AdsSidebar({ clientId }: AdsSidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedPlatform, setSelectedPlatform] = useState<'meta' | 'google'>('meta')
  const [expandedSections, setExpandedSections] = useState<string[]>(['campaigns'])

  useEffect(() => {
    const pathParts = location.pathname.split('/')
    const platform = pathParts.find(part => part === 'meta' || part === 'google')
    if (platform) {
      setSelectedPlatform(platform as 'meta' | 'google')
    }
  }, [location.pathname])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const isActive = (platform: string, section: string) => {
    return location.pathname.includes(`/${platform}/${section}`)
  }

  const handleNavigation = (platform: string, section: string) => {
    navigate(`/client/${clientId}/ads-manager/${platform}/${section}`)
  }

  const metaNavItems = [
    { 
      id: 'campaigns', 
      label: 'Campanhas', 
      icon: BarChart3, 
      count: 12,
      description: 'Gerencie suas campanhas'
    },
    { 
      id: 'adsets', 
      label: 'Conjuntos de anúncios', 
      icon: Users, 
      count: 45,
      description: 'Configure públicos e orçamentos'
    },
    { 
      id: 'ads', 
      label: 'Anúncios', 
      icon: Target, 
      count: 128,
      description: 'Crie e edite anúncios'
    },
    { 
      id: 'creatives', 
      label: 'Biblioteca criativa', 
      icon: Image, 
      count: 89,
      description: 'Gerencie imagens e vídeos'
    }
  ]

  const googleNavItems = [
    { 
      id: 'campaigns', 
      label: 'Campanhas', 
      icon: BarChart3, 
      count: 8,
      description: 'Gerencie suas campanhas'
    },
    { 
      id: 'adgroups', 
      label: 'Grupos de anúncios', 
      icon: Users, 
      count: 24,
      description: 'Configure grupos e palavras-chave'
    },
    { 
      id: 'ads', 
      label: 'Anúncios', 
      icon: Target, 
      count: 89,
      description: 'Crie e edite anúncios'
    },
    { 
      id: 'extensions', 
      label: 'Extensões', 
      icon: Image, 
      count: 15,
      description: 'Adicione extensões aos anúncios'
    }
  ]

  const toolsItems = [
    { 
      id: 'metrics', 
      label: 'Métricas', 
      icon: TrendingUp,
      description: 'Relatórios e análises'
    },
    { 
      id: 'settings', 
      label: 'Configurações', 
      icon: Settings,
      description: 'Configurações da conta'
    }
  ]

  const currentNavItems = selectedPlatform === 'meta' ? metaNavItems : googleNavItems

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Platform Selector */}
      <div className="p-4 border-b border-gray-200">
        <div className="space-y-2">
          <Button
            variant={selectedPlatform === 'meta' ? 'default' : 'ghost'}
            className={cn(
              "w-full justify-start h-10 px-3",
              selectedPlatform === 'meta' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'hover:bg-gray-100'
            )}
            onClick={() => {
              setSelectedPlatform('meta')
              handleNavigation('meta', 'campaigns')
            }}
          >
            <Facebook className="w-4 h-4 mr-3" />
            <span className="font-medium">Meta Ads</span>
          </Button>
          
          <Button
            variant={selectedPlatform === 'google' ? 'default' : 'ghost'}
            className={cn(
              "w-full justify-start h-10 px-3",
              selectedPlatform === 'google' 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'hover:bg-gray-100'
            )}
            onClick={() => {
              setSelectedPlatform('google')
              handleNavigation('google', 'campaigns')
            }}
          >
            <Chrome className="w-4 h-4 mr-3" />
            <span className="font-medium">Google Ads</span>
          </Button>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {/* Main Navigation */}
          <div className="space-y-1">
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Gerenciar
              </h3>
            </div>
            
            {currentNavItems.map((item) => {
              const Icon = item.icon
              const active = isActive(selectedPlatform, item.id)
              
              return (
                <div key={item.id}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between h-auto p-3 hover:bg-gray-50",
                      active && "bg-blue-50 border-r-2 border-blue-600 hover:bg-blue-50"
                    )}
                    onClick={() => handleNavigation(selectedPlatform, item.id)}
                  >
                    <div className="flex items-center">
                      <Icon className={cn(
                        "w-4 h-4 mr-3",
                        active ? "text-blue-600" : "text-gray-500"
                      )} />
                      <div className="text-left">
                        <div className={cn(
                          "text-sm font-medium",
                          active ? "text-blue-900" : "text-gray-900"
                        )}>
                          {item.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.description}
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-xs",
                        active ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                      )}
                    >
                      {item.count}
                    </Badge>
                  </Button>
                </div>
              )
            })}
          </div>

          <Separator className="my-4" />

          {/* Tools Section */}
          <div className="space-y-1">
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Ferramentas
              </h3>
            </div>
            
            {toolsItems.map((item) => {
              const Icon = item.icon
              const active = isActive(selectedPlatform, item.id)
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-auto p-3 hover:bg-gray-50",
                    active && "bg-blue-50 border-r-2 border-blue-600 hover:bg-blue-50"
                  )}
                  onClick={() => handleNavigation(selectedPlatform, item.id)}
                >
                  <Icon className={cn(
                    "w-4 h-4 mr-3",
                    active ? "text-blue-600" : "text-gray-500"
                  )} />
                  <div className="text-left">
                    <div className={cn(
                      "text-sm font-medium",
                      active ? "text-blue-900" : "text-gray-900"
                    )}>
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.description}
                    </div>
                  </div>
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Cliente: {clientId}
        </div>
      </div>
    </div>
  )
}