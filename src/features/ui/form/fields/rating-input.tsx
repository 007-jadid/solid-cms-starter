import { createSignal, For, Show } from "solid-js";
import {
  TextField,
  TextFieldDescription,
  TextFieldErrorMessage,
  TextFieldLabel,
} from "../../components/text-field";
import type { FieldConfig } from "../types";

/**
 * RatingInput component for star rating selection.
 * Uses plain buttons for reliable click handling instead of ToggleGroup.
 */
export function RatingInput<TValues extends object>(props: {
  field: FieldConfig<TValues>;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  disabled?: boolean;
}) {
  const [hovered, setHovered] = createSignal(0);
  const max = props.field.ratingConfig?.max ?? 5;

  const stars = () => Array.from({ length: max }, (_, i) => i + 1);

  const isFilled = (star: number) => {
    const hoveredVal = hovered();
    if (hoveredVal > 0) return star <= hoveredVal;
    return star <= (props.value || 0);
  };

  const handleClick = (star: number) => {
    if (props.disabled) return;
    props.onChange(props.value === star ? 0 : star);
  };

  return (
    <TextField name={String(props.field.name)} validationState={props.error ? "invalid" : "valid"}>
      <TextFieldLabel>
        {props.field.label} {props.field.required && <span class="text-destructive">*</span>}
      </TextFieldLabel>
      <Show when={props.field.description}>
        <TextFieldDescription>{props.field.description}</TextFieldDescription>
      </Show>
      <div
        class="flex items-center gap-0.5 rounded-md border border-input bg-background px-3 py-2 w-fit"
        onMouseLeave={() => setHovered(0)}
      >
        <For each={stars()}>
          {(star) => (
            <button
              type="button"
              class="inline-flex items-center justify-center p-0.5 rounded-sm hover:scale-110 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50"
              disabled={props.disabled}
              onMouseEnter={() => setHovered(star)}
              onClick={() => handleClick(star)}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={isFilled(star) ? "currentColor" : "none"}
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class={`size-6 ${isFilled(star) ? "text-amber-400" : "text-muted-foreground/40"}`}
                aria-hidden="true"
              >
                <title>{`${star} star${star > 1 ? "s" : ""}`}</title>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          )}
        </For>
        <Show when={props.value > 0}>
          <span class="ml-2 text-sm text-muted-foreground">
            {props.value}/{max}
          </span>
        </Show>
      </div>
      <Show when={props.error}>
        <TextFieldErrorMessage>{props.error}</TextFieldErrorMessage>
      </Show>
    </TextField>
  );
}
