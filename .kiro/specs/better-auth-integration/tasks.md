# Implementation Plan

- [x] 1. Install dependencies and set up Supabase SSR
  - Install @supabase/ssr package for Next.js 15 App Router support
  - Verify @supabase/supabase-js is up to date
  - Install fast-check for property-based testing
  - _Requirements: 3.1_

- [x] 2. Create Supabase client utilities
- [x] 2.1 Create browser client utility
  - Implement createClient function in src/lib/supabase/client.ts
  - Use createBrowserClient from @supabase/ssr
  - _Requirements: 1.1, 2.1_

- [x] 2.2 Create server client utility
  - Implement createClient function in src/lib/supabase/server.ts
  - Use createServerClient with Next.js 15 cookies API
  - Handle cookie operations for server components
  - _Requirements: 2.2, 4.3_

- [x] 2.3 Create middleware client utility
  - Implement updateSession function in src/lib/supabase/middleware.ts
  - Handle session refresh in middleware
  - Return both response and user for route protection
  - _Requirements: 2.2, 4.1, 4.2_

- [ ]* 2.4 Write unit tests for client utilities
  - Test browser client initialization
  - Test server client cookie handling
  - Test middleware session refresh logic
  - _Requirements: 2.1, 2.2_

- [x] 3. Configure Supabase OAuth providers
- [x] 3.1 Document OAuth provider setup
  - Create instructions for configuring Google OAuth in Supabase dashboard
  - Create instructions for configuring GitHub OAuth in Supabase dashboard
  - Document required redirect URLs for all environments
  - _Requirements: 1.1, 1.2_

- [x] 3.2 Update environment variables
  - Add NEXT_PUBLIC_SUPABASE_URL (already exists)
  - Add NEXT_PUBLIC_SUPABASE_ANON_KEY (already exists)
  - Document optional SUPABASE_SERVICE_ROLE_KEY for admin operations
  - _Requirements: 3.1_

- [ ] 4. Implement authentication middleware
- [x] 4.1 Create auth middleware
  - Implement middleware in src/middleware.ts
  - Define protected routes array
  - Define auth routes array
  - Handle session refresh and validation
  - Redirect unauthenticated users to sign-in
  - Redirect authenticated users away from auth pages
  - _Requirements: 4.1, 4.2, 4.4_

- [ ]* 4.2 Write property test for protected route enforcement
  - **Property 9: Protected API route enforcement**
  - **Property 10: Protected page enforcement**
  - **Validates: Requirements 4.1, 4.2, 4.4**

- [ ]* 4.3 Write property test for session injection
  - **Property 11: Session injection**
  - **Validates: Requirements 4.3**

- [x] 5. Create sign-in page
- [x] 5.1 Implement sign-in page component
  - Create src/app/sign-in/page.tsx
  - Add Google OAuth button
  - Add GitHub OAuth button
  - Handle loading states
  - Use shadcn/ui components (Button, Card)
  - Extract redirect parameter from URL
  - _Requirements: 1.1, 8.1_

- [x] 5.2 Implement OAuth sign-in logic
  - Call supabase.auth.signInWithOAuth for each provider
  - Pass redirect URL to OAuth callback
  - Handle OAuth errors
  - _Requirements: 1.2, 1.4_

- [ ]* 5.3 Write property test for OAuth redirect
  - **Property 1: OAuth redirect correctness**
  - **Validates: Requirements 1.2**

- [ ]* 5.4 Write property test for OAuth error handling
  - **Property 3: OAuth error handling**
  - **Validates: Requirements 1.4**

- [x] 6. Create OAuth callback route
- [x] 6.1 Implement callback route handler
  - Create src/app/auth/callback/route.ts
  - Extract code and redirect parameters from URL
  - Exchange code for session using supabase.auth.exchangeCodeForSession
  - Handle OAuth errors and redirect to sign-in with error message
  - Redirect to original destination on success
  - _Requirements: 1.3, 1.4, 1.5, 8.5_

- [ ]* 6.2 Write property test for user creation from OAuth
  - **Property 2: User creation from OAuth**
  - **Validates: Requirements 1.3, 1.5, 3.2**

- [ ]* 6.3 Write property test for post-authentication redirect
  - **Property 16: Post-authentication redirect**
  - **Validates: Requirements 8.5**

