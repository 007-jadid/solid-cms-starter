import {
  type DefaultError,
  type QueryKey,
  type UndefinedInitialDataOptions,
  type UseQueryResult,
  useQuery,
} from "@tanstack/solid-query";
import { batch, createSignal } from "solid-js";
import { apiClient } from "~/features/lib/api-client";
import { type LazyTrigger, type MaybeAccessor, resolve, type UseLazyGetOptions } from "./types";

/**
 * RTK-style lazy query — does NOT fetch until `trigger()` is called.
 * Uses an `enabled` signal to control fetching declaratively. On first trigger,
 * `enabled` flips to true and TanStack auto-fetches. Subsequent calls always
 * call `refetch()` to force a fresh network request.
 *
 * Usage:
 *   const [trigger, query] = useLazyGet<User>('/api/users/1');
 *   await trigger();                   // fetch original URL
 *   await trigger('/api/users/2');     // fetch with overridden URL
 */
export function useLazyGet<TResponse = unknown, TError = DefaultError>(
  defaultUrl: string,
  options?: MaybeAccessor<UseLazyGetOptions<TResponse, TError>>,
): [trigger: LazyTrigger<TResponse, TError>, query: UseQueryResult<TResponse, TError>] {
  const [enabled, setEnabled] = createSignal(false);
  const [currentUrl, setCurrentUrl] = createSignal(defaultUrl);

  const query = useQuery((() => {
    const url = currentUrl();
    const { queryKey, ...rest } = (options ? resolve(options) : {}) as UseLazyGetOptions<
      TResponse,
      TError
    >;
    return {
      queryKey: queryKey ?? [url],
      queryFn: ({ signal }) => apiClient.get<TResponse>(url, { signal }),
      enabled: enabled(),
      ...rest,
    };
  }) as UndefinedInitialDataOptions<TResponse, TError, TResponse, QueryKey>);

  const trigger: LazyTrigger<TResponse, TError> = async (urlOverride) => {
    batch(() => {
      if (urlOverride !== undefined) {
        setCurrentUrl(urlOverride);
      }
      if (!enabled()) {
        setEnabled(true);
      }
    });

    return query.refetch();
  };

  return [trigger, query];
}
