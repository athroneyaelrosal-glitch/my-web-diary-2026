import { createClient } from '@supabase/supabase-js'
import type { Database } from './database/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)
export const supabaseConfigMessage =
    'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY to a .env.local file, then restart npm run dev.'

if (!isSupabaseConfigured) {
    console.warn(supabaseConfigMessage)
}

export const supabase = createClient<Database>(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseKey || 'placeholder-key'
)
