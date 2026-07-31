// app/api/auth/callback/route.ts
// Disabled 2026-07-30: previously hardcoded a Supabase anon key as a fallback
// literal directly in source - a real credential should never be committed as
// a string, fallback or not. This callback was also unreachable (nothing
// called it). Real auth now flows entirely through core's /auth/confirm.
import { NextResponse } from 'next/server'
export async function GET() {
  return NextResponse.json({ error: 'Use central platform authentication' }, { status: 410 })
}
