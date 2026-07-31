'use client'
// app/admin/analytics/page.tsx
// Was hardcoded organizationId="current-org-id" - a literal placeholder
// string, not a real organization, meaning this page could never have shown
// real analytics for anyone. Reads a real org from the query string (so an
// admin can view a specific organization), falling back to the most
// recently active real organization rather than a fake id.
import { useState, useEffect } from 'react'
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout'
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard'
import { useSearchParams } from 'next/navigation'

export default function AnalyticsPage() {
  const searchParams = useSearchParams()
  const [organizationId, setOrganizationId] = useState<string | null>(searchParams.get('org'))
  const [loading, setLoading] = useState(!organizationId)

  useEffect(() => {
    if (organizationId) return
    fetch('/api/organizations?limit=1')
      .then(r => r.json())
      .then(body => {
        const first = body.organizations?.[0]?.id
        if (first) setOrganizationId(first)
      })
      .finally(() => setLoading(false))
  }, [organizationId])

  if (loading) {
    return (
      <AdminDashboardLayout>
        <p className="text-gray-500 text-center py-12">Loading organization data…</p>
      </AdminDashboardLayout>
    )
  }

  if (!organizationId) {
    return (
      <AdminDashboardLayout>
        <p className="text-gray-500 text-center py-12">No organizations exist yet.</p>
      </AdminDashboardLayout>
    )
  }

  return (
    <AdminDashboardLayout>
      <AnalyticsDashboard organizationId={organizationId} />
    </AdminDashboardLayout>
  )
}
