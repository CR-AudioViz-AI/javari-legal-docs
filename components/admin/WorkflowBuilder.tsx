'use client'

import { useState, useEffect } from 'react'
import { GitBranch, Plus, Edit, Trash2, ArrowRight, CheckCircle } from 'lucide-react'

interface Workflow {
  id: string
  name: string
  description: string
  is_active: boolean
  trigger_conditions: Record<string, any>
  workflow_steps: Array<{
    id: string
    step_order: number
    step_name: string
    approver_role: string
    requires_signature: boolean
  }>
  created_at: string
}

export default function WorkflowBuilder({ organizationId }: { organizationId: string }) {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)

  useEffect(() => {
    fetchWorkflows()
  }, [organizationId])

  const fetchWorkflows = async () => {
    try {
      const response = await fetch(`/api/workflows?organization_id=${organizationId}`)
      const data = await response.json()
      setWorkflows(data.workflows || [])
    } catch (error) {
      console.error('Failed to fetch workflows:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleWorkflow = async (id: string, is_active: boolean) => {
    try {
      await fetch(`/api/workflows/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !is_active })
      })
      fetchWorkflows()
    } catch (error) {
      console.error('Failed to toggle workflow:', error)
    }
  }

  const deleteWorkflow = async (id: string) => {
    if (!confirm('Delete this workflow? This cannot be undone.')) return
    
    try {
      await fetch(`/api/workflows/${id}`, { method: 'DELETE' })
      fetchWorkflows()
    } catch (error) {
      console.error('Failed to delete workflow:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workflow Builder</h1>
          <p className="text-gray-600 mt-1">Create and manage approval workflows</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          Create Workflow
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading workflows...</div>
      ) : (
        <div className="space-y-4">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    workflow.is_active ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <GitBranch className={
                      workflow.is_active ? 'text-green-600' : 'text-gray-600'
                    } size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                      <button
                        onClick={() => toggleWorkflow(workflow.id, workflow.is_active)}
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          workflow.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {workflow.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedWorkflow(workflow)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Edit size={16} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => deleteWorkflow(workflow.id)}
                    className="p-2 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>

              {/* Workflow Steps Visualization */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {workflow.workflow_steps
                    ?.sort((a, b) => a.step_order - b.step_order)
                    .map((step, index) => (
                      <div key={step.id} className="flex items-center gap-3">
                        <div className="flex flex-col items-center min-w-[150px]">
                          <div className="w-full bg-white border-2 border-blue-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                                {step.step_order}
                              </div>
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {step.step_name}
                              </p>
                            </div>
                            <p className="text-xs text-gray-600">{step.approver_role}</p>
                            {step.requires_signature && (
                              <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                                <CheckCircle size={12} />
                                Signature Required
                              </div>
                            )}
                          </div>
                        </div>
                        {index < workflow.workflow_steps.length - 1 && (
                          <ArrowRight className="text-gray-400 flex-shrink-0" size={20} />
                        )}
                      </div>
                    ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <span>{workflow.workflow_steps?.length || 0} steps</span>
                <span>Created {new Date(workflow.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {workflows.length === 0 && !loading && (
        <div className="text-center py-12">
          <GitBranch className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows yet</h3>
          <p className="text-gray-600">Create your first workflow to automate approvals</p>
        </div>
      )}

      {/* Workflow Editor Modal */}
      {selectedWorkflow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedWorkflow.name}</h2>
                  <p className="text-gray-600 mt-1">{selectedWorkflow.description}</p>
                </div>
                <button
                  onClick={() => setSelectedWorkflow(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Workflow Steps</h3>
              <div className="space-y-3">
                {selectedWorkflow.workflow_steps
                  ?.sort((a, b) => a.step_order - b.step_order)
                  .map((step) => (
                    <div key={step.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        {step.step_order}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{step.step_name}</p>
                        <p className="text-sm text-gray-600">{step.approver_role}</p>
                      </div>
                      {step.requires_signature && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          Signature Required
                        </span>
                      )}
                    </div>
                  ))}
              </div>

              <button className="w-full mt-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 font-medium">
                Add Step
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
