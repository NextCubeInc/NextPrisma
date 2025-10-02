import React from 'react'
import { useParams, Navigate, Routes, Route } from 'react-router-dom'
import MetaAdsPage from './ads/MetaAdsPage'
import GoogleAdsPage from './ads/GoogleAdsPage'
import TikTokAdsPage from './ads/TikTokAdsPage'
import CreateCampaign from './ads/CreateCampaign'

export default function AdsManager() {
  const { clientId, '*': splat } = useParams()
  
  if (!clientId) {
    return <Navigate to="/" replace />
  }

  // Redirect to meta/campaigns if no platform is specified
  if (!splat || splat === '') {
    return <Navigate to={`/client/${clientId}/ads-manager/meta/campaigns`} replace />
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="meta/campaigns" replace />} />
      <Route path="meta/*" element={<MetaAdsPage />} />
      <Route path="google/*" element={<GoogleAdsPage />} />
      <Route path="tiktok/*" element={<TikTokAdsPage />} />
      <Route path="create-campaign" element={<CreateCampaign />} />
      <Route path="campaigns/create" element={<CreateCampaign />} />
      <Route path="campaigns/edit/:id" element={<CreateCampaign />} />
    </Routes>
  )
}