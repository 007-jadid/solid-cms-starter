import { For, Show } from "solid-js";
import {
  ColorField,
  ColorFieldDescription,
  ColorFieldErrorMessage,
  ColorFieldInput,
  ColorFieldLabel,
} from "../../components/color-field";
import type { FieldConfig } from "../types";

const DEFAULT_PRESETS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#000000",
];

/**
 * ColorInput component for color picker fields.
 * Built on @kobalte/core/color-field with preset swatches.
 */
export function ColorInput<TValues extends object>(props: {
  field: FieldConfig<TValues>;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}) {
  const presets = props.field.colorConfig?.presets ?? DEFAULT_PRESETS;

  return (
    <ColorField
      value={props.value || ""}
      onChange={(value) => props.onChange(value)}
      validationState={props.error ? "invalid" : "valid"}
      disabled={props.disabled}
      class="flex flex-col gap-2"
    >
      <ColorFieldLabel>
        {props.field.label} {props.field.required && <span class="text-destructive">*</span>}
      </ColorFieldLabel>
      <Show when={props.field.description}>
        <ColorFieldDescription>{props.field.description}</ColorFieldDescription>
      </Show>
      <div class="flex items-center gap-3">
        <div
          class="size-10 shrink-0 rounded-md border border-input"
          style={{ "background-color": props.value || "#000000" }}
        />
        <ColorFieldInput placeholder="#000000" />
      </div>
      <div class="flex flex-wrap gap-1.5">
        <For each={presets}>
          {(color) => (
            <button
              type="button"
              class={`size-6 rounded-md border cursor-pointer transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                props.value === color ? "ring-2 ring-ring ring-offset-1" : "border-input"
              }`}
              style={{ "background-color": color }}
              onClick={() => !props.disabled && props.onChange(color)}
              disabled={props.disabled}
              aria-label={`Select color ${color}`}
            />
          )}
        </For>
      </div>
      <Show when={props.error}>
        <ColorFieldErrorMessage>{props.error}</ColorFieldErrorMessage>
      </Show>
    </ColorField>
  );
}
