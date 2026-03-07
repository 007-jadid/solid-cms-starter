import { createMemo, Show } from "solid-js";
import {
  TextField,
  TextFieldDescription,
  TextFieldErrorMessage,
  TextFieldInput,
  TextFieldLabel,
} from "../../components/text-field";
import type { FieldConfig } from "../types";

function formatPhoneDisplay(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

/**
 * PhoneInput component with automatic formatting.
 */
export function PhoneInput<TValues extends object>(props: {
  field: FieldConfig<TValues>;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  disabled?: boolean;
}) {
  const displayValue = createMemo(() => formatPhoneDisplay(props.value || ""));

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
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </span>
        <TextFieldInput
          type="tel"
          placeholder={props.field.placeholder || "(555) 123-4567"}
          value={displayValue()}
          onInput={(e) => {
            const raw = e.currentTarget.value.replace(/\D/g, "").slice(0, 10);
            props.onChange(raw);
          }}
          onBlur={props.onBlur}
          disabled={props.disabled}
          class="pl-10"
        />
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
