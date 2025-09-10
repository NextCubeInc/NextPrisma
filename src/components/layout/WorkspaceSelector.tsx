import React, { useState } from "react";
import { ChevronDown, Plus, Building2, Store } from "lucide-react";
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
import { useSidebar } from "@/components/ui/sidebar"; // <- pega estado do sidebar

export function WorkspaceSelector() {
  const { currentWorkspace, workspaces, setCurrentWorkspace } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const { state } = useSidebar(); // "expanded" | "collapsed"
  const collapsed = state === "collapsed";

  const getWorkspaceIcon = (type: string) => {
    return type === "general" ? Building2 : Store;
  };

  return (
    <div className="border-b mt-1">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between h-12 px-3 hover:bg-purple-400/10 transition-all duration-200 hover:rounded-none"
          >
            <div className="flex items-center gap-3">
              {/* Ícone sempre visível */}
              <div className="w-8 h-8 bg-gradient-primary flex items-center justify-center shadow-glow">
                {React.createElement(getWorkspaceIcon(currentWorkspace.type), {
                  className: "w-4 h-4 text-white",
                })}
              </div>

              {/* Nome e descrição só aparecem se sidebar expandido */}
              {!collapsed && (
                <div className="text-left">
                  <p className="text-sm font-medium text-sidebar-foreground truncate max-w-32">
                    {currentWorkspace.name}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60">
                    {currentWorkspace.type === "general"
                      ? "Visão Geral"
                      : "Loja Individual"}
                  </p>
                </div>
              )}
            </div>

            {/* Chevron só aparece se expandido */}
            {!collapsed && (
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-sidebar-foreground/60" />
              </motion.div>
            )}
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
                    <div
                      className={`w-8 h-8 flex items-center justify-center ${
                        isActive
                          ? "bg-gradient-primary shadow-glow"
                          : "bg-glass-card border border-glass-border"
                      }`}
                    >
                      <IconComponent
                        className={`w-4 h-4 ${
                          isActive
                            ? "text-white"
                            : "text-sidebar-foreground/60"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{workspace.name}</p>
                      <p className="text-xs text-sidebar-foreground/60">
                        {workspace.type === "general"
                          ? "Visão Consolidada"
                          : "Operações da Loja"}
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
              <p className="text-xs text-sidebar-foreground/60">
                Adicionar workspace
              </p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
