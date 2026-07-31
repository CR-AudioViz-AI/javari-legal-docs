// app/api/auth/signup/route.ts
// Disabled 2026-07-30 - same reasoning as signin/route.ts.
import { NextResponse } from 'next/server'
export async function POST() {
  return NextResponse.json({ error: 'Use central platform authentication - see /signup' }, { status: 410 })
}
