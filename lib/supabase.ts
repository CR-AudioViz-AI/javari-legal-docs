/**
 * CR AudioViz AI - Supabase Client
 * =================================
 *
 * Universal database client for CR AudioViz AI apps.
 * For authentication, credits, and central services, use:
 *
 *   import { CentralServices, CentralAuth, CentralCredits } from './central-services';
 *
 * This client is for app-specific database operations only.
 * Auth, payments, and credits should ALWAYS go through central services.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Re-export admin utilities from central services
export { isAdmin, shouldChargeCredits, ADMIN_EMAILS, CentralServices } from './central-services';

// Centralized Supabase configuration. No hardcoded fallback key - a real
// credential belongs in environment variables only, never a string literal
// in source. If the env var is genuinely missing, fail loudly rather than
// silently running against a stale key that could be wrong or revoked.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('[lib/supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set.');
}

// Standard client for general use
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL ?? '', SUPABASE_ANON_KEY ?? ''
);

// Browser client for auth (SSR-safe singleton pattern)
let browserClient: SupabaseClient | null = null;

export function createSupabaseBrowserClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    // Server-side: return new client each time
    return createClient(SUPABASE_URL ?? '', SUPABASE_ANON_KEY ?? '');
  }

  // Client-side: return singleton
  if (!browserClient) {
    browserClient = createClient(SUPABASE_URL ?? '', SUPABASE_ANON_KEY ?? '', {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }
  return browserClient;
}

// Server client for API routes - uses the service role key when available.
export function createSupabaseServerClient(): SupabaseClient {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not set, using anon key');
    return createClient(SUPABASE_URL ?? '', SUPABASE_ANON_KEY ?? '');
  }
  return createClient(SUPABASE_URL ?? '', serviceKey);
}

// Several API routes (templates, organizations, teams, etc.) import
// supabaseAdmin directly - it was never actually exported, meaning those
// routes would fail on import alone regardless of whether their tables
// existed. This is the real, working admin client they need.
export const supabaseAdmin: SupabaseClient = createSupabaseServerClient();

export { SUPABASE_URL, SUPABASE_ANON_KEY };
export default supabase;
