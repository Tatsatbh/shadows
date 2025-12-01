# Design Document

## Overview

This design document outlines the integration of Supabase Auth with the existing RoundsRobin Next.js 15 application. Supabase Auth provides a complete authentication solution with OAuth support (Google and GitHub), session management, and seamless integration with Supabase's Postgres database and Row Level Security (RLS) policies. The design emphasizes minimal configuration, type-safe session management, and leveraging Supabase's built-in security features.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js 15 App Router                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Sign In    │  │  Protected   │  │   Account    │      │
│  │     Page     │  │    Pages     │  │   Settings   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
│  ┌─────────────────────────▼──────────────────────────┐     │
│  │       Supabase Client (Browser)                    │     │
│  │  auth.signInWithOAuth(), auth.signOut()            │     │
│  └─────────────────────────┬──────────────────────────┘     │
│                            │                                 │
├────────────────────────────┼─────────────────────────────────┤
│                            │                                 │
│  ┌─────────────────────────▼──────────────────────────┐     │
│  │       Supabase Client (Server)                     │     │
│  │  auth.getUser(), auth.getSession()                 │     │
│  └─────────────────────────┬──────────────────────────┘     │
│                            │                                 │
│  ┌─────────────────────────▼──────────────────────────┐     │
│  │          Auth Middleware                           │     │
│  │  (Session validation, route protection)            │     │
│  └─────────────────────────┬──────────────────────────┘     │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
                ┌────────────▼────────────┐
                │   Supabase Platform     │
                │  - Auth Service         │
                │  - OAuth Providers      │
                │  - Session Management   │
                └────────────┬────────────┘
                             │
                ┌────────────▼────────────┐
                │  Supabase Postgres DB   │
                │  - auth.users           │
                │  - auth.sessions        │
                │  - auth.identities      │
                │  - RLS Policies         │
                └─────────────────────────┘
```

### Component Interaction Flow

1. **User initiates sign-in**: User clicks OAuth button on sign-in page
2. **OAuth redirect**: Supabase client redirects to provider (Google/GitHub)
3. **Provider callback**: OAuth provider redirects back to Supabase Auth
4. **Session creation**: Supabase validates OAuth response, creates/updates user, establishes session
5. **Cookie storage**: Session tokens stored in HTTP-only cookies by Supabase
6. **Protected access**: Middleware validates session on subsequent requests
7. **Client state**: Supabase client provides session data to components
8. **RLS enforcement**: Database queries automatically filtered by authenticated user

## Components and Interfaces

### 1. Supabase Client Configuration

**File**: `src/lib/supabase/client.ts` (Browser client)

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**File**: `src/lib/supabase/server.ts` (Server client)

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server component - cookies can only be set in Server Actions or Route Handlers
          }
        },
      },
    }
  )
}
```

**File**: `src/lib/supabase/middleware.ts` (Middleware client)

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { supabaseResponse, user }
}
```

### 2. Auth Middleware

**File**: `src/middleware.ts`

```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse } from 'next/server'

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

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Redirect unauthenticated users to sign-in
  if (isProtectedRoute && !user) {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### 3. Sign-In Page Component

**File**: `src/app/sign-in/page.tsx`

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function SignInPage() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const supabase = createClient()

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setIsLoading(provider)
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
      },
    })

    if (error) {
      console.error('Error signing in:', error.message)
      setIsLoading(null)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md p-8">
        <h1 className="mb-6 text-2xl font-bold">Sign in to RoundsRobin</h1>
        <div className="space-y-4">
          <Button
            onClick={() => handleOAuthSignIn('google')}
            variant="outline"
            className="w-full"
            disabled={isLoading !== null}
          >
            {isLoading === 'google' ? 'Loading...' : 'Continue with Google'}
          </Button>
          <Button
            onClick={() => handleOAuthSignIn('github')}
            variant="outline"
            className="w-full"
            disabled={isLoading !== null}
          >
            {isLoading === 'github' ? 'Loading...' : 'Continue with GitHub'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
```

### 4. OAuth Callback Route

**File**: `src/app/auth/callback/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirect = requestUrl.searchParams.get('redirect') || '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      return NextResponse.redirect(
        `${requestUrl.origin}/sign-in?error=${error.message}`
      )
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}${redirect}`)
}
```

### 5. Sign-Out Server Action

**File**: `src/app/actions/auth.ts`

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/sign-in')
}
```

### 6. User Session Hook

**File**: `src/hooks/useUser.ts`

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return { user, loading }
}
```

### 7. Protected Page Example

**File**: `src/app/problems/[name]/page.tsx` (update existing)

```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProblemPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  // Existing problem page code...
  // Now you can use user.id for queries with RLS
  return <div>Problem content for {user.email}</div>
}
```

