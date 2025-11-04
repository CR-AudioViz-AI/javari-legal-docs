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

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          credits: number
          plan: 'free' | 'starter' | 'professional' | 'enterprise'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          credits?: number
          plan?: 'free' | 'starter' | 'professional' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          credits?: number
          plan?: 'free' | 'starter' | 'professional' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          user_id: string
          title: string
          original_content: string
          converted_content: string | null
          document_type: 'contract' | 'agreement' | 'terms' | 'policy' | 'other'
          status: 'pending' | 'processing' | 'completed' | 'failed'
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
          document_type?: 'contract' | 'agreement' | 'terms' | 'policy' | 'other'
          status?: 'pending' | 'processing' | 'completed' | 'failed'
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
          document_type?: 'contract' | 'agreement' | 'terms' | 'policy' | 'other'
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          file_url?: string | null
          created_at?: string
          updated_at?: string
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
      usage_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          credits_used: number
          metadata: Record<string, any> | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          credits_used: number
          metadata?: Record<string, any> | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          credits_used?: number
          metadata?: Record<string, any> | null
          created_at?: string
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
