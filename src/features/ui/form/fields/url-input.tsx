import { createMemo, Show } from "solid-js";
import {
  TextField,
  TextFieldDescription,
  TextFieldErrorMessage,
  TextFieldInput,
  TextFieldLabel,
} from "../../components/text-field";
import type { FieldConfig } from "../types";

/**
 * URLInput component with protocol prefix and validation indicator.
 */
export function URLInput<TValues extends object>(props: {
  field: FieldConfig<TValues>;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  disabled?: boolean;
}) {
  const isValidUrl = createMemo(() => {
    if (!props.value) return false;
    try {
      const url = props.value.startsWith("http") ? props.value : `https://${props.value}`;
      new URL(url);
      return true;
    } catch {
      return false;
    }
  });

  return (
    <TextField name={String(props.field.name)} validationState={props.error ? "invalid" : "valid"}>
      <TextFieldLabel>
        {props.field.label} {props.field.required && <span class="text-destructive">*</span>}
      </TextFieldLabel>
      <div class="relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-4"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </span>
        <TextFieldInput
          type="url"
          placeholder={props.field.placeholder || "https://example.com"}
          value={props.value}
          onInput={(e) => props.onChange(e.currentTarget.value)}
          onBlur={props.onBlur}
          disabled={props.disabled}
          class="pl-10 pr-10"
        />
        <Show when={props.value}>
          <span class="absolute right-3 top-1/2 -translate-y-1/2">
            <Show
              when={isValidUrl()}
              fallback={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="size-4 text-destructive"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" x2="9" y1="9" y2="15" />
                  <line x1="9" x2="15" y1="9" y2="15" />
                </svg>
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-4 text-green-500"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </Show>
          </span>
        </Show>
      </div>
      <Show when={props.field.description}>
        <TextFieldDescription>{props.field.description}</TextFieldDescription>
      </Show>
      <Show when={props.error}>
        <TextFieldErrorMessage>{props.error}</TextFieldErrorMessage>
      </Show>
    </TextField>
  );
}
