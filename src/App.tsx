import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import PrismaHome from "./pages/PrismaHome";
import PrismaDashboard from "./pages/PrismaDashboard";
import Dashboard from "./pages/Dashboard";
//import Leads from "./pages/DontUse/Leads";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Competitors from "./pages/Competitors";
import Alerts from "./pages/Alerts";
//import LandingPages from "./pages/DontUse/LandingPages";
//import Ads from "./pages/DontUse/Ads";
import StoreAnalytics from "./pages/StoreAnalytics";
//import Messages from "./pages/DontUse/Messages";
import Billing from "./pages/Billing";
import Upgrade from "./pages/Upgrade";
//import Credits from "./pages/DontUse/Credits";
import Workspaces from "./pages/Workspaces";
import Profile from "./pages/Profile";
import Integrations from "./pages/Integrations";
import CreativeLibrary from "./pages/CreativeLibrary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <DashboardLayout title="Home">
              <PrismaHome />
            </DashboardLayout>
          } />
          <Route path="/PrismaDash" element={
            <DashboardLayout title="PrismaDash">
              <PrismaDashboard />
            </DashboardLayout>
          } />
          <Route path="/StoreDash" element={
            <DashboardLayout title="StoreDash">
              <Dashboard />
            </DashboardLayout>
          } />
          <Route path="/reports" element={
            <DashboardLayout title="Analytics">
              <Analytics />
            </DashboardLayout>
          } />
          <Route path="/settings" element={
            <DashboardLayout title="Configurações">
              <Settings />
            </DashboardLayout>
          } />
          <Route path="/competitors" element={
            <DashboardLayout title="Análise de Concorrência">
              <Competitors />
            </DashboardLayout>
          } />
          <Route path="/alerts" element={
            <DashboardLayout title="Sistema de Alertas">
              <Alerts />
            </DashboardLayout>
          } />
          <Route path="/analytics" element={
            <DashboardLayout title="Analytics da Loja">
              <StoreAnalytics />
            </DashboardLayout>
          } />
          <Route path="/billing" element={
            <DashboardLayout title="Faturamento">
              <Billing />
            </DashboardLayout>
          } />
          <Route path="/upgrade" element={
            <DashboardLayout title="Upgrade de Plano">
              <Upgrade />
            </DashboardLayout>
          } />
          <Route path="/workspaces" element={
            <DashboardLayout title="Gerenciamento de Workspaces">
              <Workspaces />
            </DashboardLayout>
          } />
          <Route path="/profile" element={
            <DashboardLayout title="Perfil do Usuário">
              <Profile />
            </DashboardLayout>
          } />
          <Route path="/integrations" element={
            <DashboardLayout title="Integrações">
              <Integrations />
            </DashboardLayout>
          } />
          <Route path="/creative-library" element={
            <DashboardLayout title="Biblioteca de Criativos">
              <CreativeLibrary />
            </DashboardLayout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
