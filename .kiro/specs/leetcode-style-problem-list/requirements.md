# Requirements Document

## Introduction

This feature refactors the dashboard from displaying company-branded interview cards to problem-focused cards in a LeetCode-style interface. Users will be able to browse all available problems in a card grid layout and select individual problems to start practicing. The cards will display problem-specific information (number, title, difficulty) with company icons and animated tooltips, replacing the current company-branded approach.

## Glossary

- **Problem List**: A card-based grid interface displaying all available coding problems with their metadata
- **Dashboard**: The main landing page after user authentication where problems are displayed
- **Problem Card**: A UI card component displaying individual problem information (number, title, difficulty)
- **Animated Tooltip**: A UI component from shadcn/ui that displays additional information on hover
- **Company Icons**: Visual icons representing tech companies (Amazon, Google, Meta, Microsoft, Netflix) stored in /public/icon/
- **Problem Metadata**: Information about a problem including number, title, difficulty, and status

## Requirements

### Requirement 1

**User Story:** As a user, I want to see all available problems in a card grid layout, so that I can quickly browse and select problems to practice.

#### Acceptance Criteria

1. WHEN a user visits the dashboard THEN the system SHALL display all problems as cards in a responsive grid layout
2. WHEN a problem card is rendered THEN the system SHALL display the problem number, title, and difficulty
3. WHEN a problem card is rendered THEN the system SHALL display the difficulty with appropriate color coding (Easy: green, Medium: yellow, Hard: red)
4. WHEN the cards load THEN the system SHALL show loading skeletons while fetching data from Supabase
5. WHEN no problems exist THEN the system SHALL display an empty state message

### Requirement 2

**User Story:** As a user, I want to see company icons with animated tooltips on problem cards, so that I can understand which companies ask similar problems.

#### Acceptance Criteria

1. WHEN a problem card is rendered THEN the system SHALL display company icons from /public/icon/ directory
2. WHEN a user hovers over a company icon THEN the system SHALL display an animated tooltip with the company name
3. WHEN multiple company icons are present THEN the system SHALL arrange them horizontally within the card
4. WHEN the animated tooltip component is used THEN the system SHALL use the existing shadcn/ui animated-tooltip component

### Requirement 3

**User Story:** As a user, I want to click on a problem card to start practicing, so that I can begin solving the problem immediately.

#### Acceptance Criteria

1. WHEN a user clicks on a problem card THEN the system SHALL navigate to the problem page at `/problems/[question_uri]`
2. WHEN hovering over a problem card THEN the system SHALL provide visual feedback indicating the card is clickable
3. WHEN navigation occurs THEN the system SHALL preserve the problem's question_uri in the URL

### Requirement 4

**User Story:** As a developer, I want to refactor the interview card component to display problem information, so that the dashboard shows problem-focused content instead of company branding.

#### Acceptance Criteria

1. WHEN the refactoring is complete THEN the system SHALL update the InterviewCard component to accept problem data
2. WHEN the dashboard renders THEN the system SHALL pass problem data from fetchProblems query to the InterviewCard component
3. WHEN the card is rendered THEN the system SHALL display problem number, title, difficulty badge, and company icons with tooltips
