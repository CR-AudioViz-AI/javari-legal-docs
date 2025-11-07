import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getErrorMessage, logError, formatApiError } from '@/lib/utils/error-utils';

export async function POST(request: Request) {
  try {
    const { secret } = await request.json()
    if (secret !== 'deploy-legalease-now-2025') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { db: { schema: 'public' }, auth: { persistSession: false } }
    )

    // Use raw SQL via Supabase SQL API
    const tables = []
    
    try {
      // Check if tables exist
      const { data: docsCheck } = await supabase.from('legalease_documents').select('id').limit(1)
      const { data: transCheck } = await supabase.from('translations').select('id').limit(1)
      
      if (docsCheck !== null) tables.push('legalease_documents')
      if (transCheck !== null) tables.push('translations')
    } catch (e: unknown) {
      // Tables don't exist, we'll create them via migration
    }

    // If tables don't exist, we need to create them
    // Since Supabase doesn't allow raw SQL via REST API, we return instructions
    
    if (tables.length < 2) {
      return NextResponse.json({
        success: false,
        message: 'Tables need to be created via SQL Editor',
        existing_tables: tables,
        required_tables: ['legalease_documents', 'translations'],
        sql_url: 'https://supabase.com/dashboard/project/kteobfyferrukqeolofj/sql/new',
        sql_file: 'https://raw.githubusercontent.com/CR-AudioViz-AI/crav-legalease/main/database/minimal-schema.sql'
      })
    }

    return NextResponse.json({
      success: true,
      tables_verified: tables,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export const runtime = 'edge'
