// app/api/auth/signin/route.ts
// Disabled 2026-07-30: a local, duplicate auth system, unused by anything in
// this codebase and confirmed unreachable (no page ever called it). Per Roy:
// every app ties into the one shared platform identity or it doesn't ship its
// own. Real sign-in now lives at /login, which redirects to core auth.
import { NextResponse } from 'next/server'
export async function POST() {
  return NextResponse.json({ error: 'Use central platform authentication - see /login' }, { status: 410 })
}
