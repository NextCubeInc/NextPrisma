// Página principal do dashboard de anúncios

import React from 'react';
import { AdsDashboard } from '@/components/ads/ads-dashboard';

export default function AdsPage() {
  return (
    <div className="container mx-auto py-6">
      <AdsDashboard />
    </div>
  );
}