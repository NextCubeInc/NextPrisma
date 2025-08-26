import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
          <Route path="/dashboard" element={
            <DashboardLayout title="Dashboard">
              <PrismaDashboard />
            </DashboardLayout>
          } />
          <Route path="/leads" element={
            <DashboardLayout title="Leads">
              <Leads />
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
