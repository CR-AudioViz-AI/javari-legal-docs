// app/api/migrate/route.ts
// Disabled 2026-07-30: this endpoint had NO authentication check at all -
// anyone who found the URL could execute arbitrary migration SQL with full
// service-role database access. Schema setup is done; any future migration
// should go through Supabase's own management API, not an open POST route.
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export async function POST() {
  return NextResponse.json({ error: 'Disabled - use Supabase management API for migrations' }, { status: 501 })
}
export async function GET() {
  return NextResponse.json({ error: 'Disabled - use Supabase management API for migrations' }, { status: 501 })
}
