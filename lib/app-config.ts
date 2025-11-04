/**
 * Embedded Mode Configuration
 * Controls whether app runs standalone or embedded in crav-website
 */

export type AppMode = 'standalone' | 'embedded'

export function getAppMode(): AppMode {
  // Check if running in iframe
  if (typeof window !== 'undefined') {
    return window.self !== window.top ? 'embedded' : 'standalone'
  }
  return 'standalone'
}

export function isEmbedded(): boolean {
  return getAppMode() === 'embedded'
}

export function isStandalone(): boolean {
  return getAppMode() === 'standalone'
}

// Environment-based configuration
export const APP_CONFIG = {
  mode: process.env.NEXT_PUBLIC_APP_MODE as AppMode || 'standalone',
  
  // Parent app URL (for embedded mode)
  parentUrl: process.env.NEXT_PUBLIC_PARENT_URL || 'https://craudiovizai.com',
  
  // API endpoints
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
  
  // Supabase (shared in embedded, separate in standalone)
  useSharedDatabase: process.env.NEXT_PUBLIC_USE_SHARED_DB === 'true',
}

// Credit system configuration
export const CREDIT_CONFIG = {
  // Use parent app's credit system (embedded) or own system (standalone)
  useParentCredits: APP_CONFIG.mode === 'embedded' || APP_CONFIG.useSharedDatabase,
  
  // Credit API endpoint
  creditApiUrl: APP_CONFIG.useSharedDatabase 
    ? `${APP_CONFIG.parentUrl}/api/credits`
    : '/api/credits',
}
