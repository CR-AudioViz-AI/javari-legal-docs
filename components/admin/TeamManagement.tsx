'use client'

import { useState, useEffect } from 'react'
import { Users, Plus, Edit, Trash2, UserPlus, Shield } from 'lucide-react'

interface Team {
  id: string
  name: string
  description: string
  specialty: string
  color: string
  organization_id: string
  team_members: Array<{ id: string; user_id: string; role: string }>
  created_at: string
}

export default function TeamManagement({ organizationId }: { organizationId: string }) {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

  useEffect(() => {
    fetchTeams()
  }, [organizationId])

  const fetchTeams = async () => {
    try {
      const response = await fetch(`/api/teams?organization_id=${organizationId}`)
      const data = await response.json()
      setTeams(data.teams || [])
    } catch (error) {
      console.error('Failed to fetch teams:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteTeam = async (id: string) => {
    if (!confirm('Delete this team? This cannot be undone.')) return
    
    try {
      await fetch(`/api/teams/${id}`, { method: 'DELETE' })
      fetchTeams()
    } catch (error) {
      console.error('Failed to delete team:', error)
    }
  }

  const specialtyColors: Record<string, string> = {
    wills: 'bg-purple-100 text-purple-700',
    contracts: 'bg-blue-100 text-blue-700',
    residential: 'bg-green-100 text-green-700',
    commercial: 'bg-orange-100 text-orange-700',
    litigation: 'bg-red-100 text-red-700',
    corporate: 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-600 mt-1">Manage teams and their members</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          Create Team
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading teams...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setSelectedTeam(team)}
              style={{ borderColor: team.color }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${team.color}20` }}
                  >
                    <Users style={{ color: team.color }} size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{team.name}</h3>
                    {team.specialty && (
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                        specialtyColors[team.specialty] || 'bg-gray-100 text-gray-700'
                      }`}>
                        {team.specialty}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      // Edit team
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Edit size={16} className="text-gray-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteTeam(team.id)
                    }}
                    className="p-2 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>

              {team.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {team.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users size={16} />
                  <span>{team.team_members?.length || 0} members</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // Add member
                  }}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <UserPlus size={14} />
                  Add Member
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {teams.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No teams yet</h3>
          <p className="text-gray-600">Create your first team to get started</p>
        </div>
      )}

      {/* Team Detail Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedTeam.name}</h2>
                  <p className="text-gray-600 mt-1">{selectedTeam.description}</p>
                </div>
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Team Members</h3>
                <div className="space-y-2">
                  {selectedTeam.team_members?.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.user_id}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Shield size={12} />
                            {member.role}
                          </p>
                        </div>
                      </div>
                      <button className="text-red-600 hover:text-red-700 text-sm">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 font-medium">
                Add Team Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
