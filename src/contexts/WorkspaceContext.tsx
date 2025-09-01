import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Workspace } from "@/lib/supabase";

interface WorkspaceContextType {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  setCurrentWorkspace: (workspace: Workspace) => void;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// Mock data temporário para evitar problemas de importação circular
const mockWorkspaces: Workspace[] = [
  {
    id: "general",
    name: "Workspace Geral",
    type: "general",
    description: "Visão consolidada de todos os negócios",
    owner_id: "550e8400-e29b-41d4-a716-446655440000",
    created_at: "2023-01-15T00:00:00Z",
    updated_at: "2023-01-15T00:00:00Z",
    status: "active",
    settings: null
  },
  {
    id: "store-1",
    name: "Loja Fashion Prime",
    type: "store",
    description: "E-commerce de moda",
    owner_id: "550e8400-e29b-41d4-a716-446655440000",
    created_at: "2023-03-20T00:00:00Z",
    updated_at: "2023-03-20T00:00:00Z",
    status: "active",
    settings: null
  }
];

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(mockWorkspaces[0]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(mockWorkspaces);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSetCurrentWorkspace = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
  };

  const refetch = () => {
    // Por enquanto, apenas retorna os dados mock
    // Quando implementarmos o Supabase, aqui será a chamada real
    setWorkspaces(mockWorkspaces);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        currentWorkspace,
        workspaces,
        setCurrentWorkspace: handleSetCurrentWorkspace,
        isLoading,
        error,
        refetch
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}