import { createContext, useContext, useState, ReactNode } from "react";

export interface Workspace {
  id: string;
  name: string;
  type: "general" | "store";
  icon?: string;
}

interface WorkspaceContextType {
  currentWorkspace: Workspace;
  workspaces: Workspace[];
  setCurrentWorkspace: (workspace: Workspace) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// Mock data for workspaces
const mockWorkspaces: Workspace[] = [
  {
    id: "general",
    name: "Workspace Geral",
    type: "general",
    icon: "🏢"
  },
  {
    id: "store-1",
    name: "Loja Fashion Prime",
    type: "store",
    icon: "🏬"
  },
  {
    id: "store-2",
    name: "Loja Tech Store",
    type: "store",
    icon: "🏬"
  },
  {
    id: "store-3",
    name: "Loja Beauty & Care",
    type: "store",
    icon: "🏬"
  }
];

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>(mockWorkspaces[0]);

  return (
    <WorkspaceContext.Provider
      value={{
        currentWorkspace,
        workspaces: mockWorkspaces,
        setCurrentWorkspace,
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