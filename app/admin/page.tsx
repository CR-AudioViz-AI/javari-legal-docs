import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout'
import { BarChart3, Building2, Users, FileText, CheckCircle } from 'lucide-react'

export default function AdminOverview() {
  const stats = [
    { name: 'Organizations', value: '12', icon: Building2, color: 'bg-blue-100 text-blue-600' },
    { name: 'Teams', value: '48', icon: Users, color: 'bg-green-100 text-green-600' },
    { name: 'Documents', value: '1,234', icon: FileText, color: 'bg-purple-100 text-purple-600' },
    { name: 'Approvals', value: '23', icon: CheckCircle, color: 'bg-yellow-100 text-yellow-600' },
  ]

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Overview</h1>
          <p className="text-gray-600 mt-1">System-wide statistics and metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className={`p-3 rounded-lg inline-block ${stat.color} mb-4`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.name}</p>
              </div>
            )
          })}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
              <Building2 className="text-blue-600 mb-2" size={24} />
              <h3 className="font-semibold text-gray-900">New Organization</h3>
              <p className="text-sm text-gray-600 mt-1">Create a new organization</p>
            </button>
            <button className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all">
              <Users className="text-green-600 mb-2" size={24} />
              <h3 className="font-semibold text-gray-900">New Team</h3>
              <p className="text-sm text-gray-600 mt-1">Create a new team</p>
            </button>
            <button className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all">
              <BarChart3 className="text-purple-600 mb-2" size={24} />
              <h3 className="font-semibold text-gray-900">View Analytics</h3>
              <p className="text-sm text-gray-600 mt-1">See detailed reports</p>
            </button>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  )
}
