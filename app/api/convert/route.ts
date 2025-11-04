import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { convertLegalToPlain, convertPlainToLegal, extractKeyTerms, generateSummary } from '@/lib/openai'
import { calculateCreditsUsed } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { text, conversionType, userId, skipCreditCheck } = await request.json()

    if (!text || !conversionType || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate credits needed
    const creditsNeeded = calculateCreditsUsed(text.length, conversionType)

    // In embedded mode with skipCreditCheck=true, parent already handled credits
    // In standalone mode, we need to check and deduct credits here
    if (!skipCreditCheck) {
      // Check user's available credits
      const { data: user, error: userError } = await supabaseAdmin
        .from('profiles')
        .select('credits_balance')
        .eq('id', userId)
        .single()

      if (userError || !user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      if (user.credits_balance < creditsNeeded) {
        return NextResponse.json(
          { error: 'Insufficient credits', creditsNeeded, available: user.credits_balance },
          { status: 402 }
        )
      }

      // Deduct credits
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ credits_balance: user.credits_balance - creditsNeeded })
        .eq('id', userId)

      if (updateError) {
        console.error('Error updating credits:', updateError)
        return NextResponse.json(
          { error: 'Failed to update credits' },
          { status: 500 }
        )
      }

      // Log transaction
      await supabaseAdmin.from('credit_transactions').insert({
        user_id: userId,
        amount: -creditsNeeded,
        type: 'debit',
        description: `LegalEase: ${conversionType} conversion (${text.length} chars)`,
        reference_id: null,
        status: 'completed',
      })
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
      try {
        [keyTerms, summary] = await Promise.all([
          extractKeyTerms(text),
          generateSummary(text),
        ])
      } catch (error) {
        console.error('Error extracting terms or summary:', error)
        // Continue without key terms/summary rather than failing
      }
    }

    // Save document to database (optional - for history)
    try {
      await supabaseAdmin.from('legalease_documents').insert({
        user_id: userId,
        title: `Conversion ${new Date().toISOString().slice(0, 10)}`,
        original_content: text.substring(0, 10000), // Limit to prevent huge entries
        converted_content: convertedText.substring(0, 10000),
        conversion_type: conversionType as 'legal-to-plain' | 'plain-to-legal',
        key_terms: keyTerms,
        summary: summary,
        credits_used: creditsNeeded,
        status: 'completed',
      })
    } catch (error) {
      console.error('Error saving document:', error)
      // Don't fail the request if document save fails
    }

    return NextResponse.json({
      success: true,
      convertedText,
      keyTerms,
      summary,
      creditsUsed: creditsNeeded,
    })
  } catch (error: any) {
    console.error('Conversion error:', error)
    return NextResponse.json(
      { error: error.message || 'Conversion failed' },
      { status: 500 }
    )
  }
}
