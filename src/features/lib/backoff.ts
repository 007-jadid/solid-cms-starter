/**
 * Exponential backoff with jitter.
 * Returns delay in ms for the given attempt number.
 */
export function calculateBackoff(attempt: number, baseDelay: number, maxDelay: number): number {
  const exponential = baseDelay * 2 ** attempt;
  const jitter = Math.random() * baseDelay * 0.5;
  return Math.min(exponential + jitter, maxDelay);
}
