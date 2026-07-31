// app/api/attorney-listings/route.ts
// Flat-fee attorney advertising, publicly searchable. Deliberately does NOT
// rank, rate, or "recommend" any listing over another beyond the paid tier a
// firm chose (basic/featured/premium) - that specific restraint is what keeps
// this inside ABA Rule 7.2's advertising exception rather than crossing into
// the "recommendation" territory Rule 7.2(b) prohibits paying for.
// CR AudioViz AI · EIN 39-3646201 · July 30, 2026
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SB_SVC = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const TIER_ORDER: Record<string, number> = { premium: 0, featured: 1, basic: 2 };

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!SB_URL || !SB_SVC) return NextResponse.json({ ok: false }, { status: 503 });
  const sb = createClient(SB_URL, SB_SVC, { auth: { persistSession: false } });

  const practiceArea = req.nextUrl.searchParams.get("practice_area");
  const state = req.nextUrl.searchParams.get("state");
  const city = req.nextUrl.searchParams.get("city");

  let query = sb.from("attorney_listings").select("*").eq("status", "active");
  if (practiceArea) query = query.contains("practice_areas", [practiceArea]);
  if (state) query = query.contains("service_states", [state]);
  if (city) query = query.contains("cities_served", [city]);

  const { data, error } = await query;
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  // Ordered by paid tier only - never by any assessment of quality. This
  // ordering is disclosed openly, not hidden, since Rule 7.2 requires
  // advertising to be honest about what it is.
  const results = (data ?? []).sort((a, b) => TIER_ORDER[a.listing_tier] - TIER_ORDER[b.listing_tier]);

  return NextResponse.json({
    ok: true,
    results,
    disclosure: "Listings are ordered by the advertising tier the attorney purchased, not by any rating, review, or endorsement from CR AudioViz AI. We do not vet, recommend, or vouch for any listed attorney.",
  });
}
