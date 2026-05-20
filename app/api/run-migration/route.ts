// Disabled: pg native module removed — use Supabase management API instead
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export async function POST() {
  return NextResponse.json({ error: 'Use Supabase management API for migrations' }, { status: 501 })
}
export async function GET() {
  return NextResponse.json({ error: 'Use Supabase management API for migrations' }, { status: 501 })
}
