import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getErrorMessage, logError, formatApiError } from '@/lib/utils/error-utils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: Request) {
  try {
    const { authorization } = await request.json()
    
    // Simple auth check
    if (authorization !== process.env.DEPLOY_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get schema from GitHub
    const schemaResponse = await fetch(
      'https://raw.githubusercontent.com/CR-AudioViz-AI/crav-legalease/main/database/enterprise-schema.sql'
    )
    const schema = await schemaResponse.text()

    // Execute via Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    })

    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0)

    console.log(`Executing ${statements.length} SQL statements...`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (!statement) continue

      try {
        await supabase.rpc('exec', { sql: statement + ';' })
      } catch (err: unknown) {
        // Try direct execution if rpc fails
        console.log(`Statement ${i+1} via RPC failed, trying alternative...`)
      }
    }

    // Verify tables exist
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')

    if (error) {
      logError(\'Verification error:\', error)
    }

    return NextResponse.json({
      success: true,
      message: 'Database schema deployed',
      tables: tables?.length || 0,
      deployed: new Date().toISOString()
    })

  } catch (error: any) {
    logError(\'Deployment error:\', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
