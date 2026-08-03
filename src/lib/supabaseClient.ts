import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

let _supabaseAdmin: ReturnType<typeof createClient<Database>> | null = null

export const supabaseAdmin = () => {
  if (!_supabaseAdmin) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    _supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceRoleKey)
  }
  return _supabaseAdmin
}
