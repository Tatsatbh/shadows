# Requirements Document

## Introduction

The problems page (`src/app/problems/[name]/[sessionId]/page.tsx`) has grown to ~927 lines and handles too many responsibilities: RTC communications, session management, code execution, timer logic, and UI rendering. This refactoring effort will decompose the monolithic component into smaller, focused components and custom hooks to improve maintainability, testability, and code organization.

## Glossary

- **Problems_Page**: The main interview session page where users solve coding problems with AI assistance
- **Session**: An interview session identified by sessionId, containing user progress, code, and transcript
- **RTC_Connection**: The WebRTC realtime connection for voice communication with the AI interviewer
- **Test_Case_Panel**: UI component displaying test case inputs, expected outputs, and execution results
- **Code_Submission**: The process of sending user code to Judge0 for execution against test cases
- **Session_Validation**: The process of verifying a session exists and belongs to the current user

## Requirements

### Requirement 1

**User Story:** As a developer, I want session management logic extracted into a custom hook, so that the problems page component is focused on rendering.

#### Acceptance Criteria

1. WHEN the Problems_Page mounts THEN the Session_Hook SHALL handle session validation and creation
2. WHEN session validation fails THEN the Session_Hook SHALL redirect the user to the dashboard
3. WHEN the user attempts to leave the page THEN the Session_Hook SHALL manage the beforeunload and popstate event handlers
4. WHEN the session is abandoned THEN the Session_Hook SHALL update the session status via API

### Requirement 2

**User Story:** As a developer, I want realtime/RTC connection logic extracted into a dedicated hook, so that voice communication concerns are isolated.

#### Acceptance Criteria

1. WHEN the session is validated THEN the RTC_Hook SHALL establish the realtime connection
2. WHEN the component unmounts THEN the RTC_Hook SHALL disconnect and clean up resources
3. WHEN microphone status changes THEN the RTC_Hook SHALL mute or unmute the audio stream
4. WHEN turn detection mode changes THEN the RTC_Hook SHALL update the session configuration

### Requirement 3

**User Story:** As a developer, I want code execution logic extracted into a custom hook, so that submission handling is reusable and testable.

#### Acceptance Criteria

1. WHEN the user triggers code execution THEN the Submission_Hook SHALL submit code to the Judge0 API
2. WHEN submission results are received THEN the Submission_Hook SHALL poll for completion and update test case results
3. WHEN polling times out THEN the Submission_Hook SHALL return partial results with a timeout indicator
4. WHEN an error occurs during submission THEN the Submission_Hook SHALL return an error state

### Requirement 4

**User Story:** As a developer, I want the test cases panel extracted into a separate component, so that test result display is decoupled from the main page.

#### Acceptance Criteria

1. WHEN test case metadata is available THEN the Test_Cases_Panel SHALL render visible and hidden test cases
2. WHEN a test case fails THEN the Test_Cases_Panel SHALL allow expanding to show actual output and errors
3. WHEN test cases are running THEN the Test_Cases_Panel SHALL display a running status indicator
4. WHEN no test case metadata exists THEN the Test_Cases_Panel SHALL display raw output text

### Requirement 5

**User Story:** As a developer, I want the leave warning dialog extracted into a separate component, so that navigation warning UI is reusable.

#### Acceptance Criteria

1. WHEN showLeaveWarning is true THEN the Leave_Warning_Dialog SHALL display the warning modal
2. WHEN the user confirms leaving THEN the Leave_Warning_Dialog SHALL invoke the onConfirm callback
3. WHEN the user cancels leaving THEN the Leave_Warning_Dialog SHALL invoke the onCancel callback

### Requirement 6

**User Story:** As a developer, I want the Monaco editor section extracted into a separate component, so that editor configuration is encapsulated.

#### Acceptance Criteria

1. WHEN the Editor_Panel renders THEN the Editor_Panel SHALL display the Monaco editor with configured options
2. WHEN the user changes code THEN the Editor_Panel SHALL invoke the onChange callback with the new value
3. WHEN microphone is restricted THEN the Editor_Panel SHALL display the microphone permission alert

### Requirement 7

**User Story:** As a developer, I want the main problems page to orchestrate child components, so that the page component remains under 200 lines.

#### Acceptance Criteria

1. WHEN the Problems_Page renders THEN the Problems_Page SHALL compose Session_Hook, RTC_Hook, and Submission_Hook
2. WHEN all hooks are initialized THEN the Problems_Page SHALL render the layout with child components
3. WHEN the session is not validated THEN the Problems_Page SHALL display a loading state
