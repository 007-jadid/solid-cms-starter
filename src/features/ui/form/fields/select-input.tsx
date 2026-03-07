import { Show } from "solid-js";
import {
  Select,
  SelectContent,
  SelectErrorMessage,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/select";
import type { FieldConfig, FieldOption } from "../types";

/**
 * SelectInput component for dropdown selection fields.
 */
export function SelectInput<TValues extends object>(props: {
  field: FieldConfig<TValues>;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
}) {
  return (
    <Select<FieldOption>
      value={(props.field.options ?? []).find((opt) => opt.value === props.value)}
      onChange={(opt) => props.onChange(opt?.value ?? "")}
      options={props.field.options ?? []}
      optionValue="value"
      optionTextValue="label"
      placeholder={props.field.placeholder || "Select..."}
      validationState={props.error ? "invalid" : "valid"}
      itemComponent={(itemProps) => (
        <SelectItem item={itemProps.item}>
          {(itemProps.item.rawValue as FieldOption).label}
        </SelectItem>
      )}
    >
      <SelectLabel>
        {props.field.label} {props.field.required && <span class="text-destructive">*</span>}
      </SelectLabel>
      <SelectTrigger>
        <SelectValue<FieldOption>>{(state) => state.selectedOption()?.label}</SelectValue>
      </SelectTrigger>
      <SelectContent />
      <Show when={props.field.description}>
        <p class="text-xs text-muted-foreground">{props.field.description}</p>
      </Show>
      <Show when={props.error}>
        <SelectErrorMessage>{props.error}</SelectErrorMessage>
      </Show>
    </Select>
  );
}
