import { type DefaultError, type UseMutationResult, useMutation } from "@tanstack/solid-query";
import { apiClient } from "~/features/lib/api-client";
import { type MaybeAccessor, resolve, type UseMutationHookOptions } from "./types";

export function usePatch<TResponse = unknown, TError = DefaultError, TPayload = void>(
  url: MaybeAccessor<string>,
  options?: MaybeAccessor<UseMutationHookOptions<TResponse, TError, TPayload>>,
): UseMutationResult<TResponse, TError, TPayload> {
  return useMutation(() => {
    const rest = options ? resolve(options) : {};
    return {
      mutationFn: (payload: TPayload) => apiClient.patch<TResponse>(resolve(url), payload),
      ...rest,
    };
  });
}
