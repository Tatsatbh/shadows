# Shadows

AI-powered technical phone screens for software engineers. We handle first-round interviews so your engineering team can focus on building.

Currently offering mock interviews (D2C) to gather feedback on developer experience.

## Overview

Shadows conducts live technical interviews with candidates using a conversational AI agent. Candidates solve coding problems while the AI asks clarifying questions, provides hints when appropriate, and evaluates problem-solving approach in real-time.

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Code Editor**: Monaco Editor
- **Realtime Voice**: WebRTC + OpenAI Realtime API
- **Code Execution**: Judge0 API
- **Database**: Supabase (Postgres + pgvector)
- **Auth**: Supabase Auth with OAuth providers

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase project
- OpenAI API key
- Judge0 API key (RapidAPI)

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

See [docs/ENVIRONMENT_VARIABLES.md](docs/ENVIRONMENT_VARIABLES.md) for detailed configuration.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Monaco Editor │  │  Voice I/O   │  │   Session Manager    │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
      ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
      │   Realtime   │ │   Judge0     │ │   Supabase   │
      │   Agent      │ │   (Code Exec)│ │   (Storage)  │
      └──────────────┘ └──────────────┘ └──────────────┘
```

### Core Flow

1. **Start Session** → User selects a problem and begins interview
2. **Live Conversation** → Realtime agent introduces the problem and engages with candidate
3. **Code & Test** → Candidate writes code in Monaco, runs tests via Judge0
4. **End Session** → Session data bundled and sent to evaluator model
5. **Scorecard** → Detailed feedback with per-dimension scores and evidence

## Database Schema

Key tables in Supabase:

- `questions` - Interview problems with difficulty levels
- `starter_codes` - Language-specific boilerplate per question
- `test_cases` - Input/output pairs for validation
- `sessions` - Interview session state and metadata
- `submissions` - Code submissions with results

## Project Structure

```
src/
├── app/           # Next.js app router pages
├── auth/          # Authentication utilities
├── components/    # React components
├── hooks/         # Custom React hooks
├── lib/           # Utilities and API clients
├── middleware.ts  # Auth middleware
└── store.ts       # Zustand store
```

## Documentation

- [Environment Variables](docs/ENVIRONMENT_VARIABLES.md)
- [OAuth Setup](docs/OAUTH_SETUP.md)

## License

See [LICENSE](LICENSE) for details.
