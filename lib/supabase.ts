import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          auth_user_id: string
          name: string
          phone: string | null
          avatar: string | null
          role: 'visitor' | 'counselor'
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          auth_user_id: string
          name: string
          phone?: string | null
          avatar?: string | null
          role: 'visitor' | 'counselor'
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          auth_user_id?: string
          name?: string
          phone?: string | null
          avatar?: string | null
          role?: 'visitor' | 'counselor'
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      counselor_profiles: {
        Row: {
          id: string
          user_id: string
          bio: string | null
          gender: '男' | '女'
          qualification: string | null
          experience_years: number
          consultation_fee: number | null
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bio?: string | null
          gender: '男' | '女'
          qualification?: string | null
          experience_years?: number
          consultation_fee?: number | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bio?: string | null
          gender?: '男' | '女'
          qualification?: string | null
          experience_years?: number
          consultation_fee?: number | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      specialties: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      counselor_specialties: {
        Row: {
          counselor_id: string
          specialty_id: string
        }
        Insert: {
          counselor_id: string
          specialty_id: string
        }
        Update: {
          counselor_id?: string
          specialty_id?: string
        }
      }
      time_slot_templates: {
        Row: {
          id: string
          counselor_id: string
          day_of_week: number
          start_time: string
          end_time: string
          repeat_type: 'none' | 'weekly' | 'biweekly'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          counselor_id: string
          day_of_week: number
          start_time: string
          end_time: string
          repeat_type?: 'none' | 'weekly' | 'biweekly'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          counselor_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          repeat_type?: 'none' | 'weekly' | 'biweekly'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      time_slots: {
        Row: {
          id: string
          counselor_id: string
          template_id: string | null
          start_time: string
          end_time: string
          is_available: boolean
          max_appointments: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          counselor_id: string
          template_id?: string | null
          start_time: string
          end_time: string
          is_available?: boolean
          max_appointments?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          counselor_id?: string
          template_id?: string | null
          start_time?: string
          end_time?: string
          is_available?: boolean
          max_appointments?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 