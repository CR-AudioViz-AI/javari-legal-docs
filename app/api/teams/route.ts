import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/teams - List teams
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organization_id = searchParams.get('organization_id')
    const specialty = searchParams.get('specialty')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase
      .from('teams')
      .select(`
        *,
        organization:organizations(id, name),
        team_members(id, user_id, role)
      `)
      .limit(limit)
      .order('created_at', { ascending: false })

    if (organization_id) {
      query = query.eq('organization_id', organization_id)
    }

    if (specialty) {
      query = query.eq('specialty', specialty)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ teams: data })

  } catch (error: any) {
    console.error('Error fetching teams:', error)
    return NextResponse.json(
      { error: 'Failed to fetch teams', details: error.message },
      { status: 500 }
    )
  }
}

// POST /api/teams - Create new team
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { organization_id, name, description, specialty, color, created_by } = body

    // Validation
    if (!organization_id || !name) {
      return NextResponse.json(
        { error: 'Organization ID and name are required' },
        { status: 400 }
      )
    }

    // Verify organization exists
    const { data: org } = await supabase
      .from('organizations')
      .select('id')
      .eq('id', organization_id)
      .single()

    if (!org) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Create team
    const { data, error } = await supabase
      .from('teams')
      .insert([{
        organization_id,
        name,
        description,
        specialty,
        color: color || '#3B82F6',
        created_by
      }])
      .select()
      .single()

    if (error) throw error

    // If created_by is provided, add them as team lead
    if (created_by) {
      await supabase
        .from('team_members')
        .insert([{
          team_id: data.id,
          user_id: created_by,
          role: 'lead',
          added_by: created_by
        }])
    }

    return NextResponse.json({
      success: true,
      team: data
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating team:', error)
    return NextResponse.json(
      { error: 'Failed to create team', details: error.message },
      { status: 500 }
    )
  }
}
