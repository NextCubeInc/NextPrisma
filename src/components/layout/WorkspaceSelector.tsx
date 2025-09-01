import React, { useState } from "react";
import { ChevronDown, Plus, Building2, Store, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function WorkspaceSelector() {
  const { currentWorkspace, workspaces, setCurrentWorkspace, isLoading, error } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);

  const getWorkspaceIcon = (type: string) => {
    return type === "general" ? Building2 : Store;
  };

  // Mostrar loading se estiver carregando
  if (isLoading) {
    return (
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 h-12 px-3">
          <Loader2 className="w-4 h-4 animate-spin text-sidebar-foreground/60" />
          <span className="text-sm text-sidebar-foreground/60">Carregando workspaces...</span>
        </div>
      </div>
    );
  }

  // Mostrar erro se houver problema
  if (error) {
    return (
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 h-12 px-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
            <Store className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-red-400">Erro ao carregar</p>
            <p className="text-xs text-red-400/60">Tente novamente</p>
          </div>
        </div>
      </div>
    );
  }

  // Se não há workspaces
  if (!currentWorkspace || workspaces.length === 0) {
    return (
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 h-12 px-3">
          <div className="w-8 h-8 rounded-lg bg-gray-500/20 flex items-center justify-center">
            <Store className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-400">Nenhum workspace</p>
            <p className="text-xs text-gray-400/60">Crie seu primeiro</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-b border-sidebar-border">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between h-12 px-3 bg-glass-card border border-glass-border hover:bg-glass-card/80 hover:border-primary/20 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                {React.createElement(getWorkspaceIcon(currentWorkspace.type), {
                  className: "w-4 h-4 text-white"
                })}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-sidebar-foreground truncate max-w-32">
                  {currentWorkspace.name}
                </p>
                <p className="text-xs text-sidebar-foreground/60">
                  {currentWorkspace.type === "general" ? "Visão Geral" : "Loja Individual"}
                </p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-sidebar-foreground/60" />
            </motion.div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent 
          className="w-64 bg-popover/95 backdrop-blur-xl border-glass-border"
          align="start"
        >
          <DropdownMenuLabel className="text-xs font-medium text-sidebar-foreground/60">
            SELECIONAR WORKSPACE
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <AnimatePresence>
            {workspaces.map((workspace) => {
              const IconComponent = getWorkspaceIcon(workspace.type);
              const isActive = workspace.id === currentWorkspace.id;
              
              return (
                <motion.div
                  key={workspace.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <DropdownMenuItem
                    onClick={() => {
                      setCurrentWorkspace(workspace);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-3 p-3 cursor-pointer ${
                      isActive 
                        ? "bg-primary/10 text-primary border-l-2 border-primary" 
                        : "hover:bg-accent/50"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive 
                        ? "bg-gradient-primary shadow-glow" 
                        : "bg-glass-card border border-glass-border"
                    }`}>
                      <IconComponent className={`w-4 h-4 ${
                        isActive ? "text-white" : "text-sidebar-foreground/60"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{workspace.name}</p>
                      <p className="text-xs text-sidebar-foreground/60">
                        {workspace.type === "general" ? "Visão Consolidada" : "Operações da Loja"}
                      </p>
                    </div>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-primary"
                      />
                    )}
                  </DropdownMenuItem>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="flex items-center gap-3 p-3 text-primary hover:bg-primary/10 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Plus className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Criar Nova Loja</p>
              <p className="text-xs text-sidebar-foreground/60">Adicionar workspace</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}