import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const protectedRoutes = ['/problems', '/dashboard']
const authRoutes = ['/sign-in']
// Private app pages: crawlers must never index these
const noindexRoutes = [
  '/problems',
  '/dashboard',
  '/account',
  '/billing',
  '/notifications',
  '/upgrade',
  '/report',
  '/reports',
  '/auth',
  '/sign-in',
]

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )
  const isNoindexRoute = noindexRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Redirect unauthenticated users to homepage
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (isNoindexRoute) {
    supabaseResponse.headers.set('X-Robots-Tag', 'noindex')
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/problems/:path*',
    '/dashboard/:path*',
    '/account',
    '/billing',
    '/notifications',
    '/upgrade',
    '/report/:path*',
    '/reports',
    '/sign-in',
    '/auth/:path*',
  ],
}