- [ ] 7. Implement sign-out functionality
- [ ] 7.1 Create sign-out server action
  - Create src/app/actions/auth.ts
  - Implement signOut server action
  - Call supabase.auth.signOut
  - Revalidate layout path
  - Redirect to sign-in page
  - _Requirements: 2.4_

- [ ]* 7.2 Write property test for logout completeness
  - **Property 7: Logout completeness**
  - **Validates: Requirements 2.4**

- [ ] 8. Create user session hook
- [ ] 8.1 Implement useUser hook
  - Create src/hooks/useUser.ts
  - Get initial user with supabase.auth.getUser
  - Subscribe to auth state changes
  - Return user and loading state
  - _Requirements: 2.2, 6.2_

- [ ]* 8.2 Write property test for session persistence
  - **Property 5: Session persistence**
  - **Validates: Requirements 2.2, 2.5**

- [ ]* 8.3 Write property test for session token storage
  - **Property 4: Session token storage**
  - **Validates: Requirements 2.1**

- [ ] 9. Update existing pages to use authentication
- [ ] 9.1 Update problems page
  - Update src/app/problems/[name]/page.tsx
  - Get user session with server client
  - Redirect to sign-in if not authenticated
  - Use user.id for database queries
  - _Requirements: 4.2, 4.3_

- [ ] 9.2 Update home page
  - Update src/app/page.tsx
  - Add sign-in button if not authenticated
  - Show user info if authenticated
  - _Requirements: 1.1_

- [ ] 9.3 Add user menu to layout
  - Update src/app/layout.tsx or create header component
  - Display user avatar and name
  - Add sign-out button
  - _Requirements: 2.4, 5.1_

- [ ] 10. Update API routes to use authentication
- [ ] 10.1 Update submission API route
  - Update src/app/api/submission/route.ts
  - Get user session with server client
  - Return 401 if not authenticated
  - Use user.id when inserting submissions
  - _Requirements: 4.1, 4.3_

- [ ] 10.2 Update report API route
  - Update src/app/api/report/route.ts
  - Get user session with server client
  - Return 401 if not authenticated
  - Use user.id for authorization
  - _Requirements: 4.1, 4.3_

- [ ]* 10.3 Write property test for session expiration handling
  - **Property 6: Session expiration handling**
  - **Validates: Requirements 2.3**

- [ ] 11. Set up database Row Level Security
- [ ] 11.1 Update foreign key constraints
  - Create migration to update submissions.user_id foreign key
  - Reference auth.users(id) instead of public.users
  - Set ON DELETE SET NULL
  - _Requirements: 3.2_

- [ ] 11.2 Enable RLS on submissions table
  - Create migration to enable RLS on submissions table
  - Create policy for users to view own submissions
  - Create policy for users to insert own submissions
  - _Requirements: 3.5_

- [ ] 11.3 Enable RLS on questions and test_cases tables
  - Create migration to enable RLS on questions table
  - Create policy for public read access to questions
  - Create migration to enable RLS on test_cases table
  - Create policy for public read access to test_cases
  - _Requirements: 3.5_

- [ ]* 11.4 Write property test for RLS policy enforcement
  - **Property 8: RLS policy enforcement**
  - **Validates: Requirements 3.5**

- [ ] 12. Implement account settings page (optional)
- [ ] 12.1 Create account settings page
  - Create src/app/account/page.tsx
  - Display user profile information
  - Show connected OAuth providers
  - Add link/unlink provider functionality
  - _Requirements: 5.1, 5.2, 5.4_

- [ ]* 12.2 Write property test for OAuth identity linking
  - **Property 12: OAuth identity linking**
  - **Validates: Requirements 5.2**

- [ ]* 12.3 Write property test for last provider protection
  - **Property 13: Last provider protection**
  - **Validates: Requirements 5.4**

- [ ]* 12.4 Write property test for profile update persistence
  - **Property 14: Profile update persistence**
  - **Validates: Requirements 5.5**

- [ ] 13. Implement authentication logging (optional)
- [ ] 13.1 Create auth event logger
  - Create src/lib/auth-logger.ts
  - Implement functions to log sign-in, sign-out, registration, failures
  - Store logs in database or external service
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ]* 13.2 Write property test for authentication event logging
  - **Property 15: Authentication event logging**
  - **Validates: Requirements 7.1, 7.2, 7.3, 7.4**

- [ ] 14. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
