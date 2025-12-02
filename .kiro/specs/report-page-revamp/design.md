# Design Document: Report Page Revamp

## Overview

This design describes the revamp of the Session Report page to create a modern, two-column layout using shadcn components. The AI Assessment panel will be positioned on the left side with sticky behavior, while the Interview Transcript and Submission Timeline will be on the right side. Dimension scores will be interactive with collapsible dropdowns showing detailed evidence and reasoning.

## Architecture

The report page will be restructured as a single React component with the following layout hierarchy:

```
ReportPage
├── Header (full-width)
│   ├── Title
│   └── Stats (submissions, test pass rate)
├── TwoColumnLayout (flex container)
│   ├── LeftColumn (40%, sticky)
│   │   └── AIAssessmentCard
│   │       ├── RecommendationBadge
│   │       ├── Summary
│   │       └── DimensionScores (4x Collapsible)
│   │           ├── ScoreBar (trigger)
│   │           └── DetailDropdown (content)
│   └── RightColumn (60%)
│       ├── TranscriptCard (Sheet trigger)
│       └── SubmissionTimeline
│           └── SubmissionCards (expandable)
└── TranscriptSheet (overlay)
```

### Responsive Behavior

- **Desktop (lg+)**: Two-column side-by-side layout with sticky left panel
- **Mobile/Tablet**: Single column with AI Assessment stacked above Interview content

## Components and Interfaces

### AIAssessmentCard

A shadcn Card component containing the AI evaluation.

```typescript
interface AIAssessmentCardProps {
  scorecard: Scorecard
}
```

### DimensionScore

A clickable score bar using shadcn Collapsible for expand/collapse behavior.

```typescript
interface DimensionScoreProps {
  label: string
  score: number
  evidence: string
  reasoning: string
}
```

### TranscriptCard

A shadcn Card that triggers the Sheet drawer for viewing the full transcript.

```typescript
interface TranscriptCardProps {
  transcript: string
  messageCount: number
}
```

### SubmissionCard

An expandable card showing submission details, diff view, and test results.

```typescript
interface SubmissionCardProps {
  submission: Submission
  index: number
  prevCode: string | null
  aiComment?: string
}
```

## Data Models

The existing data models remain unchanged:

```typescript
interface Scorecard {
  dimensions: {
    problemSolving: DimensionData
    codeQuality: DimensionData
    communication: DimensionData
    debugging: DimensionData
  }
  overallRecommendation: string
  summary: string
  submissionComments?: { submissionNumber: number; comment: string }[]
}

interface DimensionData {
  score: number
  evidence: string
  reasoning: string
}

interface Submission {
  id: string
  code: string
  language: string
  created_at: string
  timestamp: number | null
  result_json: {
    submissions: Array<{
      status: { id: number; description: string }
      stdout: string | null
      stderr: string | null
    }>
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the prework analysis, most acceptance criteria are UI layout/styling concerns or example-based tests rather than universal properties. The testable items are primarily example-based verification of rendering behavior.

**Property Reflection:**
After reviewing the testable criteria, most are example-based tests that verify specific rendering outcomes. These are better suited for component unit tests rather than property-based tests. The criteria test:
- Rendering of specific text/elements (recommendation, summary, dimensions, title, stats)
- Click interactions (expand/collapse, drawer open)

These are discrete UI behaviors that don't have universal "for all" properties - they verify specific expected outputs for specific inputs.

**Conclusion:** This feature is primarily UI/layout focused with no strong candidates for property-based testing. The acceptance criteria are best validated through:
1. Visual inspection during development
2. Component unit tests for rendering behavior
3. Integration tests for click interactions

No correctness properties are defined for this feature as the requirements are UI-centric and example-based.

## Error Handling

- **Missing scorecard**: Display a placeholder message "No AI assessment available" in the AI Assessment panel
- **Missing transcript**: Show "No transcript available" in the transcript drawer
- **Empty submissions**: Display "No submissions found for this session" message
- **Loading state**: Show skeleton loaders for both panels while data fetches
- **Error state**: Display error message with option to retry

## Testing Strategy

### Unit Testing

Since this is a UI-focused feature, testing will focus on component rendering:

1. **AIAssessmentCard tests**:
   - Renders recommendation badge with correct text
   - Renders summary text
   - Renders all four dimension scores with correct labels and values

2. **DimensionScore tests**:
   - Renders score bar with correct percentage width
   - Expands on click to show evidence and reasoning
   - Collapses on second click
   - Displays evidence with "Evidence:" label
   - Displays reasoning with "Reasoning:" label

3. **TranscriptCard tests**:
   - Renders message count
   - Opens Sheet drawer on click

4. **Header tests**:
   - Renders "Session Report" title
   - Renders submission count and test pass rate

### Integration Testing

- Full page render with mock data
- Responsive layout verification at different breakpoints
- Sticky behavior verification on scroll

### Testing Framework

- Jest + React Testing Library for component tests
- Existing test setup in the project will be used
