import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import mammoth from 'mammoth'
import { parsePDF } from '@/lib/pdf-parser'
import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CREDIT_COSTS = {
  small: 5,   // < 1000 words
  medium: 10, // 1000-5000 words
  large: 20   // > 5000 words
}

// Real prompts for BOTH directions - the previous version always assumed the
// input was already a legal document being converted to plain English, so
// "Plain English -> Legal" silently produced the wrong result no matter what
// the UI's direction toggle said.
function buildPrompt(direction: string, sourceText: string): string {
  if (direction === 'plain-to-legal') {
    return `Convert this plain-English description into formal legal document language, `
      + `preserving every specific fact, date, name, and number exactly as given - do not `
      + `invent any detail that was not in the original text:\n\n${sourceText}`
  }
  return `Translate this legal document into plain, everyday English a non-lawyer can `
    + `understand. Preserve every specific fact, date, name, obligation, and number exactly `
    + `- do not omit or invent any detail:\n\n${sourceText}`
}

export async function POST(request: NextRequest) {
  try {
    // The service-role client has no session of its own - getUser() with no
    // token argument was silently returning null for every request. Extract
    // the real bearer token from the Authorization header and pass it
    // explicitly, matching the pattern used everywhere else on the platform.
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const rawText = formData.get('text') as string | null
    const direction = (formData.get('direction') as string) || 'legal-to-plain'
    const acknowledgedDisclaimer = formData.get('acknowledged_disclaimer') === 'true'

    // Same structural requirement as document generation - not optional page
    // text, an actual gate at the API layer.
    if (!acknowledgedDisclaimer) {
      return NextResponse.json({
        error: 'You must acknowledge that this is not legal advice before converting a document',
      }, { status: 400 })
    }

    if (!file && !rawText?.trim()) {
      return NextResponse.json({ error: 'Provide a file or paste text to convert' }, { status: 400 })
    }

    // Extract text from whichever real input was actually provided. PDF and
    // DOCX use their real parsers; plain-pasted text and .txt files are used
    // as-is. A mismatched extension (e.g. a .pdf sent through mammoth) would
    // previously have thrown an opaque error - handled explicitly here.
    let originalText: string
    let sourceName: string
    if (file) {
      sourceName = file.name
      const buffer = Buffer.from(await file.arrayBuffer())
      const lower = file.name.toLowerCase()
      if (lower.endsWith('.pdf')) {
        const parsed = await parsePDF(buffer)
        originalText = parsed.text
      } else if (lower.endsWith('.docx')) {
        const result = await mammoth.extractRawText({ buffer })
        originalText = result.value
      } else {
        // .txt or unrecognized - read as plain text rather than guessing at
        // a binary parser that would corrupt the content.
        originalText = buffer.toString('utf-8')
      }
    } else {
      sourceName = 'pasted text'
      originalText = rawText as string
    }

    if (!originalText.trim()) {
      return NextResponse.json({ error: 'Could not read any text from that file' }, { status: 422 })
    }

    // Calculate cost
    const wordCount = originalText.split(/\s+/).filter(Boolean).length
    let cost = CREDIT_COSTS.small
    if (wordCount > 5000) cost = CREDIT_COSTS.large
    else if (wordCount > 1000) cost = CREDIT_COSTS.medium

    // Spend against the REAL shared platform credit balance, not a local,
    // disconnected count. Server-to-server call to the same central endpoint
    // every other app on the platform uses (see lib/central-services.ts,
    // CentralCredits.spend) - a customer's actual paid credits now work here.
    const spendRes = await fetch('https://craudiovizai.com/api/credits/spend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'x-app-id': 'javari-legal-docs',
      },
      body: JSON.stringify({ amount: cost, description: `Document conversion (${direction}): ${sourceName}` }),
    })
    const spendResult = await spendRes.json()

    if (!spendRes.ok) {
      return NextResponse.json({
        error: spendResult.error || 'Insufficient credits',
        creditsNeeded: cost,
      }, { status: spendRes.status === 401 ? 401 : 402 })
    }

    // Convert document - the real prompt now matches the direction the user
    // actually selected, in both directions.
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: buildPrompt(direction, originalText) }]
    })

    const convertedText = completion.choices[0]?.message?.content || ''
    if (!convertedText) {
      return NextResponse.json({ error: 'Conversion produced no output — try again' }, { status: 502 })
    }

    return NextResponse.json({
      success: true,
      originalText,
      convertedText,
      cost,
      newBalance: spendResult.balance ?? spendResult.newBalance ?? null,
      wordCount,
      disclaimer: 'This conversion was generated by AI and is not legal advice. Have a licensed attorney review it before you rely on it.',
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