### 8. Protected API Route Example

**File**: `src/app/api/submission/route.ts` (update existing)

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Handle submission with user.id
  const body = await request.json()
  
  const { data, error } = await supabase
    .from('submissions')
    .insert({
      user_id: user.id,
      ...body,
    })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
```

## Data Models

### Supabase Auth Schema

Supabase automatically manages these tables in the `auth` schema:

```sql
-- Users table (managed by Supabase)
-- auth.users
-- Contains: id, email, encrypted_password, email_confirmed_at, 
--           raw_user_meta_data, created_at, updated_at, etc.

-- Sessions table (managed by Supabase)
-- auth.sessions
-- Contains: id, user_id, created_at, updated_at, factor_id, aal, not_after

-- Identities table (managed by Supabase)
-- auth.identities
-- Contains: id, user_id, provider, provider_id, identity_data, created_at, updated_at
```

### Integration with Existing Schema

Update existing tables to properly reference Supabase auth.users:

```sql
-- Update submissions table foreign key
ALTER TABLE public.submissions 
  DROP CONSTRAINT IF EXISTS submissions_user_id_fkey;

ALTER TABLE public.submissions
  ADD CONSTRAINT submissions_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE SET NULL;

-- Enable RLS on submissions table
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: users can only see their own submissions
CREATE POLICY "Users can view own submissions"
  ON public.submissions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create RLS policy: users can insert their own submissions
CREATE POLICY "Users can insert own submissions"
  ON public.submissions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Similar policies for other tables
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Questions are public (anyone can read)
CREATE POLICY "Questions are viewable by everyone"
  ON public.questions
  FOR SELECT
  USING (true);

-- Test cases are public
ALTER TABLE public.test_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Test cases are viewable by everyone"
  ON public.test_cases
  FOR SELECT
  USING (true);
```

### TypeScript Types

```typescript
// src/types/auth.ts
import type { User as SupabaseUser } from '@supabase/supabase-js'

export type User = SupabaseUser

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

// Extend user metadata type
export interface UserMetadata {
  avatar_url?: string
  full_name?: string
  provider?: 'google' | 'github'
}
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


Property 1: OAuth redirect correctness
*For any* OAuth provider (Google or GitHub), clicking the sign-in button should redirect to that provider's authorization URL with correct parameters
**Validates: Requirements 1.2**

Property 2: User creation from OAuth
*For any* valid OAuth authorization response, the system should create or update a user record in auth.users and auth.identities with profile information from the OAuth provider and establish an authenticated session
**Validates: Requirements 1.3, 1.5, 3.2**

Property 3: OAuth error handling
*For any* failed OAuth authorization, the system should redirect to the sign-in page with an error message
**Validates: Requirements 1.4**

Property 4: Session token storage
*For any* successful authentication, the system should store session tokens in HTTP-only, secure cookies
**Validates: Requirements 2.1**

Property 5: Session persistence
*For any* valid session token, page refreshes or browser restarts within the session lifetime should maintain the authenticated state
**Validates: Requirements 2.2, 2.5**

Property 6: Session expiration handling
*For any* expired session token, accessing protected resources should redirect to the sign-in page
**Validates: Requirements 2.3**

Property 7: Logout completeness
*For any* authenticated session, logging out should invalidate the session and clear all authentication cookies
**Validates: Requirements 2.4**

Property 8: RLS policy enforcement
*For any* database query on RLS-enabled tables, the system should automatically filter results based on the authenticated user's ID
**Validates: Requirements 3.5**

Property 9: Protected API route enforcement
*For any* protected API route, unauthenticated requests should return a 401 Unauthorized response
**Validates: Requirements 4.1**

Property 10: Protected page enforcement
*For any* protected page and route group, unauthenticated requests should redirect to the sign-in page
**Validates: Requirements 4.2, 4.4**

Property 11: Session injection
*For any* authenticated request to a protected route, the user session should be available in the request context
**Validates: Requirements 4.3**

Property 12: OAuth identity linking
*For any* authenticated user and OAuth provider, linking should create an identity association in auth.identities with the user record
**Validates: Requirements 5.2**

Property 13: Last provider protection
*For any* user with multiple OAuth identities, unlinking should succeed for all identities except the last one
**Validates: Requirements 5.4**

Property 14: Profile update persistence
*For any* profile information update, changes should be persisted to user metadata and reflected in subsequent session queries
**Validates: Requirements 5.5**

Property 15: Authentication event logging
*For any* authentication event (sign-in, registration, logout, failure), the system should create a log entry with timestamp, user ID (if applicable), and event type
**Validates: Requirements 7.1, 7.2, 7.3, 7.4**

