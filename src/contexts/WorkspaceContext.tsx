import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: "active" | "inactive" | "suspended";
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string;
  client_id: string;
  name: string;
  account_type: string;
  status: "active" | "inactive" | "suspended";
  settings: any;
}

export interface AdIntegration {
  id: string;
  account_id: string;
  integration_type: "META-ADS" | "GG-ADS" | "TTK-ADS";
  integration_name: string;
  status: "active" | "inactive" | "error" | "pending";
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  limits: {
    max_clients: number | "unlimited";
    max_accounts_per_client: number | "unlimited";
    features: string[];
  };
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: "active" | "canceled" | "trial" | "past_due";
  expires_at?: string;
}

interface WorkspaceContextType {
  // Cliente ativo (workspace atual)
  activeClient: Client | null;
  setActiveClient: (client: Client | null) => void;
  
  // Lista de clientes do usuário
  clients: Client[];
  loadingClients: boolean;
  refreshClients: () => Promise<void>;
  
  // Contas do cliente ativo
  accounts: Account[];
  loadingAccounts: boolean;
  
  // Integrações do cliente ativo
  integrations: AdIntegration[];
  loadingIntegrations: boolean;
  
  // Plano e assinatura do usuário
  userPlan: Plan | null;
  userSubscription: Subscription | null;
  
  // Funções utilitárias
  checkPlanLimit: (action: "create_client" | "create_account" | "create_report") => Promise<{
    allowed: boolean;
    error?: string;
    upgrade_required?: boolean;
  }>;
  
  // Navegação
  isInClientWorkspace: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { user, session } = useAuth();
  
  // Estados principais
  const [activeClient, setActiveClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  
  // Estados relacionados ao cliente ativo
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [integrations, setIntegrations] = useState<AdIntegration[]>([]);
  const [loadingIntegrations, setLoadingIntegrations] = useState(false);
  
  // Estados do plano
  const [userPlan, setUserPlan] = useState<Plan | null>(null);
  const [userSubscription, setUserSubscription] = useState<Subscription | null>(null);

  // Carregar clientes do usuário
  const refreshClients = async () => {
    if (!user) return;
    
    setLoadingClients(true);
    try {
      // Primeiro, buscar o ID do usuário na tabela users usando o auth_user_id
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();
      
      if (userError) throw userError;
      
      // Agora buscar os clientes usando o ID correto
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoadingClients(false);
    }
  };

  // Carregar contas do cliente ativo
  const loadClientAccounts = async (clientId: string) => {
    setLoadingAccounts(true);
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
      setAccounts([]);
    } finally {
      setLoadingAccounts(false);
    }
  };

  // Carregar integrações do cliente ativo
  const loadClientIntegrations = async (clientId: string) => {
    setLoadingIntegrations(true);
    try {
      const { data, error } = await supabase
        .from('ad_integrations')
        .select(`
          *,
          accounts!inner(client_id)
        `)
        .eq('accounts.client_id', clientId);
      
      if (error) throw error;
      setIntegrations(data || []);
    } catch (error) {
      console.error('Erro ao carregar integrações:', error);
      setIntegrations([]);
    } finally {
      setLoadingIntegrations(false);
    }
  };

  // Carregar plano e assinatura do usuário
  const loadUserPlanAndSubscription = async () => {
    if (!user) return;
    
    try {
      const { data: subscriptionData, error: subError } = await supabase
        .from('subscriptions')
        .select(`
          *,
          plans(*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();
      
      if (subError) throw subError;
      
      setUserSubscription(subscriptionData);
      setUserPlan(subscriptionData.plans);
    } catch (error) {
      console.error('Erro ao carregar plano:', error);
    }
  };

  // Verificar limites do plano
  const checkPlanLimit = async (action: "create_client" | "create_account" | "create_report") => {
    if (!user) {
      return { allowed: false, error: "Não autenticado" };
    }

    // Se não há plano carregado, permitir (usuário pode estar em trial)
    if (!userPlan || !userSubscription) {
      return { allowed: true };
    }

    try {
      switch (action) {
        case "create_client":
          const currentClientCount = clients.length;
          const maxClients = userPlan.limits.max_clients;
          
          if (maxClients !== "unlimited" && currentClientCount >= maxClients) {
            return {
              allowed: false,
              error: `Limite de ${maxClients} clientes atingido. Faça upgrade do seu plano.`,
              upgrade_required: true,
            };
          }
          break;

        case "create_account":
          if (!activeClient) {
            return { allowed: false, error: "Nenhum cliente selecionado" };
          }
          
          const currentAccountCount = accounts.filter(acc => acc.client_id === activeClient.id).length;
          const maxAccountsPerClient = userPlan.limits.max_accounts_per_client;
          
          if (maxAccountsPerClient !== "unlimited" && currentAccountCount >= maxAccountsPerClient) {
            return {
              allowed: false,
              error: `Limite de ${maxAccountsPerClient} contas por cliente atingido. Faça upgrade do seu plano.`,
              upgrade_required: true,
            };
          }
          break;

        case "create_report":
          // Para relatórios, verificar se o plano permite
          if (!userPlan.limits.features.includes("whatsapp_reports")) {
            return {
              allowed: false,
              error: "Relatórios não disponíveis no seu plano atual. Faça upgrade.",
              upgrade_required: true,
            };
          }
          break;
      }
      
      return { allowed: true };
    } catch (error) {
      console.error('Erro ao verificar limites:', error);
      return { allowed: false, error: "Erro interno" };
    }
  };

  // Efeitos
  useEffect(() => {
    if (user) {
      refreshClients();
      loadUserPlanAndSubscription();
    } else {
      setClients([]);
      setActiveClient(null);
      setUserPlan(null);
      setUserSubscription(null);
    }
  }, [user]);

  useEffect(() => {
    if (activeClient) {
      loadClientAccounts(activeClient.id);
      loadClientIntegrations(activeClient.id);
    } else {
      setAccounts([]);
      setIntegrations([]);
    }
  }, [activeClient]);

  const value: WorkspaceContextType = {
    activeClient,
    setActiveClient,
    clients,
    loadingClients,
    refreshClients,
    accounts,
    loadingAccounts,
    integrations,
    loadingIntegrations,
    userPlan,
    userSubscription,
    checkPlanLimit,
    isInClientWorkspace: !!activeClient,
  };

  return (
    <WorkspaceContext.Provider value={value}>
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