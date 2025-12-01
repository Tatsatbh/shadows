import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const protectedRoutes = ['/problems', '/dashboard']
const authRoutes = ['/sign-in']

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Redirect unauthenticated users to homepage
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/problems/:path*',
    '/dashboard/:path*',
    '/sign-in',
    '/auth/callback',
  ],
}
