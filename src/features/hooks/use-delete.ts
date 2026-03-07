import { type DefaultError, type UseMutationResult, useMutation } from "@tanstack/solid-query";
import { apiClient } from "~/features/lib/api-client";
import { type MaybeAccessor, resolve, type UseMutationHookOptions } from "./types";

export function useDelete<TResponse = unknown, TError = DefaultError>(
  url: MaybeAccessor<string>,
  options?: MaybeAccessor<UseMutationHookOptions<TResponse, TError, void>>,
): UseMutationResult<TResponse, TError, void> {
  return useMutation(() => {
    const rest = options ? resolve(options) : {};
    return {
      mutationFn: () => apiClient.delete<TResponse>(resolve(url)),
      ...rest,
    };
  });
}
