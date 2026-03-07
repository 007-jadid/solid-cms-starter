/**
 * DataTable Search Component
 * Debounced search input that syncs with URL
 */

import { createEffect, createSignal, onCleanup } from "solid-js";

import { TextField, TextFieldInput } from "../components/text-field";

import { serializers, useUrlState } from "./hooks/use-url-state";
import { DEFAULT_SEARCH_DEBOUNCE_MS } from "./utils";

interface DataTableSearchProps {
  searchKey?: string;
  placeholder?: string;
  debounceMs?: number;
}

export function DataTableSearch(props: DataTableSearchProps) {
  const [search, setSearch] = useUrlState(props.searchKey || "search", "", serializers.string);

  const [localValue, setLocalValue] = createSignal(search());

  // Sync local value when URL changes
  createEffect(() => {
    setLocalValue(search());
  });

  // Debounced sync to URL
  createEffect(() => {
    const value = localValue();
    const timer = setTimeout(() => {
      setSearch(value || "");
    }, props.debounceMs ?? DEFAULT_SEARCH_DEBOUNCE_MS);

    onCleanup(() => clearTimeout(timer));
  });

  return (
    <TextField class="w-40 lg:w-64">
      <TextFieldInput
        type="text"
        placeholder={props.placeholder ?? "Search..."}
        value={localValue()}
        onInput={(e) => setLocalValue(e.currentTarget.value)}
        class="h-8"
      />
    </TextField>
  );
}
