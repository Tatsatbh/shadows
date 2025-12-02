# Implementation Plan

- [-] 1. Create timer utility functions
  - [x] 1.1 Create `src/lib/timer-utils.ts` with `calculateRemainingSeconds`, `formatTime`, and `getTimerStyle` functions
    - `calculateRemainingSeconds(startedAt: Date, durationMinutes: number)` returns remaining seconds
    - `formatTime(seconds: number)` returns MM:SS string
    - `getTimerStyle(remainingSeconds: number)` returns 'neutral' | 'warning' | 'urgent'
    - _Requirements: 1.1, 1.3, 1.4, 1.5, 3.3_
  - [ ] 1.2 Write property test for formatTime
    - **Property 1: Time formatting produces valid MM:SS format**
    - **Validates: Requirements 1.1**
  - [ ]* 1.3 Write property test for getTimerStyle
    - **Property 2: Timer style thresholds are correctly applied**
    - **Validates: Requirements 1.3, 1.4, 1.5**
  - [ ]* 1.4 Write property test for calculateRemainingSeconds
    - **Property 3: Remaining time calculation is correct**
    - **Validates: Requirements 3.1, 3.2, 3.3, 4.2**

- [-] 2. Create useSessionTimer hook
  - [x] 2.1 Create `src/hooks/useSessionTimer.ts` hook
    - Accept `startedAt`, `durationMinutes` (default 30), and `onTimeExpired` callback
    - Use `setInterval` to update remaining time every second
    - Call `onTimeExpired` when timer reaches zero
    - Return `remainingSeconds`, `formattedTime`, `timerStyle`, `isExpired`
    - _Requirements: 1.2, 2.1, 3.1, 3.2_
  - [ ]* 2.2 Write unit tests for useSessionTimer hook
    - Test initialization with various started_at values
    - Test that onTimeExpired is called when time reaches zero
    - _Requirements: 2.1, 3.1_

- [x] 3. Create timer UI components
  - [x] 3.1 Create `src/components/app/TimerDisplay.tsx` component
    - Display formatted time with appropriate styling based on timerStyle
    - Use Tailwind classes for neutral (default), warning (yellow/amber), urgent (red) states
    - _Requirements: 1.1, 1.3, 1.4, 1.5_
  - [x] 3.2 Create `src/components/app/TimeExpiredModal.tsx` component
    - Show modal when time expires
    - Display message that time has expired
    - Auto-trigger onAutoSubmit after 3-second countdown
    - _Requirements: 2.2, 2.3_

- [ ] 4. Integrate timer into session page
  - [x] 4.1 Update CommandBar to include TimerDisplay
    - Pass timer props from parent component
    - Position timer prominently in the command bar
    - _Requirements: 1.1_
  - [x] 4.2 Update session page to use useSessionTimer hook
    - Get `started_at` from session validation response
    - Initialize timer with started_at timestamp
    - Handle onTimeExpired callback to show modal and trigger auto-submit
    - _Requirements: 2.1, 3.1, 3.2_
  - [x] 4.3 Add TimeExpiredModal to session page
    - Show modal when isExpired is true
    - Connect auto-submit to existing handleHangUp logic
    - Disable editor when auto-submit is in progress
    - _Requirements: 2.2, 2.3, 2.4, 2.5_

- [ ] 5. Handle edge cases
  - [ ] 5.1 Handle expired sessions on page load
    - If remaining time is zero or negative on load, immediately trigger auto-submit
    - _Requirements: 3.4_
  - [ ] 5.2 Update session validation to ensure started_at is returned
    - Verify the existing GET endpoint returns started_at (already implemented)
    - _Requirements: 4.1_

- [ ] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
