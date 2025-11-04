import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types matching crav-website schema
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          credits_balance: number
          subscription_tier: 'free' | 'starter' | 'professional' | 'enterprise'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          credits_balance?: number
          subscription_tier?: 'free' | 'starter' | 'professional' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          credits_balance?: number
          subscription_tier?: 'free' | 'starter' | 'professional' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
      }
      legalease_documents: {
        Row: {
          id: string
          user_id: string
          title: string
          original_content: string
          converted_content: string | null
          conversion_type: 'legal-to-plain' | 'plain-to-legal'
          document_type: 'contract' | 'agreement' | 'terms' | 'policy' | 'other'
          status: 'pending' | 'processing' | 'completed' | 'failed'
          credits_used: number
          key_terms: any | null
          summary: string | null
          file_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          original_content: string
          converted_content?: string | null
          conversion_type: 'legal-to-plain' | 'plain-to-legal'
          document_type?: 'contract' | 'agreement' | 'terms' | 'policy' | 'other'
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          credits_used: number
          key_terms?: any | null
          summary?: string | null
          file_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          original_content?: string
          converted_content?: string | null
          conversion_type?: 'legal-to-plain' | 'plain-to-legal'
          document_type?: 'contract' | 'agreement' | 'terms' | 'policy' | 'other'
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          credits_used?: number
          key_terms?: any | null
          summary?: string | null
          file_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      credit_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: 'purchase' | 'usage' | 'refund' | 'bonus'
          description: string
          app_name: string | null
          metadata: Record<string, any> | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: 'purchase' | 'usage' | 'refund' | 'bonus'
          description: string
          app_name?: string | null
          metadata?: Record<string, any> | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: 'purchase' | 'usage' | 'refund' | 'bonus'
          description?: string
          app_name?: string | null
          metadata?: Record<string, any> | null
          created_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          content: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: string
          content: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string
          content?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      branding: {
        Row: {
          id: string
          user_id: string
          logo_url: string | null
          primary_color: string
          secondary_color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
