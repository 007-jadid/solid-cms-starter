/**
 * Form utility functions
 * Based on SolidJS best practices - pure functions for predictable behavior
 */

/**
 * Get responsive grid columns class based on column count
 */
export const getGridColsClass = (columns: number): string => {
  const gridColsMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-5",
    6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-6",
  };
  return gridColsMap[columns] || "grid-cols-1";
};

/**
 * Get responsive column span class based on span count
 */
export const getColSpanClass = (colSpan: number): string => {
  const colSpanMap: Record<number, string> = {
    1: "col-span-1",
    2: "col-span-1 md:col-span-2",
    3: "col-span-1 md:col-span-3",
    4: "col-span-1 md:col-span-4",
    5: "col-span-1 md:col-span-5",
    6: "col-span-1 md:col-span-6",
  };
  return colSpanMap[colSpan] || "col-span-1";
};

/**
 * Get gap class based on size
 */
export const getGapClass = (gap: "sm" | "md" | "lg" | "xl" = "lg"): string => {
  const gapMap: Record<string, string> = {
    sm: "space-y-4",
    md: "space-y-6",
    lg: "space-y-8",
    xl: "space-y-10",
  };
  return gapMap[gap] || "space-y-8";
};

/**
 * Extract a user-friendly error message from various error types.
 * CRITICAL: Always surface errors to users - never swallow silently.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "An unexpected error occurred";
}

/**
 * Type for form submission handlers with proper error handling.
 * Use with toast notifications to ensure errors are always surfaced.
 *
 * @example
 * const handleSubmit = createSubmitHandler(
 *   async (data) => await api.createUser(data),
 *   {
 *     onSuccess: () => toast.success("User created!"),
 *     onError: (error) => toast.error(getErrorMessage(error)),
 *   }
 * );
 */
export interface SubmitHandlerOptions<TData, TResult = void> {
  /** Called on successful submission */
  onSuccess?: (result: TResult, data: TData) => void;
  /** Called on error - CRITICAL: Always surface to user */
  onError?: (error: Error, data: TData) => void;
  /** Called after submission completes (success or failure) */
  onSettled?: (data: TData) => void;
}

/**
 * Creates a wrapped submit handler with standardized error handling.
 * Ensures errors are never swallowed silently.
 */
export function createSubmitHandler<TData, TResult = void>(
  submitFn: (data: TData) => Promise<TResult>,
  options: SubmitHandlerOptions<TData, TResult>,
): (data: TData) => Promise<void> {
  return async (data: TData) => {
    try {
      const result = await submitFn(data);
      options.onSuccess?.(result, data);
    } catch (error) {
      if (import.meta.env.DEV) console.error("Form submission failed:", error);
      options.onError?.(error instanceof Error ? error : new Error(getErrorMessage(error)), data);
    } finally {
      options.onSettled?.(data);
    }
  };
}
