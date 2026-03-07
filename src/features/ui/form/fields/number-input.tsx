import { Show } from "solid-js";
import {
  NumberField,
  NumberFieldDecrementTrigger,
  NumberFieldErrorMessage,
  NumberFieldGroup,
  NumberFieldIncrementTrigger,
  NumberFieldInput,
  NumberFieldLabel,
} from "../../components/number-field";
import type { FieldConfig } from "../types";

/**
 * NumberInput component with increment/decrement controls.
 * Handles currency formatting with a persistent prefix so the symbol
 * doesn't disappear when the input is focused.
 */
export function NumberInput<TValues extends object>(props: {
  field: FieldConfig<TValues>;
  value: number;
  onChange: (value: number) => void;
  onBlur: () => void;
  error?: string;
  disabled?: boolean;
}) {
  const numConfig = props.field.numberConfig;
  const isCurrency = () => numConfig?.formatOptions?.style === "currency";

  const currencySymbol = () => {
    if (!isCurrency() || !numConfig?.formatOptions?.currency) return "";
    try {
      const parts = new Intl.NumberFormat("en-US", numConfig.formatOptions).formatToParts(0);
      const sym = parts.find((p) => p.type === "currency");
      return sym?.value ?? "$";
    } catch {
      return "$";
    }
  };

  return (
    <NumberField
      value={props.value}
      onChange={(value) => props.onChange(Number(value))}
      minValue={numConfig?.min}
      maxValue={numConfig?.max}
      step={numConfig?.step}
      formatOptions={isCurrency() ? undefined : numConfig?.formatOptions}
      validationState={props.error ? "invalid" : "valid"}
    >
      <NumberFieldLabel>
        {props.field.label} {props.field.required && <span class="text-destructive">*</span>}
      </NumberFieldLabel>
      <NumberFieldGroup>
        <Show when={isCurrency()}>
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none z-10">
            {currencySymbol()}
          </span>
        </Show>
        <NumberFieldInput
          placeholder={props.field.placeholder}
          onBlur={props.onBlur}
          disabled={props.disabled}
          class={isCurrency() ? "pl-8" : undefined}
        />
        <NumberFieldIncrementTrigger />
        <NumberFieldDecrementTrigger />
      </NumberFieldGroup>
      <Show when={props.field.description}>
        <p class="text-xs text-muted-foreground">{props.field.description}</p>
      </Show>
      <Show when={props.error}>
        <NumberFieldErrorMessage>{props.error}</NumberFieldErrorMessage>
      </Show>
    </NumberField>
  );
}
