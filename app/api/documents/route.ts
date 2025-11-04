import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    const { data: documents, error } = await supabaseAdmin
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ documents })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, title, originalContent, documentType } = await request.json()

    if (!userId || !title || !originalContent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data: document, error } = await supabaseAdmin
      .from('documents')
      .insert({
        user_id: userId,
        title,
        original_content: originalContent,
        document_type: documentType || 'other',
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ document })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create document' },
      { status: 500 }
    )
  }
}
