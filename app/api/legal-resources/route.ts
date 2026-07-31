// app/api/legal-resources/route.ts
// Three genuinely separate, purely informational tools in one endpoint:
// dictionary lookup, "what kind of attorney do I need" matching, and real
// state bar referral links. None of this recommends a specific attorney or
// takes a fee tied to legal representation - that's the deliberate line kept
// after researching ABA Model Rule 5.4(a)/7.2(b).
// CR AudioViz AI · EIN 39-3646201 · July 30, 2026
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Fixed 2026-07-31: revalidate=3600 meant state bar / dictionary data could
// be served stale for up to an hour after a real database update - removed
// in favor of always querying live, matching every other route.
export const dynamic = "force-dynamic";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SB_SVC = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!SB_URL || !SB_SVC) return NextResponse.json({ ok: false }, { status: 503 });
  const sb = createClient(SB_URL, SB_SVC, { auth: { persistSession: false } });

  const mode = req.nextUrl.searchParams.get("mode") ?? "dictionary";

  if (mode === "dictionary") {
    const q = req.nextUrl.searchParams.get("q");
    let query = sb.from("legal_dictionary").select("*").order("term");
    if (q) query = query.or(`term.ilike.%${q}%,definition.ilike.%${q}%`);
    const { data } = await query;
    return NextResponse.json({ ok: true, terms: data ?? [] });
  }

  if (mode === "practice-areas") {
    const { data } = await sb.from("attorney_practice_areas").select("*").order("name");
    return NextResponse.json({ ok: true, practice_areas: data ?? [] });
  }

  if (mode === "state-bar") {
    const state = req.nextUrl.searchParams.get("state");
    let query = sb.from("state_bar_referral_services").select("*").order("state");
    if (state) query = query.eq("state", state);
    const { data } = await query;
    return NextResponse.json({ ok: true, referral_services: data ?? [] });
  }

  return NextResponse.json({ ok: false, error: "Unknown mode" }, { status: 400 });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!SB_URL || !SB_SVC) return NextResponse.json({ ok: false }, { status: 503 });
  const sb = createClient(SB_URL, SB_SVC, { auth: { persistSession: false } });

  let body: { situation?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 }); }
  const situation = (body.situation ?? "").toLowerCase();
  if (!situation.trim()) return NextResponse.json({ ok: false, error: "Describe your situation" }, { status: 400 });

  // Plain keyword matching, not a black box - every match is explainable by
  // which words in the description hit which practice area's real keywords.
  const { data: areas } = await sb.from("attorney_practice_areas").select("*");
  const scored = (areas ?? []).map(area => {
    const hits = (area.keywords as string[]).filter(k => situation.includes(k.toLowerCase()));
    return { area, hits };
  }).filter(s => s.hits.length > 0).sort((a, b) => b.hits.length - a.hits.length);

  if (scored.length === 0) {
    return NextResponse.json({
      ok: true, matches: [],
      note: "We could not confidently match this to a specific practice area. A general civil litigation attorney, or your state's lawyer referral service, can point you in the right direction.",
    });
  }

  return NextResponse.json({
    ok: true,
    matches: scored.slice(0, 3).map(s => ({
      practice_area: s.area.name, description: s.area.description,
      urgency_note: s.area.urgency_note, matched_on: s.hits,
    })),
    disclaimer: "This is a general guide to what type of attorney typically handles this kind of situation - it is not legal advice and does not recommend any specific lawyer.",
  });
}
