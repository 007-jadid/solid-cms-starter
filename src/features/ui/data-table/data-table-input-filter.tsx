/**
 * DataTable Input Filter Component
 * Text input filter with optional validation
 */

import { createEffect, createSignal, on, onCleanup, Show } from "solid-js";
import type { GenericSchema } from "valibot";
import { safeParse as vSafeParse } from "valibot";

import { cn } from "~/features/lib/utils";

import { TextField, TextFieldInput, TextFieldLabel } from "../components/text-field";

interface DataTableInputFilterProps {
  filterKey: string;
  title?: string;
  placeholder?: string;
  inputType?: "text" | "number" | "date" | "email" | "tel";
  validation?: GenericSchema;
  value: string | null;
  onChange: (value: string | null) => void;
  debounceMs?: number;
}

export function DataTableInputFilter(props: DataTableInputFilterProps) {
  const [localValue, setLocalValue] = createSignal(props.value ?? "");
  const [error, setError] = createSignal<string | null>(null);

  // Sync from external value
  createEffect(
    on(
      () => props.value,
      (v) => setLocalValue(v ?? ""),
    ),
  );

  // Debounced validation and update
  createEffect(() => {
    const value = localValue();
    const timer = setTimeout(() => {
      // Validate if schema provided
      if (props.validation && value) {
        const result = vSafeParse(props.validation, value);
        if (!result.success) {
          setError(result.issues[0]?.message ?? "Invalid value");
          return;
        }
      }
      setError(null);
      props.onChange(value || null);
    }, props.debounceMs ?? 300);

    onCleanup(() => clearTimeout(timer));
  });

  return (
    <div class="flex flex-col gap-1">
      <TextField class="w-40">
        <Show when={props.title}>
          <TextFieldLabel class="sr-only">{props.title}</TextFieldLabel>
        </Show>
        <TextFieldInput
          type={props.inputType ?? "text"}
          placeholder={props.placeholder ?? props.title}
          value={localValue()}
          onInput={(e) => setLocalValue(e.currentTarget.value)}
          class={cn("h-8", error() && "border-destructive")}
        />
      </TextField>
      <Show when={error()}>
        <span class="text-xs text-destructive">{error()}</span>
      </Show>
    </div>
  );
}
