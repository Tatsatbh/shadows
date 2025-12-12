import { createClient } from '@supabase/supabase-js'

let _supabaseAdmin: ReturnType<typeof createClient> | null = null

export const supabaseAdmin = () => {
  if (!_supabaseAdmin) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    _supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
  }
  return _supabaseAdmin
}
