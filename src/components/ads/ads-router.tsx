// Componente de roteamento para o sistema de anúncios

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdsDashboard } from './ads-dashboard';

// Importar páginas quando estiverem disponíveis
// import CampaignsPage from '@/pages/ads/campaigns';
// import CampaignMetricsPage from '@/pages/ads/campaigns/[id]/metrics';
// import AdSetsPage from '@/pages/ads/adsets';
// import AdsPage from '@/pages/ads/ads';
// import CreativesPage from '@/pages/ads/creatives';

export function AdsRouter() {
  return (
    <Routes>
      {/* Dashboard principal */}
      <Route path="/" element={<AdsDashboard />} />
      
      {/* Campanhas */}
      <Route path="/campaigns" element={<div>Campanhas em desenvolvimento</div>} />
      <Route path="/campaigns/:id/metrics" element={<div>Métricas em desenvolvimento</div>} />
      
      {/* Conjuntos de anúncios */}
      <Route path="/adsets" element={<div>Conjuntos de anúncios em desenvolvimento</div>} />
      
      {/* Anúncios */}
      <Route path="/ads" element={<div>Anúncios em desenvolvimento</div>} />
      
      {/* Criativos */}
      <Route path="/creatives" element={<div>Criativos em desenvolvimento</div>} />
      
      {/* Redirect padrão */}
      <Route path="*" element={<Navigate to="/ads" replace />} />
    </Routes>
  );
}

// Componente wrapper para usar no App principal
export function AdsManager() {
  return (
    <div className="min-h-screen bg-background">
      <AdsRouter />
    </div>
  );
}