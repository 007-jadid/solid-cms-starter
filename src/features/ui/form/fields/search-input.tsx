import { Show } from "solid-js";
import {
  TextField,
  TextFieldDescription,
  TextFieldErrorMessage,
  TextFieldInput,
  TextFieldLabel,
} from "../../components/text-field";
import type { FieldConfig } from "../types";

/**
 * SearchInput component with search icon and clear button.
 */
export function SearchInput<TValues extends object>(props: {
  field: FieldConfig<TValues>;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <TextField name={String(props.field.name)} validationState={props.error ? "invalid" : "valid"}>
      <TextFieldLabel>
        {props.field.label} {props.field.required && <span class="text-destructive">*</span>}
      </TextFieldLabel>
      <div class="relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
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
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </span>
        <TextFieldInput
          type="text"
          placeholder={props.field.placeholder || "Search..."}
          value={props.value}
          onInput={(e) => props.onChange(e.currentTarget.value)}
          onBlur={props.onBlur}
          disabled={props.disabled}
          class="pl-10 pr-10"
        />
        <Show when={props.value}>
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => props.onChange("")}
          >
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
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
          </button>
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
