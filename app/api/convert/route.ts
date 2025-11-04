import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { convertLegalToPlain, convertPlainToLegal, extractKeyTerms, generateSummary } from '@/lib/openai'
import { calculateCreditsUsed } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { text, conversionType, userId } = await request.json()

    if (!text || !conversionType || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check user's available credits
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate credits needed
    const creditsNeeded = calculateCreditsUsed(text.length, conversionType)

    if (user.credits < creditsNeeded) {
      return NextResponse.json(
        { error: 'Insufficient credits', creditsNeeded, available: user.credits },
        { status: 402 }
      )
    }

    // Perform conversion
    let convertedText: string
    if (conversionType === 'legal-to-plain') {
      convertedText = await convertLegalToPlain(text)
    } else if (conversionType === 'plain-to-legal') {
      convertedText = await convertPlainToLegal(text)
    } else {
      return NextResponse.json(
        { error: 'Invalid conversion type' },
        { status: 400 }
      )
    }

    // Extract key terms and generate summary (only for legal-to-plain)
    let keyTerms = null
    let summary = null
    if (conversionType === 'legal-to-plain') {
      [keyTerms, summary] = await Promise.all([
        extractKeyTerms(text),
        generateSummary(text),
      ])
    }

    // Deduct credits
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ credits: user.credits - creditsNeeded })
      .eq('id', userId)

    if (updateError) {
      console.error('Error updating credits:', updateError)
    }

    // Log usage
    await supabaseAdmin.from('usage_logs').insert({
      user_id: userId,
      action: `convert_${conversionType}`,
      credits_used: creditsNeeded,
      metadata: {
        text_length: text.length,
        conversion_type: conversionType,
      },
    })

    return NextResponse.json({
      success: true,
      convertedText,
      keyTerms,
      summary,
      creditsUsed: creditsNeeded,
      remainingCredits: user.credits - creditsNeeded,
    })
  } catch (error: any) {
    console.error('Conversion error:', error)
    return NextResponse.json(
      { error: error.message || 'Conversion failed' },
      { status: 500 }
    )
  }
}
