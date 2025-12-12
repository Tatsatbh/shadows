import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Admin client - bypasses RLS, use only in server-side code (API routes)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
