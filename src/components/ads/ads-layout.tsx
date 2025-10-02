import React from 'react'
import { Outlet } from 'react-router-dom'
import { AdsSidebar } from './ads-sidebar'

interface AdsLayoutProps {
  children: React.ReactNode
  clientId?: string
}

export function AdsLayout({ children, clientId }: AdsLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdsSidebar clientId={clientId} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}