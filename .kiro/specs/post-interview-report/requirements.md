# Requirements Document

## Introduction

The post-interview report feature generates comprehensive evaluation reports for completed technical interview sessions. After a candidate completes a coding interview, the system analyzes the session transcript, code submissions, test results, and interaction patterns to produce a detailed scorecard. This report helps hiring teams make informed decisions without requiring engineers to conduct first-round interviews.

## Glossary

- **Session**: A complete interview interaction between a candidate and the AI interviewer, including audio transcript, code changes, and test executions
- **Transcript**: The chronological record of spoken conversation between the candidate and the AI agent during the session
- **Scorecard**: The final evaluation document containing dimension-based scores, evidence, and hiring recommendations
- **Evaluator**: The stronger OpenAI model (e.g., GPT-4) that analyzes completed sessions and generates scorecards
- **Judge0**: The code execution service that runs test cases against candidate submissions
- **Supabase**: The PostgreSQL database and storage system that persists session data, transcripts, and scorecards
- **Realtime Agent**: The lightweight conversational AI (gpt-realtime-mini) that conducts the live interview

## Requirements

### Requirement 1

**User Story:** As a hiring manager, I want to receive a comprehensive evaluation report after each interview session, so that I can make informed hiring decisions without watching the entire session.

#### Acceptance Criteria

1. WHEN a session is marked as completed THEN the system SHALL trigger the report generation process automatically
2. WHEN the report generation begins THEN the system SHALL collect all session artifacts including transcript, code timeline, test results, and metadata
3. WHEN all artifacts are collected THEN the system SHALL send them to the Evaluator for analysis
4. WHEN the Evaluator completes analysis THEN the system SHALL persist the scorecard to Supabase
5. WHEN the scorecard is persisted THEN the system SHALL make it available for retrieval via API

### Requirement 2

**User Story:** As a system, I want to bundle all relevant session data before evaluation, so that the Evaluator has complete context for accurate scoring.

#### Acceptance Criteria

1. WHEN bundling session data THEN the system SHALL include the complete chronological transcript from TranscriptContext
2. WHEN bundling session data THEN the system SHALL include the final submitted code from EditorStore
3. WHEN bundling session data THEN the system SHALL include test execution results with pass/fail status for each test case
4. WHEN bundling session data THEN the system SHALL include session metadata (question URI, duration, language used)
5. WHEN bundling session data THEN the system SHALL include the question URI to allow backend resolution of test case details

### Requirement 3

**User Story:** As an Evaluator, I want to receive structured session data, so that I can analyze candidate performance across multiple dimensions.

#### Acceptance Criteria

1. WHEN the Evaluator receives session data THEN the system SHALL format it as a structured JSON payload
2. WHEN formatting the payload THEN the system SHALL organize transcript entries chronologically with timestamps
3. WHEN formatting the payload THEN the system SHALL include code snapshots with their corresponding timestamps
4. WHEN formatting the payload THEN the system SHALL include test case results with pass/fail status
5. WHEN the payload is complete THEN the system SHALL validate it contains all required fields before sending

### Requirement 4

**User Story:** As an Evaluator, I want to generate scorecards with dimension-based scores and evidence, so that hiring teams understand the reasoning behind each evaluation.

#### Acceptance Criteria

1. WHEN analyzing a session THEN the Evaluator SHALL score the candidate across predefined dimensions (problem-solving, code quality, communication, debugging)
2. WHEN assigning scores THEN the Evaluator SHALL provide specific evidence from the transcript or code timeline
3. WHEN providing evidence THEN the Evaluator SHALL include timestamp references to relevant moments
4. WHEN scoring is complete THEN the Evaluator SHALL generate an overall recommendation (strong hire, hire, maybe, no hire)
5. WHEN the scorecard is generated THEN the Evaluator SHALL return it as structured JSON

### Requirement 5

**User Story:** As a system administrator, I want scorecards persisted to Supabase, so that they can be retrieved and displayed to hiring teams.

#### Acceptance Criteria

1. WHEN a scorecard is received from the Evaluator THEN the system SHALL store it in the Supabase scorecards table
2. WHEN storing the scorecard THEN the system SHALL link it to the corresponding session via session_id
3. WHEN storing the scorecard THEN the system SHALL preserve all dimension scores and evidence
4. WHEN the storage operation completes THEN the system SHALL return the scorecard ID
5. IF the storage operation fails THEN the system SHALL retry up to three times before logging an error

### Requirement 6

**User Story:** As a hiring manager, I want to retrieve scorecards via API, so that I can view evaluation reports in the application interface.

#### Acceptance Criteria

1. WHEN a GET request is made to the scorecards endpoint with a session_id THEN the system SHALL return the corresponding scorecard
2. WHEN returning the scorecard THEN the system SHALL include all dimension scores with evidence
3. WHEN returning the scorecard THEN the system SHALL include the overall recommendation
4. WHEN returning the scorecard THEN the system SHALL include metadata (evaluation timestamp, evaluator model version)
5. IF no scorecard exists for the session_id THEN the system SHALL return a 404 status with an appropriate message

### Requirement 7

**User Story:** As a system, I want to handle evaluation failures gracefully, so that temporary issues do not result in lost session data.

#### Acceptance Criteria

1. IF the Evaluator API call fails THEN the system SHALL log the error with session details
2. IF the Evaluator API call fails THEN the system SHALL retry with exponential backoff up to three attempts
3. IF all retry attempts fail THEN the system SHALL mark the session as "evaluation_pending" in the database
4. WHEN a session is marked "evaluation_pending" THEN the system SHALL allow manual retry via an admin endpoint
5. WHEN retrying evaluation THEN the system SHALL use the same bundled session data from the original attempt

### Requirement 8

**User Story:** As a developer, I want the evaluation process to be asynchronous, so that session completion is not blocked by report generation.

#### Acceptance Criteria

1. WHEN a session ends THEN the system SHALL immediately confirm completion to the user
2. WHEN session completion is confirmed THEN the system SHALL queue the evaluation task asynchronously
3. WHEN the evaluation task is queued THEN the system SHALL process it in the background
4. WHEN the evaluation completes THEN the system SHALL update the session status to "evaluated"
5. WHILE evaluation is in progress THEN the system SHALL allow users to view a "report generating" status

### Requirement 9

**User Story:** As a system architect, I want clear separation between session management and evaluation logic, so that the system is maintainable and testable.

#### Acceptance Criteria

1. WHEN implementing evaluation logic THEN the system SHALL encapsulate it in a dedicated service module
2. WHEN the evaluation service is invoked THEN it SHALL accept session data as input and return a scorecard
3. WHEN the evaluation service interacts with OpenAI THEN it SHALL use a configurable API client
4. WHEN the evaluation service persists data THEN it SHALL use repository pattern for database operations
5. WHEN testing the evaluation service THEN it SHALL be testable independently of session management logic

