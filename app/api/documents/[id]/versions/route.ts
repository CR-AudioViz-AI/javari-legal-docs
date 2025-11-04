import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/documents/[id]/versions - Get all versions of a document
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('document_versions')
      .select('*')
      .eq('document_id', params.id)
      .order('version_number', { ascending: false })

    if (error) throw error

    return NextResponse.json({ versions: data })

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch versions', details: error.message },
      { status: 500 }
    )
  }
}

// POST /api/documents/[id]/versions - Create new version
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { original_content, converted_content, notes, created_by } = body

    // Get current version number
    const { data: latestVersion } = await supabase
      .from('document_versions')
      .select('version_number')
      .eq('document_id', params.id)
      .order('version_number', { ascending: false })
      .limit(1)
      .single()

    const nextVersion = latestVersion ? latestVersion.version_number + 1 : 1

    // Create new version
    const { data, error } = await supabase
      .from('document_versions')
      .insert([{
        document_id: params.id,
        version_number: nextVersion,
        original_content,
        converted_content,
        notes,
        created_by
      }])
      .select()
      .single()

    if (error) throw error

    // Update document with latest version
    await supabase
      .from('legalease_documents')
      .update({
        original_content,
        converted_content,
        current_version: nextVersion,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)

    return NextResponse.json({
      success: true,
      version: data
    }, { status: 201 })

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create version', details: error.message },
      { status: 500 }
    )
  }
}
