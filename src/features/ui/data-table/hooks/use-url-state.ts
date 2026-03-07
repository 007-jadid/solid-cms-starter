/**
 * URL State Management Hook for SolidJS
 * Syncs state with URL search parameters
 */

import { useRouter } from "@tanstack/solid-router";
import { batch, createEffect, createSignal } from "solid-js";

type Serializer<T> = {
  parse: (value: string | null) => T;
  serialize: (value: T) => string | null;
};

// Built-in serializers
export const serializers = {
  string: {
    parse: (v: string | null) => v ?? "",
    serialize: (v: string) => (v ? v : null),
  } as Serializer<string>,

  number: {
    parse: (v: string | null) => (v ? Number(v) : 0),
    serialize: (v: number) => String(v),
  } as Serializer<number>,

  integer: {
    parse: (v: string | null) => (v ? parseInt(v, 10) : 0),
    serialize: (v: number) => String(v),
  } as Serializer<number>,

  boolean: {
    parse: (v: string | null) => v === "true",
    serialize: (v: boolean) => (v ? "true" : null),
  } as Serializer<boolean>,

  arrayOfStrings: {
    parse: (v: string | null) => (v ? v.split(",").filter(Boolean) : []),
    serialize: (v: string[]) => (v.length > 0 ? v.join(",") : null),
  } as Serializer<string[]>,
};

/**
 * Hook to sync a single value with URL search params
 */
export function useUrlState<T>(
  key: string,
  defaultValue: T,
  serializer: Serializer<T>,
): [() => T, (value: T | ((prev: T) => T)) => void] {
  const router = useRouter();

  const getParams = () => {
    const searchStr = router.state.location.searchStr || "";
    return new URLSearchParams(searchStr);
  };

  const getInitialValue = (): T => {
    const param = getParams().get(key);
    return param !== null ? serializer.parse(param) : defaultValue;
  };

  const [value, setValue] = createSignal<T>(getInitialValue());

  // Sync to URL when value changes
  createEffect(() => {
    const currentValue = value();
    const serialized = serializer.serialize(currentValue);
    const params = getParams();
    const currentSerialized = params.get(key);

    if ((serialized === null && currentSerialized == null) || currentSerialized === serialized) {
      return;
    }

    if (serialized === null) {
      params.delete(key);
    } else {
      params.set(key, serialized);
    }

    const nextSearch = params.toString();
    const nextUrl = nextSearch
      ? `${router.state.location.pathname}?${nextSearch}`
      : router.state.location.pathname;

    router.history.replace(nextUrl);
  });

  // Sync local signal when URL search changes externally
  createEffect(() => {
    router.state.location.searchStr;
    const raw = getParams().get(key);
    setValue(() => (raw != null ? serializer.parse(raw) : defaultValue));
  });

  const setValueWithCallback = (newValue: T | ((prev: T) => T)) => {
    if (typeof newValue === "function") {
      setValue((prev) => (newValue as (prev: T) => T)(prev));
    } else {
      setValue(() => newValue);
    }
  };

  return [value, setValueWithCallback];
}

/**
 * Hook to sync multiple values with URL search params (batched updates)
 */
export function useUrlStates<T extends Record<string, unknown>>(
  config: { [K in keyof T]: Serializer<T[K]> },
  defaults: T,
): [() => T, (updates: Partial<T>) => void] {
  const router = useRouter();

  const getParams = () => {
    const searchStr = router.state.location.searchStr || "";
    return new URLSearchParams(searchStr);
  };

  const getInitialValues = (): T => {
    const result = { ...defaults };
    const params = getParams();

    for (const key of Object.keys(config) as Array<keyof T>) {
      const param = params.get(key as string);
      if (param !== null) {
        result[key] = config[key].parse(param);
      }
    }

    return result;
  };

  const [values, setValues] = createSignal<T>(getInitialValues());

  // Sync to URL when values change
  createEffect(() => {
    const currentValues = values();
    const params = getParams();
    let changed = false;

    for (const key of Object.keys(config) as Array<keyof T>) {
      const serialized = config[key].serialize(currentValues[key]);
      const currentSerialized = params.get(key as string);
      const same =
        (serialized === null && currentSerialized == null) || currentSerialized === serialized;
      if (!same) {
        changed = true;
        break;
      }
    }

    if (!changed) return;

    for (const key of Object.keys(config) as Array<keyof T>) {
      const serialized = config[key].serialize(currentValues[key]);
      if (serialized === null) {
        params.delete(key as string);
      } else {
        params.set(key as string, serialized);
      }
    }

    const nextSearch = params.toString();
    const nextUrl = nextSearch
      ? `${router.state.location.pathname}?${nextSearch}`
      : router.state.location.pathname;

    router.history.replace(nextUrl);
  });

  // Sync local signal when URL search changes externally
  createEffect(() => {
    router.state.location.searchStr;
    const params = getParams();
    const newValues = { ...defaults };

    for (const key of Object.keys(config) as Array<keyof T>) {
      const param = params.get(key as string);
      if (param !== null) {
        newValues[key] = config[key].parse(param);
      }
    }

    setValues(() => newValues);
  });

  const updateValues = (updates: Partial<T>) => {
    batch(() => {
      setValues((prev) => ({ ...prev, ...updates }));
    });
  };

  return [values, updateValues];
}

/**
 * Parse array of strings from URL (handles null for filters)
 */
export function useUrlArrayState(
  key: string,
  defaultValue: string[] | null = null,
): [() => string[] | null, (value: string[] | null) => void] {
  const serializer: Serializer<string[] | null> = {
    parse: (v) => (v ? v.split(",").filter(Boolean) : null),
    serialize: (v) => (v && v.length > 0 ? v.join(",") : null),
  };

  return useUrlState(key, defaultValue, serializer);
}
