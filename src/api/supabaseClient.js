import { createClient } from '@supabase/supabase-js'

// The publishable key is safe to ship in client-side code — it's the
// public/anon key, not a secret. It only works alongside your project's
// Row Level Security rules.
//
// Set VITE_SUPABASE_URL in a .env file at the project root, e.g.:
//   VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
//   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_Of8u6YOf1nweH_RYibo2jA_-9aHR7uf
//
// .env is already git-ignored (see .gitignore).

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

const hasRealSupabaseConfig =
  Boolean(supabaseUrl) &&
  !supabaseUrl.includes('YOUR-PROJECT-REF') &&
  Boolean(supabaseKey) &&
  !supabaseKey.includes('YOUR-PROJECT-REF')

if (!hasRealSupabaseConfig) {
  // Don't throw — let the app run with local mock data (see src/data/menu.js)
  // until a real project URL and anon key are added to .env.
  console.warn(
    '[supabaseClient] Supabase is not configured. Running with local mock data only.'
  )
}

export const supabase = hasRealSupabaseConfig ? createClient(supabaseUrl, supabaseKey) : null
