import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/organizations - List all organizations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const plan = searchParams.get('plan')
    const status = searchParams.get('status')

    let query = supabase
      .from('organizations')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (plan) {
      query = query.eq('plan', plan)
    }

    if (status) {
      query = query.eq('subscription_status', status)
    }

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      organizations: data,
      total: count,
      limit,
      offset
    })

  } catch (error: any) {
    console.error('Error fetching organizations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch organizations', details: error.message },
      { status: 500 }
    )
  }
}

// POST /api/organizations - Create new organization
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, plan, billing_email } = body

    // Validation
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Organization slug already exists' },
        { status: 409 }
      )
    }

    // Create organization
    const { data, error } = await supabase
      .from('organizations')
      .insert([{
        name,
        slug,
        plan: plan || 'free',
        billing_email,
        subscription_status: 'trial',
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      organization: data
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating organization:', error)
    return NextResponse.json(
      { error: 'Failed to create organization', details: error.message },
      { status: 500 }
    )
  }
}
