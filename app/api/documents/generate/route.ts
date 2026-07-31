// app/api/documents/generate/route.ts
// Generates a real document from a real template: fills in the user's actual
// facts, then has the model expand the skeleton into complete, readable
// legal-style prose - not a fabricated "AI wrote a contract from scratch"
// claim, an actual template with the user's real details, professionally
// expanded. Every generated document carries the attorney-review disclaimer
// as structural data, not optional page text.
// CR AudioViz AI · EIN 39-3646201 · July 30, 2026
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { OpenAI } from "openai";

export const dynamic = "force-dynamic";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SB_SVC = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CREDIT_COST = 15; // document generation costs more than a plain conversion - real drafting work

export const DISCLAIMER =
  "This document was generated from a standard template using AI, based on the information " +
  "you provided. It is not legal advice, and CR AudioViz AI is not a law firm and does not " +
  "provide legal representation. Laws vary by state and situation - have a licensed attorney " +
  "review this document before you sign it, rely on it, or use it for any legal purpose.";

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!SB_URL || !SB_SVC) return NextResponse.json({ ok: false }, { status: 503 });
  const sb = createClient(SB_URL, SB_SVC, { auth: { persistSession: false } });

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: { user } } = await sb.auth.getUser(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { template_slug?: string; fields?: Record<string, string>; acknowledged_disclaimer?: boolean };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }

  // The disclaimer acknowledgment is required at the API layer, not just
  // shown on a page - a request that skips it is rejected outright rather
  // than trusting the frontend to have displayed something.
  if (body.acknowledged_disclaimer !== true) {
    return NextResponse.json({
      error: "You must acknowledge that this is not legal advice before generating a document",
      disclaimer: DISCLAIMER,
    }, { status: 400 });
  }

  if (!body.template_slug) {
    return NextResponse.json({ error: "template_slug is required" }, { status: 400 });
  }

  const { data: template } = await sb.from("templates")
    .select("*").eq("slug", body.template_slug).eq("is_active", true).maybeSingle();
  if (!template) {
    return NextResponse.json({ error: "Unknown or inactive template" }, { status: 404 });
  }

  const fields = body.fields ?? {};
  const templateFields = (template.fields as { k: string; l: string }[]) ?? [];
  const missing = templateFields.filter(f => !fields[f.k]?.trim()).map(f => f.l);
  if (missing.length > 0) {
    return NextResponse.json({
      error: `Missing required information: ${missing.join(", ")}`,
      missing_fields: missing,
    }, { status: 422 });
  }

  // Fill the real template skeleton with the user's real facts first -
  // deterministic substitution, not left to the model to invent.
  let filledSkeleton = template.body_template as string;
  for (const [k, v] of Object.entries(fields)) {
    filledSkeleton = filledSkeleton.split(`{{${k}}}`).join(v);
  }

  // Real records-capacity check, before spending any credits - never charge
  // a customer only to discover they're out of room to save what they paid
  // for. Uses the central /api/records endpoint (aggregate across every app,
  // per Roy's explicit direction), the first real consumer of the
  // enforcement built 2026-07-31.
  const recordCheckRes = await fetch("https://craudiovizai.com/api/records?add=1", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const recordCheck = await recordCheckRes.json();
  if (recordCheckRes.ok && !recordCheck.allowed) {
    return NextResponse.json({
      error: recordCheck.message ?? "Record limit reached",
      upgrade_url: recordCheck.upgrade_url,
    }, { status: 402 });
  }

  // Spend against the real, shared platform credit balance - same central
  // endpoint every other document-generating feature on the platform uses.
  const spendRes = await fetch("https://craudiovizai.com/api/credits/spend", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, "x-app-id": "javari-legal-docs" },
    body: JSON.stringify({ amount: CREDIT_COST, description: `Document generated: ${template.name}` }),
  });
  const spendResult = await spendRes.json();
  if (!spendRes.ok) {
    return NextResponse.json({ error: spendResult.error || "Insufficient credits", creditsNeeded: CREDIT_COST }, { status: 402 });
  }

  // Expand the filled skeleton into complete, professional prose - the model
  // is explicitly told not to invent facts, only to write around what was
  // actually provided.
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "user",
      content: `Expand this legal document draft into complete, professionally-formatted prose. `
        + `Use ONLY the facts already present in the text below - do not invent any name, date, `
        + `amount, or term that isn't already there. Keep every numbered section. Do not add a `
        + `disclaimer yourself; one will be attached separately.\n\n${filledSkeleton}`,
    }],
  });
  const generatedText = completion.choices[0]?.message?.content || filledSkeleton;

  const { data: doc, error } = await sb.from("legalease_documents").insert({
    user_id: user.id,
    document_type: template.category,
    title: template.name,
    content: generatedText,
    status: "draft",
    metadata: { template_slug: template.slug, fields, disclaimer: DISCLAIMER, cost: CREDIT_COST },
  }).select("id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Register the real record increment - fire-and-forget is deliberate here:
  // the document already exists and was already paid for, so a transient
  // failure to update the usage ledger should never block the customer from
  // getting what they just paid for. A missed increment is a minor,
  // correctable drift; a blocked delivery after payment is a real problem.
  fetch("https://craudiovizai.com/api/records", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ kind: "legal_document", delta: 1 }),
  }).catch(() => { /* logged server-side on the central route; not fatal here */ });

  // Save into the platform's unified customer asset folder - the same
  // user_assets table every other app writes to - so this document shows up
  // in the customer's assets alongside everything else they own, not siloed
  // inside this one app.
  await sb.from("user_assets").insert({
    user_id: user.id,
    app_id: "javari-legal-docs",
    type: "document",
    asset_type: "legal_document",
    name: template.name,
    file_name: `${template.name}.txt`,
    url: `https://javarilegal.com/api/documents/${doc.id}/download?format=txt`,
    file_url: `https://javarilegal.com/api/documents/${doc.id}/download?format=txt`,
    mime_type: "text/plain",
    metadata: { document_id: doc.id, template_slug: template.slug, disclaimer: DISCLAIMER },
  });

  return NextResponse.json({
    success: true,
    document_id: doc.id,
    content: generatedText,
    disclaimer: DISCLAIMER,
    cost: CREDIT_COST,
    newBalance: spendResult.balance ?? spendResult.newBalance ?? null,
  });
}
