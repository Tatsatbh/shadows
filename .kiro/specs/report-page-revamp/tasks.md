# Implementation Plan

- [x] 1. Refactor page layout to two-column structure
  - [x] 1.1 Create the two-column flex container with responsive breakpoints
    - Add flex container with `lg:flex-row` for desktop, `flex-col` for mobile
    - Left column: 40% width (`lg:w-2/5`) with sticky positioning
    - Right column: 60% width (`lg:w-3/5`)
    - _Requirements: 1.1, 1.2_
  - [x] 1.2 Move header section above the two-column layout
    - Keep full-width header with title and stats
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 2. Revamp AI Assessment panel with shadcn components
  - [x] 2.1 Wrap AI Assessment in shadcn Card component
    - Import Card, CardHeader, CardContent from shadcn
    - Add sticky positioning with `lg:sticky lg:top-6`
    - _Requirements: 1.3, 2.4_
  - [x] 2.2 Refactor DimensionScore to use shadcn Collapsible
    - Import Collapsible, CollapsibleTrigger, CollapsibleContent
    - Wrap score bar in CollapsibleTrigger
    - Wrap evidence/reasoning in CollapsibleContent
    - Add chevron icon that rotates on expand
    - _Requirements: 3.1, 3.2, 3.5_
  - [x] 2.3 Style the dimension dropdown content
    - Add "Evidence:" and "Reasoning:" labels with distinct styling
    - Use subtle background color for expanded content
    - Add smooth transition animation
    - _Requirements: 3.3, 3.4_

- [x] 3. Revamp Interview panel with shadcn components
  - [x] 3.1 Wrap Interview Transcript button in shadcn Card
    - Style as a clickable card with hover state
    - Keep existing Sheet drawer functionality
    - _Requirements: 4.1, 4.3, 4.4_
  - [x] 3.2 Wrap Submission Timeline in shadcn Card
    - Add section header inside card
    - Style submission cards with consistent spacing
    - _Requirements: 4.2, 4.3_

- [x] 4. Polish and cleanup
  - [x] 4.1 Remove unused imports and fix linting issues
    - Remove unused `X` import from lucide-react
    - Ensure consistent styling across components
    - _Requirements: 1.3_
  - [ ] 4.2 Test responsive behavior
    - Verify two-column layout on desktop
    - Verify stacked layout on mobile
    - Verify sticky behavior on scroll
    - _Requirements: 1.1, 1.2, 2.4_