Property 16: Post-authentication redirect
*For any* successful authentication with a redirect parameter, the system should redirect to the specified URL
**Validates: Requirements 8.5**

## Error Handling

### OAuth Provider Errors

1. **Provider unavailable**: If OAuth provider is unreachable, display user-friendly error message and allow retry
2. **Invalid credentials**: If OAuth provider rejects authorization, redirect to sign-in with error message from query parameter
3. **State mismatch**: Supabase handles PKCE validation automatically; invalid states are rejected
4. **Missing required scopes**: If user denies required permissions, explain what's needed and why

### Session Errors

1. **Expired session**: Middleware automatically refreshes expired sessions; if refresh fails, redirect to sign-in
2. **Invalid session token**: Clear cookies and redirect to sign-in
3. **Session not found**: Treat as unauthenticated and redirect to sign-in
4. **Concurrent session limit**: Supabase supports multiple sessions by default; can be configured if needed

### Database Errors

1. **Connection failure**: Log error, return 500 status, and display maintenance message
2. **Constraint violation**: Handle unique email conflicts gracefully (Supabase manages this automatically)
3. **RLS policy violation**: Return 403 Forbidden with appropriate error message
4. **Migration errors**: Prevent application startup and log detailed error information

### Client-Side Errors

1. **Network errors**: Display retry button and cache auth state when possible
2. **Cookie blocked**: Detect and display message about enabling cookies
3. **CORS errors**: Ensure Supabase project has correct redirect URLs configured

## Testing Strategy

### Unit Testing

We will use **Vitest** as the testing framework for unit tests, leveraging its fast execution and excellent TypeScript support.

**Unit test coverage**:
- Supabase client initialization (browser, server, middleware)
- Middleware route matching logic
- Session validation functions
- OAuth callback parameter parsing
- Error message formatting
- Redirect URL construction
- RLS policy helper functions

**Example unit test structure**:
```typescript
// src/lib/supabase/__tests__/client.test.ts
import { describe, it, expect, vi } from 'vitest'
import { createClient } from '@/lib/supabase/client'

describe('Supabase Client', () => {
  it('should initialize with correct environment variables', () => {
    const client = createClient()
    expect(client).toBeDefined()
  })
})
```

### Property-Based Testing

We will use **fast-check** as the property-based testing library for JavaScript/TypeScript, which provides powerful generators and shrinking capabilities.

**Configuration**: Each property-based test should run a minimum of 100 iterations to ensure adequate coverage of the input space.

**Property test tagging**: Each property-based test MUST include a comment explicitly referencing the correctness property from this design document using the format: `**Feature: better-auth-integration, Property {number}: {property_text}**`

**Property test coverage**:
- OAuth redirect URL generation with various provider configurations
- Session token validation across different expiration states
- User record creation from diverse OAuth profile data
- Protected route enforcement across all route patterns
- Session persistence across various cookie configurations
- OAuth identity linking with multiple providers
- Profile updates with various data types
- RLS policy enforcement with different user contexts

**Example property test structure**:
```typescript
// src/lib/supabase/__tests__/auth.property.test.ts
import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'

describe('Auth Property Tests', () => {
  it('should generate valid OAuth redirect URLs for any provider config', () => {
    /**
     * Feature: better-auth-integration, Property 1: OAuth redirect correctness
     */
    fc.assert(
      fc.property(
        fc.constantFrom('google', 'github'),
        fc.webUrl(),
        (provider, redirectUrl) => {
          const authUrl = generateOAuthUrl(provider, redirectUrl)
          expect(authUrl).toContain(provider)
          expect(authUrl).toContain('redirect_uri')
        }
      ),
      { numRuns: 100 }
    )
  })
})
```

### Integration Testing

Integration tests will verify the complete authentication flows:
- Full OAuth sign-in flow (mocked Supabase responses)
- Session creation and validation
- Protected route access with middleware
- Database record creation in auth schema
- Multi-provider identity linking
- RLS policy enforcement

### End-to-End Testing

E2E tests will use Playwright to test real user flows:
- Sign in with Google (using test account)
- Sign in with GitHub (using test account)
- Access protected pages
- Link additional OAuth provider
- Sign out and verify session cleared
- Test RLS policies with real database queries

## Security Considerations

### Session Security

1. **HTTP-only cookies**: Supabase automatically stores session tokens in HTTP-only cookies
2. **Secure flag**: Cookies marked as secure in production to enforce HTTPS
3. **SameSite attribute**: Set to 'lax' by default to prevent CSRF attacks
4. **Session expiration**: Configurable session lifetime (default 1 hour) with automatic refresh
5. **Refresh tokens**: Supabase uses refresh tokens for long-lived sessions

