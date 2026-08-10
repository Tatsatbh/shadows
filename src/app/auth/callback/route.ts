import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

// The post-login destination comes from the query string, so an attacker can
// pick it and mail the link to a victim. Pasting it onto the origin meant
// `?redirect=@evil.com` parsed as userinfo for the host `evil.com`, and
// `//evil.com` or `/\evil.com` parsed as a host outright, so a user was handed
// to an attacker's site at the moment they had just signed in and trusted it.
// Only a path beginning with a single slash is allowed, and the resolved URL
// must still sit on this origin; anything else lands on the dashboard.
function safeRedirectUrl(target: string | null, origin: string): URL {
  const fallback = new URL('/dashboard', origin)
  if (!target || !/^\/[^/\\]/.test(target)) return fallback

  const resolved = new URL(target, origin)
  return resolved.origin === origin ? resolved : fallback
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirect = safeRedirectUrl(
    requestUrl.searchParams.get('redirect'),
    requestUrl.origin
  )

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      return NextResponse.redirect(
        `${requestUrl.origin}/?error=${encodeURIComponent(error.message)}`
      )
    }
  }

  return NextResponse.redirect(redirect)
}
