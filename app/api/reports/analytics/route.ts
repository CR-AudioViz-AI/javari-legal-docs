import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/reports/analytics - Get organization analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organization_id = searchParams.get('organization_id')
    const start_date = searchParams.get('start_date')
    const end_date = searchParams.get('end_date')

    if (!organization_id) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      )
    }

    // Get total documents
    const { count: totalDocuments } = await supabase
      .from('legalease_documents')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organization_id)

    // Get documents by type
    const { data: byType } = await supabase
      .from('legalease_documents')
      .select('document_type')
      .eq('organization_id', organization_id)

    const documentsByType = byType?.reduce((acc: any, doc: any) => {
      acc[doc.document_type] = (acc[doc.document_type] || 0) + 1
      return acc
    }, {})

    // Get documents by status
    const { data: byStatus } = await supabase
      .from('legalease_documents')
      .select('status')
      .eq('organization_id', organization_id)

    const documentsByStatus = byStatus?.reduce((acc: any, doc: any) => {
      acc[doc.status] = (acc[doc.status] || 0) + 1
      return acc
    }, {})

    // Get team statistics
    const { data: teams } = await supabase
      .from('teams')
      .select('id, name')
      .eq('organization_id', organization_id)

    const teamStats = []
    if (teams) {
      for (const team of teams) {
        const { count } = await supabase
          .from('legalease_documents')
          .select('*', { count: 'exact', head: true })
          .eq('team_id', team.id)

        teamStats.push({
          team_id: team.id,
          team_name: team.name,
          document_count: count
        })
      }
    }

    // Get active users count
    const { count: activeUsers } = await supabase
      .from('organization_members')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organization_id)

    // Get pending approvals
    // First get document IDs for this organization
    const { data: orgDocs } = await supabase
      .from('legalease_documents')
      .select('id')
      .eq('organization_id', organization_id)
    
    const docIds = orgDocs?.map(d => d.id) || []
    
    const { count: pendingApprovals } = await supabase
      .from('document_approvals')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .in('document_id', docIds)

    // Get archived documents
    const { count: archivedDocuments } = await supabase
      .from('legalease_documents')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organization_id)
      .eq('is_archived', true)

    return NextResponse.json({
      organization_id,
      period: {
        start: start_date || 'all',
        end: end_date || 'now'
      },
      summary: {
        total_documents: totalDocuments || 0,
        active_users: activeUsers || 0,
        pending_approvals: pendingApprovals || 0,
        archived_documents: archivedDocuments || 0
      },
      documents_by_type: documentsByType || {},
      documents_by_status: documentsByStatus || {},
      team_statistics: teamStats
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to generate analytics', details: error.message },
      { status: 500 }
    )
  }
}
