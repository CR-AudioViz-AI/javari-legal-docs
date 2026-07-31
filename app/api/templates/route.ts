import { NextRequest, NextResponse } from 'next/server'

// Fixed 2026-07-31, second pass: force-dynamic alone did not resolve this -
// confirmed via direct testing that the database, credentials, and query
// were all correct (141 real rows), but the deployed app kept returning a
// stale 102. The supabase-js client wraps fetch() internally in a way
// Next.js's Data Cache was apparently still memoizing despite force-dynamic.
// Bypassing the client entirely here with a raw fetch and an explicit
// cache: 'no-store', which Next.js respects at the individual fetch-call
// level regardless of any route-level or library-level caching behavior.
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      return NextResponse.json({ error: 'Service not configured' }, { status: 503 })
    }

    const res = await fetch(
      `${url}/rest/v1/templates?select=*&is_active=eq.true&order=category.asc`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: 'no-store',
      }
    )

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: text || 'Failed to fetch templates' }, { status: res.status })
    }

    const templates = await res.json()
    return NextResponse.json({ templates })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}
