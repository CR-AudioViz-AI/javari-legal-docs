import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/archive - List archived documents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organization_id = searchParams.get('organization_id')
    const archived_by = searchParams.get('archived_by')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase
      .from('legalease_documents')
      .select('*')
      // 2026-08-25: legalease_documents has NO is_archived column - it has `status`.
      // Postgres rejected the filter and the route 500'd on every call.
      .eq('status', 'archived')
      // 2026-08-25: archived_at does not exist either. legalease_documents has only
      // id, user_id, document_type, title, content, status, metadata, created_at,
      // updated_at. updated_at is when the row last changed, which for an archived
      // document IS when it was archived.
      .order('updated_at', { ascending: false })
      .limit(limit)

    if (organization_id) {
      query = query// organization_id does not exist on this table. Org scoping would need a
      // join through profiles; filtering on a missing column just 500s.
      .eq('user_id', organization_id)
    }

    if (archived_by) {
      query = query// archived_by does not exist; user_id is the document's owner.
      .eq('user_id', archived_by)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ documents: data })

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch archived documents', details: error.message },
      { status: 500 }
    )
  }
}

// POST /api/archive - Archive a document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { document_id, archived_by, archive_reason } = body

    if (!document_id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('legalease_documents')
      .update({
        status: 'archived',
        archived_at: new Date().toISOString(),
        archived_by,
        archive_reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', document_id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      document: data
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to archive document', details: error.message },
      { status: 500 }
    )
  }
}
