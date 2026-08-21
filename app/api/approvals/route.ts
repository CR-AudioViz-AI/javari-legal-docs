import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/approvals - List approvals (pending by default)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const document_id = searchParams.get('document_id')
    const approver_id = searchParams.get('approver_id')
    const status = searchParams.get('status') || 'pending'

    // 2026-08-25: the embedded resource was workflow_steps(*). PostgREST answered
    // "Could not find a relationship ... in the schema cache" and the route 500'd
    // on every call - document_approvals.workflow_id has a foreign key to
    // approval_workflows, NOT workflow_steps. Verified against pg_constraint.
    //
    // The comment lives HERE, not inside the template literal: PostgREST parses
    // that string as a column list, so a // comment inside it is sent to the
    // server as a column name. My first attempt did exactly that and turned a
    // relationship error into a parse error.
    let query = supabase
      .from('document_approvals')
      .select(`
        *,
        document:legalease_documents(id, title),
        workflow:approval_workflows(*)
      `)
      .order('created_at', { ascending: false })

    if (document_id) {
      query = query.eq('document_id', document_id)
    }

    if (approver_id) {
      query = query.eq('approver_id', approver_id)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ approvals: data })

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch approvals', details: error.message },
      { status: 500 }
    )
  }
}

// POST /api/approvals - Create approval request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { document_id, workflow_id, step_id, approver_id, requested_by, notes } = body

    if (!document_id || !approver_id) {
      return NextResponse.json(
        { error: 'Document ID and approver ID are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('document_approvals')
      .insert([{
        document_id,
        workflow_id,
        step_id,
        approver_id,
        requested_by,
        notes,
        status: 'pending'
      }])
      .select()
      .single()

    if (error) throw error

    // TODO: Send notification to approver

    return NextResponse.json({
      success: true,
      approval: data
    }, { status: 201 })

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create approval', details: error.message },
      { status: 500 }
    )
  }
}
