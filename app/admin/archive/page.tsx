import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout'
import ArchiveManager from '@/components/documents/ArchiveManager'

export default function ArchivePage() {
  return (
    <AdminDashboardLayout>
      <ArchiveManager organizationId="current-org-id" />
    </AdminDashboardLayout>
  )
}
