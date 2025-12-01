# Implementation Plan

- [x] 1. Refactor InterviewCard component to accept problem data
  - Update the InterviewCardProps interface to accept questionNumber, title, difficulty, questionUri, and optional companies array
  - Remove old company/logo props that are no longer needed
  - Update component to display problem number badge in top-left corner
  - Add difficulty badge with color coding (Easy: green, Medium: yellow, Hard: red)
  - Make entire card clickable with onClick handler for navigation
  - Add hover effects (elevated shadow and scale transform)
  - _Requirements: 4.1, 4.3_

- [ ]* 1.1 Write property test for card rendering completeness
  - **Property 1: Card rendering completeness**
  - **Validates: Requirements 1.2**

- [ ]* 1.2 Write property test for difficulty color mapping
  - **Property 2: Difficulty color mapping consistency**
  - **Validates: Requirements 1.3**

- [x] 2. Add company icons with AnimatedTooltip to InterviewCard
  - Import AnimatedTooltip component from ui folder
  - Map companies array to AnimatedTooltip items format
  - Display company icons horizontally within the card
  - Format company names with capitalization for tooltip display
  - Use icon paths from /public/icon/ directory
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 2.2 Adjust company icon styling
  - Make company icons smaller (h-6 w-6 or h-8 w-8)
  - Add border around each icon
  - Add rounded corners to icons
  - _Requirements: 2.1_

- [ ]* 2.1 Write property test for tooltip company name formatting
  - **Property 4: Tooltip company name formatting**
  - **Validates: Requirements 2.2**

- [x] 3. Update dashboard page to use refactored InterviewCard
  - Update InterviewCard usage to pass problem-specific props (questionNumber, title, difficulty, questionUri)
  - Remove old company/logo prop passing
  - Add onClick handler using Next.js useRouter for navigation to `/problems/[question_uri]`
  - Add temporary company mapping for MVP (static mapping of problem numbers to company arrays)
  - _Requirements: 4.2, 3.1_

- [ ]* 3.1 Write property test for navigation preservation
  - **Property 3: Navigation preservation**
  - **Validates: Requirements 3.1, 3.3**

- [ ]* 3.2 Write unit tests for dashboard integration
  - Test dashboard renders with mocked fetchProblems data
  - Test clicking card triggers navigation with correct URL
  - Test loading state shows skeleton cards
  - Test empty state shows appropriate message
  - _Requirements: 1.4, 1.5_

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
