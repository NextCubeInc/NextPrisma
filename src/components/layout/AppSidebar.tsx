import { 
  Home, 
  Target, 
  Megaphone, 
  Globe, 
  Zap, 
  BarChart3, 
  TrendingUp, 
  RotateCcw,
  CreditCard,
  Crown,
  Settings,
  User,
  Users,
  Key,
  ChevronDown,
  AlertTriangle,
  MessageSquare,
  Lightbulb,
  Monitor,
  ShoppingBag,
  Image
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { WorkspaceSelector } from "./WorkspaceSelector";
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
  SidebarTrigger
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Dynamic menu items based on workspace type
const getMenuItems = (workspaceType: "general" | "store") => {
  const dynamicMenus = workspaceType === "general" 
    ? [
        // General workspace menus - consolidated view
        { title: "Home", url: "/", icon: Home },
        { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
        { title: "Leads", url: "/leads", icon: Target },
        { title: "Relatórios", url: "/reports", icon: TrendingUp },
        { title: "Competitors", url: "/competitors", icon: Monitor },
        { title: "Alerts", url: "/alerts", icon: AlertTriangle },
      ]
    : [
        // Store workspace menus - operational view
        { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
        { title: "Leads", url: "/leads", icon: Target },
        { title: "Landing Pages", url: "/landing-pages", icon: Globe },
        { title: "Ads", url: "/ads", icon: Megaphone },
        { title: "Criativos", url: "/creative-library", icon: Image },
        { title: "Analytics", url: "/analytics", icon: TrendingUp },
        { title: "Mensagens", url: "/messages", icon: MessageSquare },
      ];

  // Global menus (always visible)
  const globalMenus = [
    {
      title: "Finanças",
      icon: CreditCard,
      items: [
        { title: "Billing", url: "/billing", icon: CreditCard },
        { title: "Upgrade de Plano", url: "/upgrade", icon: Crown },
        { title: "Créditos Extras", url: "/credits", icon: Lightbulb },
      ],
    },
    {
      title: "Configurações",
      icon: Settings,
      items: [
        { title: "Workspaces", url: "/workspaces", icon: Users },
        { title: "Perfil", url: "/profile", icon: User },
        { title: "Integrações", url: "/integrations", icon: Key },
      ],
    },
  ];

  return { dynamicMenus, globalMenus };
};

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { currentWorkspace } = useWorkspace();
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path;
  const hasActiveChild = (items: any[]) => 
    items?.some(item => isActive(item.url));

  const { dynamicMenus, globalMenus } = getMenuItems(currentWorkspace.type);

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="p-4 pb-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">PrismaID</h2>
                <p className="text-xs text-sidebar-foreground/60">Multi-Tenant SaaS</p>
              </div>
            </div>
          </div>
        )}
        <WorkspaceSelector />
      </SidebarHeader>

      <SidebarContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWorkspace.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Dynamic Menu Section */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/60 mb-2">
                {currentWorkspace.type === "general" ? "VISÃO GERAL" : "OPERAÇÕES DA LOJA"}
              </SidebarGroupLabel>
              <SidebarMenu>
                {dynamicMenus.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200 ${
                            isActive
                              ? "bg-gradient-primary text-white shadow-glow"
                              : "hover:bg-glass-card hover:border-primary/20 border border-transparent"
                          }`
                        }
                      >
                        <item.icon className="w-4 h-4" />
                        {!isCollapsed && <span className="font-medium">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>

            {/* Global Menu Section */}
            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/60 mb-2">
                CONFIGURAÇÕES GLOBAIS
              </SidebarGroupLabel>
              <SidebarMenu>
                {globalMenus.map((item) => {
                  const hasActive = hasActiveChild(item.items);
                  return (
                    <Collapsible key={item.title} defaultOpen={hasActive}>
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className={`w-full justify-between p-3 rounded-lg transition-all duration-200 ${
                              hasActive 
                                ? "bg-glass-card border-primary/20 text-primary" 
                                : "hover:bg-glass-card hover:border-primary/20 border border-transparent"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className="w-4 h-4" />
                              {!isCollapsed && <span className="font-medium">{item.title}</span>}
                            </div>
                            {!isCollapsed && (
                              <motion.div
                                animate={{ rotate: hasActive ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronDown className="w-4 h-4" />
                              </motion.div>
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="ml-4 mt-2">
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <NavLink
                                    to={subItem.url}
                                    className={({ isActive }) =>
                                      `flex items-center gap-3 w-full p-2 rounded-md transition-all duration-200 ${
                                        isActive
                                          ? "bg-primary text-primary-foreground shadow-sm"
                                          : "hover:bg-accent/50 text-sidebar-foreground/80"
                                      }`
                                    }
                                  >
                                    <subItem.icon className="w-3 h-3" />
                                    {!isCollapsed && <span className="text-sm">{subItem.title}</span>}
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          </motion.div>
        </AnimatePresence>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center justify-center">
          <SidebarTrigger className="w-8 h-8" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}