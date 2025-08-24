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
  ChevronDown
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
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

const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Leads & Marketing",
    icon: Target,
    items: [
      { title: "Leads", url: "/leads", icon: Target },
      { title: "Campanhas", url: "/campaigns", icon: Megaphone },
      { title: "Landing Pages", url: "/landing-pages", icon: Globe },
      { title: "Automations", url: "/automations", icon: Zap },
    ],
  },
  {
    title: "Analytics",
    icon: BarChart3,
    items: [
      { title: "Relatórios", url: "/reports", icon: BarChart3 },
      { title: "Performance", url: "/performance", icon: TrendingUp },
      { title: "Conversões", url: "/conversions", icon: RotateCcw },
    ],
  },
  {
    title: "Finanças",
    icon: CreditCard,
    items: [
      { title: "Billing", url: "/billing", icon: CreditCard },
      { title: "Planos", url: "/plans", icon: Crown },
    ],
  },
  {
    title: "Configurações",
    icon: Settings,
    items: [
      { title: "Perfil", url: "/profile", icon: User },
      { title: "Workspaces", url: "/workspaces", icon: Users },
      { title: "Integrações", url: "/integrations", icon: Key },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path;
  const hasActiveChild = (items: any[]) => 
    items?.some(item => isActive(item.url));

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold text-sidebar-foreground">SaaS Pro</h2>
              <p className="text-xs text-sidebar-foreground/60">Dashboard</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => {
              if (item.items) {
                const hasActive = hasActiveChild(item.items);
                return (
                  <Collapsible key={item.title} defaultOpen={hasActive}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={`w-full justify-between ${
                            hasActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <item.icon className="w-4 h-4" />
                            {!isCollapsed && <span>{item.title}</span>}
                          </div>
                          {!isCollapsed && <ChevronDown className="w-4 h-4" />}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <NavLink
                                  to={subItem.url}
                                  className={({ isActive }) =>
                                    `flex items-center gap-2 w-full ${
                                      isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-sidebar-accent"
                                    }`
                                  }
                                >
                                  <subItem.icon className="w-4 h-4" />
                                  {!isCollapsed && <span>{subItem.title}</span>}
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              } else {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center gap-2 w-full ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-sidebar-accent"
                          }`
                        }
                      >
                        <item.icon className="w-4 h-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center justify-center">
          <SidebarTrigger className="w-8 h-8" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}