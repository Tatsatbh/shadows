import type { Tables } from '@/lib/database.types'

/**
 * Domain unions.
 *
 * These columns are `text` with CHECK constraints in Postgres, so the generated
 * types widen them to `string`. Declare the narrow versions once here — they
 * were previously re-declared in four separate components, free to drift.
 */
export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type SessionStatus = 'in_progress' | 'completed' | 'abandoned'
export type Visibility = 'private' | 'public' | 'unlisted'

export const DIFFICULTIES: readonly Difficulty[] = ['Easy', 'Medium', 'Hard'] as const
export const SESSION_STATUSES: readonly SessionStatus[] = ['in_progress', 'completed', 'abandoned'] as const

/** Row aliases, so call sites stop hand-declaring partial shapes. */
export type QuestionRow = Tables<'questions'>
export type StarterCodeRow = Tables<'starter_codes'>
export type TestCaseRow = Tables<'test_cases'>
export type SessionRow = Tables<'sessions'>
export type SubmissionRow = Tables<'submissions'>
export type ProfileRow = Tables<'profiles'>

/**
 * The test-case shape shared by the results panel and the agent store. Those
 * two previously declared it separately, in different casings.
 */
export interface TestCaseMetadata {
  id: string
  input: string
  expected_output: string
  /**
   * Optional because the results panel is only ever handed visible cases, while
   * the agent store holds both and needs to know which is which.
   */
  hidden?: boolean
}

/**
 * Narrowing helpers for the CHECK-constrained text columns above.
 *
 * `questions_difficulty_check` and the sessions status/visibility checks
 * guarantee the value set at write time, so narrowing on read is sound. Only
 * visibility validates at runtime, because it drives an access-control decision
 * and defaulting to `private` is the safe direction to be wrong in.
 */
export const asDifficulty = (value: string): Difficulty => value as Difficulty

export const asSessionStatus = (value: string): SessionStatus => value as SessionStatus

export const asVisibility = (value: string | null | undefined): Visibility =>
  value === 'public' || value === 'unlisted' ? value : 'private'
