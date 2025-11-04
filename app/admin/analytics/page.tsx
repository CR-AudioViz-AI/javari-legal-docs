import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout'
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard'

export default function AnalyticsPage() {
  return (
    <AdminDashboardLayout>
      <AnalyticsDashboard organizationId="current-org-id" />
    </AdminDashboardLayout>
  )
}
