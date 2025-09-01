import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import { validateEnv } from "@/config/env";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import PrismaHome from "./pages/PrismaHome";
import PrismaDashboard from "./pages/PrismaDashboard";
import Leads from "./pages/Leads";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Competitors from "./pages/Competitors";
import Alerts from "./pages/Alerts";
import LandingPages from "./pages/LandingPages";
import Ads from "./pages/Ads";
import StoreAnalytics from "./pages/StoreAnalytics";
import Messages from "./pages/Messages";
import Billing from "./pages/Billing";
import Upgrade from "./pages/Upgrade";
import Credits from "./pages/Credits";
import Workspaces from "./pages/Workspaces";
import Profile from "./pages/Profile";
import Integrations from "./pages/Integrations";
import CreativeLibrary from "./pages/CreativeLibrary";
import StoreDashboard from "./pages/StoreDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Componente de erro para configuração incorreta
function ConfigurationError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md mx-auto text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Configuração Incorreta</h1>
        <p className="text-muted-foreground">
          As variáveis de ambiente do Supabase não estão configuradas corretamente.
        </p>
        <div className="bg-muted p-4 rounded-lg text-left text-sm">
          <p className="font-medium mb-2">Crie um arquivo .env.local com:</p>
          <code className="block bg-background p-2 rounded">
            VITE_SUPABASE_URL=sua_url_do_supabase<br/>
            VITE_SUPABASE_ANON_KEY=sua_chave_anonima
          </code>
        </div>
        <p className="text-xs text-muted-foreground">
          Reinicie o servidor após criar o arquivo.
        </p>
      </div>
    </div>
  );
}

const App = () => {
  // Validar variáveis de ambiente
  const isEnvValid = validateEnv();

  if (!isEnvValid) {
    return <ConfigurationError />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout title="Dashboard">
                    <PrismaHome />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/prisma-dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout title="Dashboard">
                    <PrismaDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/storedashboard" element={
                <ProtectedRoute>
                  <DashboardLayout title="StoreDashboard">
                    <StoreDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/leads" element={
                <ProtectedRoute>
                  <DashboardLayout title="Leads">
                    <Leads />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <DashboardLayout title="Analytics">
                    <Analytics />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <DashboardLayout title="Configurações">
                    <Settings />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/competitors" element={
                <ProtectedRoute>
                  <DashboardLayout title="Análise de Concorrência">
                    <Competitors />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/alerts" element={
                <ProtectedRoute>
                  <DashboardLayout title="Sistema de Alertas">
                    <Alerts />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/landing-pages" element={
                <ProtectedRoute>
                  <DashboardLayout title="Landing Pages">
                    <LandingPages />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/ads" element={
                <ProtectedRoute>
                  <DashboardLayout title="Campanhas Publicitárias">
                    <Ads />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <DashboardLayout title="Analytics da Loja">
                    <StoreAnalytics />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/messages" element={
                <ProtectedRoute>
                  <DashboardLayout title="Central de Mensagens">
                    <Messages />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/billing" element={
                <ProtectedRoute>
                  <DashboardLayout title="Faturamento">
                    <Billing />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/upgrade" element={
                <ProtectedRoute>
                  <DashboardLayout title="Upgrade de Plano">
                    <Upgrade />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/credits" element={
                <ProtectedRoute>
                  <DashboardLayout title="Créditos Extras">
                    <Credits />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/workspaces" element={
                <ProtectedRoute>
                  <DashboardLayout title="Gerenciamento de Workspaces">
                    <Workspaces />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <DashboardLayout title="Perfil do Usuário">
                    <Profile />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/integrations" element={
                <ProtectedRoute>
                  <DashboardLayout title="Integrações">
                    <Integrations />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/creative-library" element={
                <ProtectedRoute>
                  <DashboardLayout title="Biblioteca de Criativos">
                    <CreativeLibrary />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
