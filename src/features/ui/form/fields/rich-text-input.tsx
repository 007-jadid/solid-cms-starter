import { Show } from "solid-js";
import { RichTextEditor } from "~/features/ui/components/rich-text-editor";
import type { FieldConfig } from "../types";

export function RichTextInput<TValues extends object>(props: {
  field: FieldConfig<TValues>;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <div class="space-y-1.5">
      <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {props.field.label}
        <Show when={props.field.required}>
          <span class="ml-1 text-destructive">*</span>
        </Show>
      </label>

      <Show when={props.field.description}>
        <p class="text-[0.8rem] text-muted-foreground">{props.field.description}</p>
      </Show>

      <RichTextEditor
        value={props.value}
        onChange={props.onChange}
        placeholder={props.field.placeholder}
        disabled={props.disabled}
        maxLength={props.field.richtextConfig?.maxLength}
        minHeight={props.field.richtextConfig?.minHeight}
        class={props.error ? "border-destructive" : undefined}
      />

      <Show when={props.error}>
        <p class="text-[0.8rem] text-destructive">{props.error}</p>
      </Show>
    </div>
  );
}
