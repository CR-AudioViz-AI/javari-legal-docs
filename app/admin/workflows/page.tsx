import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout'
import WorkflowBuilder from '@/components/admin/WorkflowBuilder'

export default function WorkflowsPage() {
  return (
    <AdminDashboardLayout>
      <WorkflowBuilder organizationId="current-org-id" />
    </AdminDashboardLayout>
  )
}