### OAuth Security

1. **PKCE**: Supabase implements PKCE (Proof Key for Code Exchange) automatically
2. **State parameter**: Random state parameter to prevent CSRF in OAuth flow
3. **Scope validation**: Request minimal required scopes from OAuth providers
4. **Token storage**: OAuth tokens stored securely in auth.identities table

### Database Security

1. **Connection encryption**: Use SSL/TLS for database connections (Supabase default)
2. **Prepared statements**: Supabase client uses parameterized queries to prevent SQL injection
3. **Row Level Security**: RLS policies automatically restrict data access by user
4. **Audit logging**: Supabase provides built-in audit logging for auth events

### Environment Variables

All sensitive configuration must be stored in environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key (safe for client-side)
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (server-side only, for admin operations)

### Supabase Dashboard Configuration

1. **OAuth providers**: Configure Google and GitHub OAuth apps in Supabase dashboard
2. **Redirect URLs**: Add all allowed redirect URLs (localhost, staging, production)
3. **Email templates**: Customize email templates if adding email auth later
4. **Rate limiting**: Configure rate limits for auth endpoints
5. **Security settings**: Enable email confirmation, password requirements, etc.

## Migration Strategy

### Phase 1: Setup Supabase Auth

1. Install @supabase/ssr package for Next.js 15 App Router support
2. Configure OAuth providers in Supabase dashboard (Google, GitHub)
3. Create Supabase client utilities (browser, server, middleware)
4. Set up environment variables

### Phase 2: Database Migration

1. Verify auth schema exists (created automatically by Supabase)
2. Update foreign key constraints in existing tables to reference auth.users
3. Enable RLS on existing tables (submissions, questions, test_cases)
4. Create RLS policies for each table
5. Test RLS policies with different user contexts

### Phase 3: Implement Authentication UI

1. Create sign-in page with OAuth buttons
2. Create OAuth callback route handler
3. Implement sign-out server action
4. Create useUser hook for client components
5. Add user menu/profile display to layout

### Phase 4: Protect Routes

1. Implement auth middleware with session refresh
2. Protect existing pages (problems, dashboard)
3. Protect API routes (submission, report)
4. Add session checks to server components
5. Handle redirect after authentication

### Phase 5: Testing and Validation

1. Write and run unit tests
2. Write and run property-based tests
3. Perform integration testing
4. Test OAuth flows with real providers
5. Verify RLS policies work correctly
6. Conduct security review

## Performance Considerations

1. **Session caching**: Middleware caches session validation to reduce database queries
2. **Connection pooling**: Supabase provides connection pooling automatically
3. **Edge functions**: Consider using Supabase Edge Functions for auth-heavy operations
4. **Middleware optimization**: Minimize middleware execution time for protected routes
5. **Database indexes**: Supabase creates indexes on auth tables automatically
6. **CDN caching**: Cache public assets and pages, exclude authenticated routes

## Monitoring and Observability

1. **Authentication metrics**: Track sign-in success/failure rates in Supabase dashboard
2. **Session metrics**: Monitor active sessions and session duration
3. **Error tracking**: Log and alert on authentication errors
4. **Performance monitoring**: Track auth middleware latency
5. **Security events**: Supabase provides audit logs for suspicious authentication patterns
6. **RLS monitoring**: Monitor RLS policy performance and violations

## Supabase Configuration Checklist

### Dashboard Settings

- [ ] Enable Google OAuth provider with client ID and secret
- [ ] Enable GitHub OAuth provider with client ID and secret
- [ ] Add redirect URLs for all environments (localhost, staging, production)
- [ ] Configure session settings (timeout, refresh token lifetime)
- [ ] Enable email confirmation (optional, for future email auth)
- [ ] Set up custom email templates (optional)
- [ ] Configure rate limiting for auth endpoints
- [ ] Review security settings and enable recommended options

### Database Setup

- [ ] Verify auth schema exists with users, sessions, identities tables
- [ ] Update foreign keys in existing tables to reference auth.users
- [ ] Enable RLS on all user-specific tables
- [ ] Create RLS policies for SELECT, INSERT, UPDATE, DELETE
- [ ] Test RLS policies with different user contexts
- [ ] Create indexes on frequently queried columns
- [ ] Set up database backups

### Application Configuration

- [ ] Install @supabase/ssr and @supabase/supabase-js packages
- [ ] Create Supabase client utilities (browser, server, middleware)
- [ ] Set up environment variables
- [ ] Implement auth middleware
- [ ] Create sign-in page and OAuth callback route
- [ ] Implement sign-out functionality
- [ ] Protect routes and API endpoints
- [ ] Add user session hooks and components
