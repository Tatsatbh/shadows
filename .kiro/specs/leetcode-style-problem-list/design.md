# Design Document

## Overview

This design refactors the dashboard to display problem-focused cards instead of company-branded interview cards. The InterviewCard component will be updated to accept problem data and display problem number, title, difficulty badge, and company icons with animated tooltips. The dashboard will continue using the existing fetchProblems query from React Query, maintaining the current data fetching architecture.

## Architecture

### Component Hierarchy

```
Dashboard Page (src/app/dashboard/page.tsx)
├── SidebarProvider
│   ├── AppSidebar
│   └── SidebarInset
│       ├── Header (Breadcrumb navigation)
│       └── Problem Grid
│           └── InterviewCard (refactored)
│               ├── Problem Number Badge
│               ├── Problem Title
│               ├── Difficulty Badge
│               └── Company Icons with AnimatedTooltip
```

### Data Flow

1. Dashboard page mounts and triggers React Query's `useQuery` with `fetchProblems`
2. `fetchProblems` queries Supabase `questions` table for all problems
3. Query returns array of problem objects with: id, question_number, title, difficulty, summary, question_uri
4. Dashboard maps over problems array and renders InterviewCard for each problem
5. User clicks card → navigate to `/problems/[question_uri]`

## Components and Interfaces

### Updated InterviewCard Component

**Location:** `src/components/interview-card.tsx`

**Props Interface:**
```typescript
interface InterviewCardProps {
  questionNumber: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  questionUri: string
  companies?: string[] // Array of company names: ['amazon', 'google', 'meta', 'microsoft', 'netflix']
}
```

**Behavior:**
- Display problem number as a badge in top-left corner
- Display title as main heading
- Display difficulty badge with color coding:
  - Easy: green (bg-green-500/10 text-green-500)
  - Medium: yellow (bg-yellow-500/10 text-yellow-500)
  - Hard: red (bg-red-500/10 text-red-500)
- Display company icons horizontally with AnimatedTooltip
- Entire card is clickable and navigates to `/problems/[questionUri]`
- Hover state shows elevated shadow and slight scale transform

### AnimatedTooltip Integration

**Location:** `src/components/ui/animated-tooltip.tsx` (existing)

**Usage:**
```typescript
<AnimatedTooltip
  items={companies.map(company => ({
    id: company,
    name: company.charAt(0).toUpperCase() + company.slice(1),
    designation: '', // Empty for this use case
    image: `/icon/${company}.png`
  }))}
/>
```

**Styling Requirements:**
- Company icon images should be smaller than default (e.g., h-8 w-8 or h-6 w-6)
- Each icon should have a small border (e.g., border border-border)
- Icons should have rounded corners to match card aesthetic

### Dashboard Page Updates

**Location:** `src/app/dashboard/page.tsx`

**Changes:**
- Update InterviewCard usage to pass problem-specific props
- Remove company/logo props
- Add onClick handler for navigation using Next.js router
- Map problem data to new InterviewCard interface

## Data Models

### Problem Type (from queries.ts)

```typescript
type Problem = {
  id: string
  question_number: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  summary: string | null
  question_uri: string
}
```

### Company Icon Mapping

For MVP, we'll use a static mapping of problems to companies. This can be extended later to store company associations in the database.

```typescript
const COMPANY_MAPPING: Record<number, string[]> = {
  1: ['amazon', 'google'],
  2: ['meta', 'microsoft'],
  // ... etc
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Card rendering completeness
*For any* problem object returned from fetchProblems, when rendered as an InterviewCard, the card should display all required fields: question_number, title, and difficulty
**Validates: Requirements 1.2**

### Property 2: Difficulty color mapping consistency
*For any* difficulty value ('Easy', 'Medium', 'Hard'), the rendered badge should use the correct color class corresponding to that difficulty level
**Validates: Requirements 1.3**

### Property 3: Navigation preservation
*For any* problem card click event, the resulting navigation URL should contain the exact question_uri from the problem object
**Validates: Requirements 3.1, 3.3**

### Property 4: Tooltip company name formatting
*For any* company name in the companies array, the AnimatedTooltip should display the capitalized version of that company name
**Validates: Requirements 2.2**

## Error Handling

### Data Fetching Errors
- Display error message when fetchProblems fails
- Show retry button to re-trigger query
- Log error to console for debugging

### Empty State
- When no problems exist, display empty state message: "No problems available yet"
- Show illustration or icon for better UX

### Loading State
- Display skeleton cards (3 cards) while data is loading
- Use shadcn/ui Skeleton component for consistent loading UI

### Navigation Errors
- If question_uri is invalid, Next.js will handle 404
- No additional error handling needed in card component

## Testing Strategy

### Unit Tests
- Test InterviewCard renders with all required props
- Test difficulty badge color mapping for each difficulty level
- Test navigation onClick handler calls router.push with correct URL
- Test AnimatedTooltip receives correctly formatted company data
- Test empty state rendering when problems array is empty
- Test loading state rendering when isLoading is true

### Property-Based Tests
We will use `fast-check` for property-based testing in this TypeScript/React project. Each property-based test should run a minimum of 100 iterations.

**Test 1: Card rendering completeness**
- Generate random problem objects with valid fields
- Render InterviewCard with generated problem
- Assert all fields are present in rendered output
- **Feature: leetcode-style-problem-list, Property 1: Card rendering completeness**

**Test 2: Difficulty color mapping consistency**
- Generate random difficulty values from ['Easy', 'Medium', 'Hard']
- Render InterviewCard with generated difficulty
- Assert correct color class is applied
- **Feature: leetcode-style-problem-list, Property 2: Difficulty color mapping consistency**

**Test 3: Navigation preservation**
- Generate random question_uri strings
- Simulate card click
- Assert router.push called with correct URL containing question_uri
- **Feature: leetcode-style-problem-list, Property 3: Navigation preservation**

**Test 4: Tooltip company name formatting**
- Generate random company names from valid set
- Render AnimatedTooltip with generated companies
- Assert tooltip displays capitalized company names
- **Feature: leetcode-style-problem-list, Property 4: Tooltip company name formatting**

### Integration Tests
- Test full dashboard page renders with mocked fetchProblems data
- Test clicking card navigates to correct problem page
- Test React Query integration with Supabase client

## Implementation Notes

### Styling Approach
- Use Tailwind CSS classes for all styling
- Maintain consistency with existing shadcn/ui components
- Use card component from shadcn/ui as base
- Ensure responsive grid layout (1 column mobile, 2 columns tablet, 3 columns desktop)
- Company icons should be small (h-6 w-6 or h-8 w-8) with border and rounded corners

### Performance Considerations
- React Query handles caching automatically
- No additional optimization needed for initial MVP
- Consider virtualization if problem list grows beyond 100 items

### Accessibility
- Ensure card has proper ARIA labels
- Keyboard navigation support (Enter key to navigate)
- Sufficient color contrast for difficulty badges
- Alt text for company icons

### Future Enhancements
- Add company associations to database schema
- Add submission status indicators (solved/attempted)
- Add acceptance rate display
- Add tags/topics for problems
- Add sorting and filtering controls
