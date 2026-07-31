// app/api/credits/balance/route.ts
// Proxies to the platform's real shared credit balance. Done server-side,
// not as a direct browser call from the dashboard, because the central
// endpoint's CORS allowlist does not include this app's own domains yet -
// this avoids needing that changed just to show a number, while still
// surfacing the real balance rather than a local, disconnected one.
// CR AudioViz AI · EIN 39-3646201 · July 30, 2026
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const h = req.headers.get("authorization");
  const token = h?.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  try {
    const res = await fetch("https://craudiovizai.com/api/credits/balance", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    if (!res.ok) return NextResponse.json({ ok: false, error: body.error ?? "Could not load balance" }, { status: res.status });
    return NextResponse.json({ ok: true, balance: body.balance ?? body.credits ?? 0 });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not reach the credit service" }, { status: 502 });
  }
}
