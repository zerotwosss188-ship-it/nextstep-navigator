import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase env vars missing. Check .env.local')
  console.error('URL:', supabaseUrl)
  console.error('Key:', supabaseKey ? 'present' : 'missing')
}

export const supabase = createClient(supabaseUrl, supabaseKey)