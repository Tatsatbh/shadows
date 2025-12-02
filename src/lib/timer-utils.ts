/**
 * Timer utility functions for session countdown timer
 */

export type TimerStyle = 'neutral' | 'warning' | 'urgent';

/**
 * Calculate remaining seconds from a started_at timestamp and duration
 * @param startedAt - The timestamp when the session started
 * @param durationMinutes - The session duration in minutes (default: 30)
 * @returns Remaining seconds, minimum 0
 */
export function calculateRemainingSeconds(
  startedAt: Date,
  durationMinutes: number = 30
): number {
  const now = new Date();
  const endTime = new Date(startedAt.getTime() + durationMinutes * 60 * 1000);
  const remainingMs = endTime.getTime() - now.getTime();
  return Math.max(0, Math.floor(remainingMs / 1000));
}

/**
 * Format seconds as MM:SS string
 * @param seconds - Non-negative integer representing remaining seconds
 * @returns Formatted time string in MM:SS format
 */
export function formatTime(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get timer style based on remaining seconds
 * - neutral: more than 5 minutes remaining
 * - warning: 5 minutes or less (but more than 1 minute)
 * - urgent: 1 minute or less
 * @param remainingSeconds - Remaining time in seconds
 * @returns Timer style for visual display
 */
export function getTimerStyle(remainingSeconds: number): TimerStyle {
  if (remainingSeconds <= 60) {
    return 'urgent';
  }
  if (remainingSeconds <= 300) {
    return 'warning';
  }
  return 'neutral';
}
