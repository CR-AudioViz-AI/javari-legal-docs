import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/search - Advanced document search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Search parameters
    const query_text = searchParams.get('q')
    const organization_id = searchParams.get('organization_id')
    const team_id = searchParams.get('team_id')
    const document_type = searchParams.get('document_type')
    const status = searchParams.get('status')
    const created_after = searchParams.get('created_after')
    const created_before = searchParams.get('created_before')
    const tags = searchParams.get('tags')?.split(',')
    const is_archived = searchParams.get('is_archived')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query
    let query = supabase
      .from('legalease_documents')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    // Apply filters
    if (organization_id) {
      query = query.eq('organization_id', organization_id)
    }

    if (team_id) {
      query = query.eq('team_id', team_id)
    }

    if (document_type) {
      query = query.eq('document_type', document_type)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (created_after) {
      query = query.gte('created_at', created_after)
    }

    if (created_before) {
      query = query.lte('created_at', created_before)
    }

    if (is_archived !== null) {
      query = query.eq('is_archived', is_archived === 'true')
    }

    if (tags && tags.length > 0) {
      query = query.contains('tags', tags)
    }

    // Full-text search if query provided
    if (query_text) {
      query = query.or(`title.ilike.%${query_text}%,original_content.ilike.%${query_text}%,converted_content.ilike.%${query_text}%`)
    }

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      documents: data,
      total: count,
      limit,
      offset,
      has_more: count ? offset + limit < count : false
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Search failed', details: error.message },
      { status: 500 }
    )
  }
}
