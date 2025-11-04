'use client'

import { useState, useEffect } from 'react'
import { Archive, RotateCcw, Search, Calendar, User, FileText } from 'lucide-react'

interface ArchivedDocument {
  id: string
  title: string
  document_type: string
  archived_at: string
  archived_by: string
  archive_reason: string
  created_at: string
}

export default function ArchiveManager({ organizationId }: { organizationId: string }) {
  const [documents, setDocuments] = useState<ArchivedDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchArchivedDocuments()
  }, [organizationId])

  const fetchArchivedDocuments = async () => {
    try {
      const response = await fetch(`/api/archive?organization_id=${organizationId}`)
      const data = await response.json()
      setDocuments(data.documents || [])
    } catch (error) {
      console.error('Failed to fetch archived documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const recallDocument = async (id: string) => {
    if (!confirm('Recall this document from archive?')) return
    
    try {
      await fetch(`/api/archive/${id}/recall`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recalled_by: 'current_user_id', // TODO: Get from auth
          recall_reason: 'Manual recall from archive manager'
        })
      })
      fetchArchivedDocuments()
    } catch (error) {
      console.error('Failed to recall document:', error)
    }
  }

  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.document_type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Archive Manager</h1>
          <p className="text-gray-600 mt-1">Manage and recall archived documents</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
          <p className="text-sm text-gray-600">Archived Documents</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search archived documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Documents List */}
      {loading ? (
        <div className="text-center py-12">Loading archived documents...</div>
      ) : (
        <div className="space-y-4">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <FileText className="text-gray-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{doc.title}</h3>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={14} />
                        <span>Archived {new Date(doc.archived_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <User size={14} />
                        <span>{doc.archived_by}</span>
                      </div>
                    </div>

                    {doc.archive_reason && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Reason:</span> {doc.archive_reason}
                        </p>
                      </div>
                    )}

                    <div className="mt-3 flex items-center gap-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                        {doc.document_type}
                      </span>
                      <span className="text-xs text-gray-500">
                        Created {new Date(doc.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => recallDocument(doc.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-4"
                >
                  <RotateCcw size={16} />
                  Recall
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredDocs.length === 0 && !loading && (
        <div className="text-center py-12">
          <Archive className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No matching documents' : 'No archived documents'}
          </h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try a different search term' : 'Archived documents will appear here'}
          </p>
        </div>
      )}
    </div>
  )
}
