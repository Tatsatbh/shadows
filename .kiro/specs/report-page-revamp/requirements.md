# Requirements Document

## Introduction

This document specifies the requirements for revamping the Session Report page (`/report/[sessionId]`). The goal is to create a sleek, modern two-column layout using shadcn components where the AI Assessment section is displayed vertically on the left side, and the Interview Transcript and Submission Timeline are displayed on the right side. Additionally, the dimension scores (Problem Solving, Code Quality, Communication, Debugging) should be clickable to reveal detailed explanations in a dropdown.

## Glossary

- **Report_Page**: The Next.js page component that displays the session report at `/report/[sessionId]`
- **AI_Assessment_Panel**: The left-side panel displaying the AI evaluation including recommendation badge, summary, and dimension scores
- **Dimension_Score**: A clickable score bar showing a specific evaluation dimension (Problem Solving, Code Quality, Communication, Debugging) with score out of 5
- **Dimension_Dropdown**: An expandable section that reveals evidence and reasoning for a dimension score when clicked
- **Interview_Panel**: The right-side panel containing the Interview Transcript drawer and Submission Timeline
- **Scorecard**: The JSON object containing AI evaluation data with dimensions, scores, evidence, reasoning, and overall recommendation

## Requirements

### Requirement 1

**User Story:** As a user, I want to see the report page in a two-column layout, so that I can view the AI assessment separately from the interview content.

#### Acceptance Criteria

1. WHEN the Report_Page loads on desktop viewport THEN the Report_Page SHALL display a two-column layout with AI_Assessment_Panel on the left (approximately 40% width) and Interview_Panel on the right (approximately 60% width)
2. WHEN the Report_Page loads on mobile viewport THEN the Report_Page SHALL stack the panels vertically with AI_Assessment_Panel above Interview_Panel
3. WHEN the Report_Page renders THEN the Report_Page SHALL use shadcn Card components for visual separation of content sections

### Requirement 2

**User Story:** As a user, I want the AI Assessment panel to be visually distinct and fixed on the right side, so that I can always reference the evaluation while reviewing submissions.

#### Acceptance Criteria

1. WHEN the AI_Assessment_Panel renders THEN the AI_Assessment_Panel SHALL display the overall recommendation badge prominently at the top
2. WHEN the AI_Assessment_Panel renders THEN the AI_Assessment_Panel SHALL display the summary text below the recommendation badge
3. WHEN the AI_Assessment_Panel renders THEN the AI_Assessment_Panel SHALL display all four Dimension_Score components (Problem Solving, Code Quality, Communication, Debugging) with progress bars and numeric scores
4. WHEN the user scrolls the page on desktop THEN the AI_Assessment_Panel SHALL remain sticky within its column

### Requirement 3

**User Story:** As a user, I want to click on dimension scores to see detailed explanations, so that I can understand the reasoning behind each score.

#### Acceptance Criteria

1. WHEN a user clicks on a Dimension_Score THEN the Report_Page SHALL expand a Dimension_Dropdown showing the evidence and reasoning for that dimension
2. WHEN a Dimension_Dropdown is expanded and the user clicks the same Dimension_Score THEN the Report_Page SHALL collapse the Dimension_Dropdown
3. WHEN a Dimension_Dropdown expands THEN the Dimension_Dropdown SHALL display the evidence text with a labeled header
4. WHEN a Dimension_Dropdown expands THEN the Dimension_Dropdown SHALL display the reasoning text with a labeled header
5. WHEN the Dimension_Dropdown animates THEN the Dimension_Dropdown SHALL use smooth expand/collapse transitions via shadcn Collapsible component

### Requirement 4

**User Story:** As a user, I want the Interview Transcript and Submission Timeline on the left side, so that I can review the interview flow and code submissions together.

#### Acceptance Criteria

1. WHEN the Interview_Panel renders THEN the Interview_Panel SHALL display the Interview Transcript drawer button at the top
2. WHEN the Interview_Panel renders THEN the Interview_Panel SHALL display the Submission Timeline section below the transcript button
3. WHEN the Interview_Panel renders THEN the Interview_Panel SHALL use shadcn Card components for the transcript button and submission cards
4. WHEN the user clicks the Interview Transcript button THEN the Report_Page SHALL open a Sheet drawer from the right side displaying the full transcript

### Requirement 5

**User Story:** As a user, I want the page header to span the full width above both columns, so that I can see the session summary information clearly.

#### Acceptance Criteria

1. WHEN the Report_Page renders THEN the Report_Page SHALL display a full-width header section above the two-column layout
2. WHEN the header renders THEN the header SHALL display the "Session Report" title
3. WHEN the header renders THEN the header SHALL display the submission count and total test pass rate
