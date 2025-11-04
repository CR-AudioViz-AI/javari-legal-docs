import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { openai } from '@/lib/openai';

export async function GET() {
  const checks = {
    database: false,
    openai: false,
    storage: false,
  };

  const startTime = Date.now();

  // Check database
  try {
    const { error } = await supabaseAdmin.from('user_profiles').select('id').limit(1);
    checks.database = !error;
  } catch (error) {
    console.error('Database check failed:', error);
  }

  // Check OpenAI
  try {
    await openai.models.list();
    checks.openai = true;
  } catch (error) {
    console.error('OpenAI check failed:', error);
  }

  // Check Storage
  try {
    const { data, error } = await supabaseAdmin.storage.listBuckets();
    checks.storage = !error && data !== null;
  } catch (error) {
    console.error('Storage check failed:', error);
  }

  const responseTime = Date.now() - startTime;
  const allHealthy = Object.values(checks).every(v => v === true);

  return NextResponse.json({
    status: allHealthy ? 'healthy' : 'degraded',
    checks,
    responseTime,
    timestamp: new Date().toISOString(),
  });
}
