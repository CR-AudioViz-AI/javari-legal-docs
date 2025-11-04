import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST /api/approvals/[id]/approve - Approve a document
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { signature, comments } = body

    // Update approval status
    const { data: approval, error: approvalError } = await supabase
      .from('document_approvals')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (approvalError) throw approvalError

    // Create signoff record
    const { data: signoff, error: signoffError } = await supabase
      .from('approval_signoffs')
      .insert([{
        approval_id: params.id,
        signer_id: approval.approver_id,
        signature,
        comments,
        decision: 'approved'
      }])
      .select()
      .single()

    if (signoffError) throw signoffError

    // TODO: Check if this was the final step in workflow
    // If yes, mark document as fully approved

    return NextResponse.json({
      success: true,
      approval,
      signoff,
      message: 'Document approved successfully'
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to approve document', details: error.message },
      { status: 500 }
    )
  }
}
