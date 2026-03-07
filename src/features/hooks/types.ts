import type { QueryObserverResult } from "@tanstack/query-core";
import type {
  DefaultError,
  QueryKey,
  SolidMutationOptions,
  SolidQueryOptions,
} from "@tanstack/solid-query";
import type { Accessor } from "solid-js";

export type MaybeAccessor<T> = T | Accessor<T>;

export function resolve<T>(value: MaybeAccessor<T>): T {
  return typeof value === "function" ? (value as Accessor<T>)() : value;
}

export type UseGetOptions<TResponse = unknown, TError = DefaultError> = Omit<
  SolidQueryOptions<TResponse, TError, TResponse, QueryKey>,
  "queryFn"
>;

export type UseLazyGetOptions<TResponse = unknown, TError = DefaultError> = Omit<
  SolidQueryOptions<TResponse, TError, TResponse, QueryKey>,
  "queryFn" | "enabled"
>;

export type UseMutationHookOptions<
  TResponse = unknown,
  TError = DefaultError,
  TPayload = void,
> = Omit<SolidMutationOptions<TResponse, TError, TPayload>, "mutationFn">;

export type LazyTrigger<TResponse, TError> = (
  urlOverride?: string,
) => Promise<QueryObserverResult<TResponse, TError>>;
