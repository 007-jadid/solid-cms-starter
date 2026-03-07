import { createSignal, For, Show } from "solid-js";
import { cn } from "~/features/lib/utils";
import {
  TextField,
  TextFieldDescription,
  TextFieldErrorMessage,
  TextFieldLabel,
} from "../../components/text-field";
import type { FieldConfig } from "../types";

/**
 * TagsInput — polished pill-style tag entry with keyboard support.
 */
export function TagsInput<TValues extends object>(props: {
  field: FieldConfig<TValues>;
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  disabled?: boolean;
}) {
  const [inputValue, setInputValue] = createSignal("");
  const [focused, setFocused] = createSignal(false);
  const tagsConfig = props.field.tagsConfig;
  const maxTags = tagsConfig?.maxTags ?? 10;
  const allowDuplicates = tagsConfig?.allowDuplicates ?? false;
  let inputRef!: HTMLInputElement;

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    const current = props.value || [];
    if (current.length >= maxTags) return;
    if (!allowDuplicates && current.includes(trimmed)) return;
    props.onChange([...current, trimmed]);
    setInputValue("");
  };

  const removeTag = (index: number) => {
    const current = [...(props.value || [])];
    current.splice(index, 1);
    props.onChange(current);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue());
    } else if (e.key === "Backspace" && !inputValue() && (props.value || []).length > 0) {
      removeTag((props.value || []).length - 1);
    }
  };

  const tags = () => props.value || [];
  const atLimit = () => tags().length >= maxTags;

  return (
    <TextField name={String(props.field.name)} validationState={props.error ? "invalid" : "valid"}>
      <TextFieldLabel>
        {props.field.label} {props.field.required && <span class="text-destructive">*</span>}
      </TextFieldLabel>
      <Show when={props.field.description}>
        <TextFieldDescription>{props.field.description}</TextFieldDescription>
      </Show>

      {/* Input area */}
      <div
        class={cn(
          "flex flex-wrap items-center gap-1.5 min-h-10 w-full rounded-md border bg-background px-3 py-1.5 text-sm cursor-text transition-colors",
          props.error
            ? "border-destructive"
            : focused()
              ? "border-input ring-1 ring-ring/40"
              : "border-input",
          props.disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <For each={tags()}>
          {(tag, index) => (
            <span class="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-bold">
              {tag}
              <button
                type="button"
                class="rounded-full size-3.5 inline-flex items-center justify-center opacity-50 hover:opacity-100 hover:bg-foreground/10 transition-all focus-visible:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(index());
                }}
                disabled={props.disabled}
                aria-label={`Remove ${tag}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="size-2.5"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </span>
          )}
        </For>
        <Show when={!atLimit()}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue()}
            onInput={(e) => setInputValue(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              if (inputValue().trim()) addTag(inputValue());
            }}
            placeholder={
              tags().length === 0 ? props.field.placeholder || "Type and press Enter..." : "Add..."
            }
            disabled={props.disabled}
            class="flex-1 min-w-16 bg-transparent outline-none placeholder:text-muted-foreground text-sm py-0.5 pl-1 rounded-md"
          />
        </Show>
      </div>

      {/* Footer hint + counter */}
      <div class="flex items-center justify-between mt-0.5">
        <span class="text-xs text-muted-foreground">Press Enter or comma to add</span>
        <span
          class={cn(
            "text-xs tabular-nums",
            atLimit() ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {tags().length}/{maxTags}
        </span>
      </div>

      <Show when={props.error}>
        <TextFieldErrorMessage>{props.error}</TextFieldErrorMessage>
      </Show>
    </TextField>
  );
}
