// app/api/deploy-tables/route.ts
// Disabled 2026-07-30: this endpoint was guarded by a hardcoded secret
// literal committed in plaintext to the source code, protecting a route with
// full service-role database access - not a real secret once it's in a repo.
// Schema setup is done, and any future migration should go through Supabase's
// own management API with a real, rotatable credential, not a string in code.
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export async function POST() {
  return NextResponse.json({ error: 'Disabled - use Supabase management API for migrations' }, { status: 501 })
}
export async function GET() {
  return NextResponse.json({ error: 'Disabled - use Supabase management API for migrations' }, { status: 501 })
}
