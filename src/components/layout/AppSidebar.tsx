import { 
  Home, 
  Target, 
  Megaphone, 
  Globe, 
  BarChart3, 
  TrendingUp, 
  CreditCard,
  Crown,
  Settings,
  User,
  Users,
  Key,
  AlertTriangle,
  MessageSquare,
  Lightbulb,
  Monitor,
  Facebook,
  Search,
  Music,
  ChevronRight,
  Lock,
  Building2,
  FileText,
  Zap
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarRail
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { NavUser } from "./components/NavUser";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Ícones para cada tipo de integração
const getIntegrationIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'meta':
    case 'facebook':
      return Facebook;
    case 'google':
    case 'google_ads':
      return Search;
    case 'tiktok':
    case 'tiktok_ads':
      return Music;
    default:
      return Megaphone;
  }
};

// Menu items dinâmicos baseados no cliente ativo
const getMenuItems = (
  activeClient: any, 
  integrations: any[], 
  userPlan: any,
  checkPlanLimit: any
) => {
  // Se não há cliente ativo, mostra apenas menu geral
  if (!activeClient) {
    return {
      generalMenus: [
        { title: "Home", url: "/", icon: Home },
        //{ title: "Clientes", url: "/clientes", icon: Building2 },
      ],
      integrationMenus: []
    };
  }

  // Menus do workspace ativo (cliente selecionado)
  const workspaceMenus = [
    { title: "Dashboard", url: `/client/${activeClient.id}/dashboard`, icon: BarChart3 },
    { title: "Meta", url: `/client/${activeClient.id}/ads-manager/meta/campaigns`, icon: Facebook },
    { title: "Google ADS", url: `/client/${activeClient.id}/ads-manager/google/campaigns`, icon: Search },
    { title: "TikTok ADS", url: `/client/${activeClient.id}/ads-manager/tiktok/campaigns`, icon: Music },
    { title: "Relatórios", url: `/client/${activeClient.id}/reports`, icon: FileText },
    { title: "Integrações", url: `/client/${activeClient.id}/integrations`, icon: Zap },
    { title: "Alertas", url: `/client/${activeClient.id}/alerts`, icon: AlertTriangle },
  ];

  // Menus de integração baseados nas contas do cliente
  const integrationMenus = integrations.map(integration => ({
    title: integration.integration_name || integration.integration_type,
    url: `/client/${activeClient.id}/integration/${integration.id}`,
    icon: getIntegrationIcon(integration.integration_type),
    type: integration.integration_type,
    status: integration.status
  }));

  return { 
    workspaceMenus, 
    integrationMenus, 
    generalMenus: []
  };
};

export function AppSidebar() {
  const { state, open } = useSidebar();
  const location = useLocation();
  const { 
    activeClient, 
    integrations, 
    userPlan, 
    checkPlanLimit,
    isInClientWorkspace 
  } = useWorkspace();

  const isActive = (path: string) => location.pathname === path;
  const hasActiveChild = (items: any[]) => 
    items?.some(item => isActive(item.url));

  const { generalMenus, workspaceMenus, integrationMenus } = getMenuItems(
    activeClient, 
    integrations, 
    userPlan, 
    checkPlanLimit
  );

  const handleUpgradeClick = async () => {
    toast.info("Redirecionando para upgrade de plano...");
  };

  return (
    <Sidebar collapsible="icon" >
      {/*Header*/}
     { open ? (
     <SidebarHeader className="flex items-start justify-center border-b-[1px]">
      <div>
        <div className="flex items-center gap-4">
          <div className=" h-auto w-[39px] flex items-center justify-center">
            <img src="/src/assets/PrismaLogod.png" alt="" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground text-[40px]">PrismaID</h1>
          </div>
        </div>
      </div>
      </SidebarHeader >
      ):(
      <SidebarHeader className="flex items-start justify-center border-b-[1px] h-auto pl-1">
      <div>
        <div className="">
          <div className="w-[39px] flex items-center">
            <img src="src/assets/PrismaLogod.png" alt=""/>
          </div>
        </div>
      </div>
      </SidebarHeader >
      )}

      {/*CONTENT*/}
      <SidebarContent>
        {/* Seletor de Cliente */}
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/clientes">
                    <Building2 className="h-4 w-4" />
                    <span>{activeClient ? activeClient.name : "Selecionar Cliente"}</span>
                    {activeClient && (
                      <Badge variant="secondary" className="ml-auto">
                        Ativo
                      </Badge>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Menu Geral (quando não há cliente ativo) */}
        {!isInClientWorkspace && generalMenus.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Navegação</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {generalMenus.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <NavLink to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Menu do Workspace Ativo */}
        {isInClientWorkspace && workspaceMenus && workspaceMenus.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>
              {activeClient?.name || "Cliente"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {workspaceMenus.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <NavLink to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Menu de Integrações */}
        {isInClientWorkspace && integrationMenus && integrationMenus.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Integrações</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {integrationMenus.map((integration) => (
                  <SidebarMenuItem key={integration.title}>
                    <SidebarMenuButton asChild isActive={isActive(integration.url)}>
                      <NavLink to={integration.url}>
                        <integration.icon className="h-4 w-4" />
                        <span>{integration.title}</span>
                        <Badge 
                          variant={integration.status === 'active' ? 'default' : 'secondary'}
                          className="ml-auto"
                        >
                          {integration.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Botão para adicionar nova integração */}
        {isInClientWorkspace && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={async () => {
                      const result = await checkPlanLimit('create_account');
                      if (!result.allowed) {
                        if (result.upgrade_required) {
                          toast.error("Limite de contas atingido. Faça upgrade do seu plano.");
                        } else {
                          toast.error(result.error || "Não foi possível adicionar nova conta.");
                        }
                        return;
                      }
                      toast.info("Redirecionando para adicionar nova integração...");
                    }}
                  >
                    <Zap className="h-4 w-4" />
                    <span>Nova Integração</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Informações do Plano */}
        {userPlan && (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="px-3 py-2 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Plano: {userPlan.name}</span>
                  {userPlan.name !== 'Business' && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleUpgradeClick}
                      className="h-6 px-2 text-xs"
                    >
                      Upgrade
                    </Button>
                  )}
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/*Footer*/}
      <SidebarFooter className="flex row-2">
        <NavUser />
      </SidebarFooter>


      <SidebarRail/>
    </Sidebar>
  );
}