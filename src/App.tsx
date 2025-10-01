import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { WorkspaceProvider } from "./contexts/WorkspaceContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import PrismaHome from "./pages/PrismaHome";
import NotFound from "./pages/NotFound";
import Clientes from "./pages/Clientes";
import DatabaseTest from "./pages/DatabaseTest";
import { Auth } from "./pages/Auth";
import { ClientDashboard } from "./pages/client/ClientDashboard";
import { ClientReports } from "./pages/client/ClientReports";
import { ClientIntegrations } from "./pages/client/ClientIntegrations";
import AdsManager from "./pages/AdsManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <WorkspaceProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <DashboardLayout title="Home">
                    <PrismaHome />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/clientes" element={
                <ProtectedRoute>
                  <DashboardLayout title="Clientes">
                    <Clientes />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/client/:clientId/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout title="Dashboard">
                    <ClientDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/client/:clientId/reports" element={
                <ProtectedRoute>
                  <DashboardLayout title="Relatórios">
                    <ClientReports />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/client/:clientId/integrations" element={
                <ProtectedRoute>
                  <DashboardLayout title="Integrações">
                    <ClientIntegrations />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/client/:clientId/ads-manager" element={
                <ProtectedRoute>
                  <DashboardLayout title="Gerenciador de Anúncios">
                    <AdsManager />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/database-test" element={
                <ProtectedRoute>
                  <DashboardLayout title="Teste de Banco de Dados">
                    <DatabaseTest />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
      </TooltipProvider>
       </WorkspaceProvider>
     </AuthProvider>
   </QueryClientProvider>
 );

export default App;
