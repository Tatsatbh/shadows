export type TimerStyle = 'neutral' | 'warning' | 'urgent';

export function calculateRemainingSeconds(
  startedAt: Date,
  durationMinutes: number = 30
): number {
  const now = new Date();
  const endTime = new Date(startedAt.getTime() + durationMinutes * 60 * 1000);
  const remainingMs = endTime.getTime() - now.getTime();
  return Math.max(0, Math.floor(remainingMs / 1000));
}

export function formatTime(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getTimerStyle(remainingSeconds: number): TimerStyle {
  if (remainingSeconds <= 60) return 'urgent';
  if (remainingSeconds <= 300) return 'warning';
  return 'neutral';
}
