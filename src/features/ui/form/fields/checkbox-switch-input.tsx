import { Show } from "solid-js";
import { Checkbox } from "../../components/checkbox";
import { Switch, SwitchControl, SwitchLabel, SwitchThumb } from "../../components/switch";
import type { FieldConfig } from "../types";

/**
 * CheckboxInput component for boolean checkbox fields.
 */
export function CheckboxInput<TValues extends object>(props: {
  field: FieldConfig<TValues>;
  value: boolean;
  onChange: (value: boolean) => void;
  error?: string;
}) {
  return (
    <div class="flex flex-col gap-1.5 pt-6">
      <div class="flex items-center gap-2 rounded-md border border-input bg-background px-4 py-3">
        <Checkbox checked={props.value} onChange={(checked) => props.onChange(checked)} />
        <span class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {props.field.label}
        </span>
      </div>
      <Show when={props.field.description}>
        <p class="text-xs text-muted-foreground">{props.field.description}</p>
      </Show>
      <Show when={props.error}>
        <div class="text-xs text-destructive">{props.error}</div>
      </Show>
    </div>
  );
}

/**
 * SwitchInput component for boolean switch/toggle fields.
 */
export function SwitchInput<TValues extends object>(props: {
  field: FieldConfig<TValues>;
  value: boolean;
  onChange: (value: boolean) => void;
  error?: string;
}) {
  return (
    <div class="flex flex-col gap-1.5 pt-6">
      <Switch checked={props.value} onChange={(checked) => props.onChange(checked)}>
        <div class="flex items-center gap-3 rounded-md border border-input bg-background px-4 py-3">
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
          <SwitchLabel>{props.field.label}</SwitchLabel>
        </div>
      </Switch>
      <Show when={props.field.description}>
        <p class="text-xs text-muted-foreground">{props.field.description}</p>
      </Show>
      <Show when={props.error}>
        <div class="text-xs text-destructive">{props.error}</div>
      </Show>
    </div>
  );
}
