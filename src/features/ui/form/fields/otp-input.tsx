import { For, Show } from "solid-js";
import {
  OTPField,
  OTPFieldGroup,
  OTPFieldInput,
  OTPFieldSlot,
  REGEXP_ONLY_DIGITS,
} from "../../components/otp-field";
import type { FieldConfig } from "../types";

/**
 * OTPInput component for one-time password entry.
 */
export function OTPInput<TValues extends object>(props: {
  field: FieldConfig<TValues>;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const otpConfig = props.field.otpConfig;
  const length = otpConfig?.length ?? 6;
  const pattern = otpConfig?.pattern ?? REGEXP_ONLY_DIGITS;

  return (
    <div class="space-y-1.5">
      <label class="text-sm font-medium leading-none">
        {props.field.label} {props.field.required && <span class="text-destructive">*</span>}
      </label>
      <OTPField value={props.value} onValueChange={props.onChange} maxLength={length}>
        <OTPFieldInput pattern={pattern} />
        <OTPFieldGroup>
          <For each={Array.from({ length }, (_, i) => i)}>
            {(index) => <OTPFieldSlot index={index} />}
          </For>
        </OTPFieldGroup>
      </OTPField>
      <Show when={props.field.description}>
        <p class="text-xs text-muted-foreground">{props.field.description}</p>
      </Show>
      <Show when={props.error}>
        <p class="text-xs text-destructive">{props.error}</p>
      </Show>
    </div>
  );
}
