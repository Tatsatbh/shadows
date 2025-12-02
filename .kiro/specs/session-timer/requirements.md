# Requirements Document

## Introduction

This feature implements a countdown timer system for interview sessions in RoundRobin. The timer displays remaining time during a 30-minute interview session and automatically submits the candidate's code and generates an evaluation report when time expires. This ensures consistent interview durations and prevents sessions from running indefinitely.

## Glossary

- **Session**: An active interview instance where a candidate solves a coding problem while interacting with the AI interviewer
- **Timer**: A countdown display showing remaining time in MM:SS format
- **Auto-submit**: Automatic triggering of the report generation flow when the timer reaches zero
- **Session Duration**: Fixed 30-minute time limit for each interview session
- **CommandBar**: The top navigation bar component that displays session controls (mic, hang up button)

## Requirements

### Requirement 1

**User Story:** As a candidate, I want to see how much time I have remaining in my interview session, so that I can manage my time effectively while solving the problem.

#### Acceptance Criteria

1. WHEN a session page loads and validates successfully THEN the Timer System SHALL display a countdown timer showing remaining time in MM:SS format
2. WHEN the timer is running THEN the Timer System SHALL update the display every second
3. WHEN the session has more than 5 minutes remaining THEN the Timer System SHALL display the timer in a neutral color style
4. WHEN the session has 5 minutes or less remaining THEN the Timer System SHALL display the timer in a warning color (yellow/amber)
5. WHEN the session has 1 minute or less remaining THEN the Timer System SHALL display the timer in an urgent color (red)

### Requirement 2

**User Story:** As a candidate, I want the system to automatically submit my work when time expires, so that my progress is captured even if I lose track of time.

#### Acceptance Criteria

1. WHEN the timer reaches zero THEN the Timer System SHALL trigger the auto-submit flow
2. WHEN auto-submit is triggered THEN the Timer System SHALL display a modal informing the user that time has expired
3. WHEN the time-expired modal is displayed THEN the Timer System SHALL automatically initiate report generation after a 3-second delay
4. WHEN auto-submit is in progress THEN the Timer System SHALL prevent the user from making further code changes
5. WHEN report generation completes THEN the Timer System SHALL redirect the user to the report page

### Requirement 3

**User Story:** As a candidate, I want the timer to persist across page refreshes, so that I cannot gain extra time by reloading the page.

#### Acceptance Criteria

1. WHEN a session is created THEN the Timer System SHALL use the server-stored started_at timestamp as the timer reference
2. WHEN a user refreshes the page during an active session THEN the Timer System SHALL calculate remaining time from the original started_at timestamp
3. WHEN remaining time is calculated THEN the Timer System SHALL account for the fixed 30-minute session duration
4. IF the calculated remaining time is zero or negative THEN the Timer System SHALL immediately trigger the auto-submit flow

### Requirement 4

**User Story:** As a system administrator, I want session timing to be tracked server-side, so that timing data is reliable and tamper-resistant.

#### Acceptance Criteria

1. WHEN a session is validated via the API THEN the Timer System SHALL return the started_at timestamp in the response
2. WHEN the client calculates remaining time THEN the Timer System SHALL derive the deadline from started_at plus 30 minutes
3. WHEN a session ends (manually or via auto-submit) THEN the Timer System SHALL record the ended_at timestamp via the existing PATCH endpoint
