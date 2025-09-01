import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para as tabelas do Supabase
export interface Database {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string
          name: string
          type: 'general' | 'store'
          description: string | null
          owner_id: string
          created_at: string
          updated_at: string
          status: 'active' | 'inactive' | 'suspended'
          settings: Json | null
        }
        Insert: {
          id?: string
          name: string
          type: 'general' | 'store'
          description?: string | null
          owner_id: string
          created_at?: string
          updated_at?: string
          status?: 'active' | 'inactive' | 'suspended'
          settings?: Json | null
        }
        Update: {
          id?: string
          name?: string
          type?: 'general' | 'store'
          description?: string | null
          owner_id?: string
          created_at?: string
          updated_at?: string
          status?: 'active' | 'inactive' | 'suspended'
          settings?: Json | null
        }
      }
      workspace_members: {
        Row: {
          id: string
          workspace_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          created_at: string
          permissions: Json | null
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          created_at?: string
          permissions?: Json | null
        }
        Update: {
          id?: string
          workspace_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'member'
          created_at?: string
          permissions?: Json | null
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          company: string | null
          phone: string | null
          created_at: string
          updated_at: string
          settings: Json | null
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          company?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          settings?: Json | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          company?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          settings?: Json | null
        }
      }
      leads: {
        Row: {
          id: string
          workspace_id: string
          name: string
          email: string
          phone: string | null
          source: string
          status: 'hot' | 'warm' | 'cold'
          score: number
          value: number
          created_at: string
          updated_at: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          email: string
          phone?: string | null
          source: string
          status?: 'hot' | 'warm' | 'cold'
          score?: number
          value?: number
          created_at?: string
          updated_at?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          email?: string
          phone?: string | null
          source?: string
          status?: 'hot' | 'warm' | 'cold'
          score?: number
          value?: number
          created_at?: string
          updated_at?: string
          metadata?: Json | null
        }
      }
      store_metrics: {
        Row: {
          id: string
          workspace_id: string
          date: string
          leads_count: number
          revenue: number
          roi: number
          dwell_time: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          date: string
          leads_count: number
          revenue: number
          roi: number
          dwell_time?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          date?: string
          leads_count?: number
          revenue?: number
          roi?: number
          dwell_time?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Tables = Database['public']['Tables']
export type Workspace = Tables['workspaces']['Row']
export type WorkspaceMember = Tables['workspace_members']['Row']
export type User = Tables['users']['Row']
export type Lead = Tables['leads']['Row']
export type StoreMetric = Tables['store_metrics']['Row']
