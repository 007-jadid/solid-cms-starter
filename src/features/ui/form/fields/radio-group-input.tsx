import { For, Show } from "solid-js";
import { cn } from "~/features/lib/utils";
import type { FieldConfig } from "../types";

/**
 * RadioGroupInput using native radio inputs wrapped in labels
 * for reliable click handling without Kobalte dependency.
 */
export function RadioGroupInput<TValues extends object>(props: {
  field: FieldConfig<TValues>;
  value: string | number;
  onChange: (value: string | number) => void;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <fieldset class="flex flex-col gap-2" disabled={props.disabled}>
      <legend class={cn("text-sm font-medium leading-none", props.error && "text-destructive")}>
        {props.field.label} {props.field.required && <span class="text-destructive">*</span>}
      </legend>
      <Show when={props.field.description}>
        <p class="text-sm text-muted-foreground">{props.field.description}</p>
      </Show>
      <div class="flex flex-col gap-2">
        <For each={props.field.options ?? []}>
          {(option) => {
            const isSelected = () => String(props.value) === String(option.value);
            return (
              <label
                class={cn(
                  "flex items-center gap-3 rounded-md border border-input bg-background px-4 py-3 text-sm cursor-pointer hover:bg-accent/50",
                  isSelected() && "border-primary bg-primary/5",
                  props.disabled && "opacity-50 cursor-not-allowed",
                )}
              >
                <input
                  type="radio"
                  name={String(props.field.name)}
                  value={String(option.value)}
                  checked={isSelected()}
                  onChange={() => props.onChange(option.value)}
                  class="sr-only"
                  disabled={props.disabled}
                />
                <span
                  class={cn(
                    "flex items-center justify-center aspect-square size-4 shrink-0 rounded-full border",
                    isSelected() ? "border-primary" : "border-muted-foreground/40",
                  )}
                >
                  <Show when={isSelected()}>
                    <span class="block size-2.5 rounded-full bg-primary" />
                  </Show>
                </span>
                <span class="text-sm font-medium leading-none">{option.label}</span>
              </label>
            );
          }}
        </For>
      </div>
      <Show when={props.error}>
        <p class="text-xs text-destructive">{props.error}</p>
      </Show>
    </fieldset>
  );
}
