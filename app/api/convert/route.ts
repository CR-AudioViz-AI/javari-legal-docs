import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { deductCredits } from '@/lib/credits'
import mammoth from 'mammoth'
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

export async function POST(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const targetLanguage = formData.get('language') as string || 'plain'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Extract text
    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await mammoth.extractRawText({ buffer })
    const originalText = result.value

    // Calculate cost
    const wordCount = originalText.split(/\s+/).length
    let cost = CREDIT_COSTS.small
    if (wordCount > 5000) cost = CREDIT_COSTS.large
    else if (wordCount > 1000) cost = CREDIT_COSTS.medium

    // Deduct credits FIRST
    const creditResult = await deductCredits(
      user.id,
      cost,
      `Document conversion: ${file.name}`,
      undefined,
      'conversion'
    )

    if (!creditResult.success) {
      return NextResponse.json({
        error: creditResult.error || 'Insufficient credits',
        creditsNeeded: cost,
        currentBalance: creditResult.newBalance
      }, { status: 402 })
    }

    // Convert document
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{
        role: 'user',
        content: `Convert this legal document to ${targetLanguage} language:\n\n${originalText}`
      }]
    })

    const convertedText = completion.choices[0]?.message?.content || originalText

    return NextResponse.json({
      success: true,
      originalText,
      convertedText,
      cost,
      newBalance: creditResult.newBalance,
      wordCount
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
