import {
  type DefaultError,
  type QueryKey,
  type UndefinedInitialDataOptions,
  type UseQueryResult,
  useQuery,
} from "@tanstack/solid-query";
import { apiClient } from "~/features/lib/api-client";
import { type MaybeAccessor, resolve, type UseGetOptions } from "./types";

/**
 * Wraps `useQuery` — auto-fetches on mount.
 * The options function is tracked reactively, so a signal-based `url` or
 * `options` will automatically re-trigger the query when they change.
 *
 * Usage:
 *   const q = useGet<User[]>('/api/users');
 *   const q = useGet<User[]>('/api/users', { staleTime: 10_000 });
 *   const q = useGet<User[]>(() => `/api/users?page=${page()}`)   // reactive URL
 */
export function useGet<TResponse = unknown, TError = DefaultError>(
  url: MaybeAccessor<string>,
  options?: MaybeAccessor<UseGetOptions<TResponse, TError>>,
): UseQueryResult<TResponse, TError> {
  return useQuery((() => {
    const resolvedUrl = resolve(url);
    const { queryKey, ...rest } = (options ? resolve(options) : {}) as UseGetOptions<
      TResponse,
      TError
    >;
    return {
      queryKey: queryKey ?? [resolvedUrl],
      queryFn: ({ signal }) => apiClient.get<TResponse>(resolvedUrl, { signal }),
      ...rest,
    };
  }) as UndefinedInitialDataOptions<TResponse, TError, TResponse, QueryKey>);
}
