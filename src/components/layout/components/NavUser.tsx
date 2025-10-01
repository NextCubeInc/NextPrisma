"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  Crown,
  Settings,
  User,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const handleNavigation = (url?: string) => {
    if (url) {
      navigate(url)
    }
  }

  // Função para obter iniciais do nome ou email
  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  // Se não há usuário logado, não renderiza o componente
  if (!user) {
    return null;
  }

  // Extrair nome do user metadata ou usar email
  const userName = user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário';
  const userEmail = user.email || '';

  const UserMenu = [
    {
        id: 1,
        itens: [{ icon: <Sparkles/>, label: 'Upgrade to Pro', url: '/xpto', onClick: () => handleNavigation('/xpto'), separator: true }]
    },
    {
        id: 2,
        itens: [{ icon: <CreditCard/>, label: 'Billing', url: '/billing', onClick: () => handleNavigation('/billing') },
                { icon: <Crown/>, label: 'Upgrade de Plano', url: '/upgrade', onClick: () => handleNavigation('/upgrade'), separator: true }]
    },
    {
        id: 3,
        itens: [{ icon: <BadgeCheck/>, label: 'Account', url: '/xpto', onClick: () => handleNavigation('/xpto') },
                { icon: <User/>, label: 'Perfil', url: '/profile', onClick: () => handleNavigation('/profile') },
                { icon: <Bell/>, label: 'Notifications', url: '/xpto', onClick: () => handleNavigation('/xpto'), separator: true }]
    },
    {
        id: 4,
        itens: [{ icon: <LogOut />, label: "Log out", onClick: handleLogout }]
    }
  ];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback className="bg-gradient-primary text-white">
                  {getInitials(userName, userEmail)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userName}</span>
                <span className="truncate text-xs">{userEmail}</span>
              </div>
              <ChevronsUpDown />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                  <AvatarFallback className="bg-gradient-primary text-white">
                    {getInitials(userName, userEmail)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userName}</span>
                  <span className="truncate text-xs">{userEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator/>
            {UserMenu.map((itens) =>(
                <DropdownMenuGroup key={itens.id}>
                    {itens.itens.map((item, idx) => (
                    <div key={idx}>
                      <DropdownMenuItem className="gap-4" onClick={item.onClick}>
                        {item.icon}
                        {item.label}
                      </DropdownMenuItem>
                      {item.separator && <DropdownMenuSeparator />}
                    </div>
                  ))}
                </DropdownMenuGroup>
                )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
