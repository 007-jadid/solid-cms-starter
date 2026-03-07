import type { DynamicValue } from "./types";

/**
 * Resolves a dynamic value (static or function) to its final value.
 * Following SolidJS patterns - fine-grained reactivity.
 */
export function resolveDynamicValue<TValues, TResult>(
  value: DynamicValue<TValues, TResult> | undefined,
  formValues: TValues,
  defaultValue: TResult,
): TResult {
  if (value === undefined) return defaultValue;
  if (typeof value === "function") {
    return (value as (values: TValues) => TResult)(formValues);
  }
  return value as TResult;
}
