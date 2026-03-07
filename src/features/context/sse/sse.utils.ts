export function parseSSEData<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return raw as unknown as T;
  }
}
