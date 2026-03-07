import { Show } from "solid-js";
import {
  TextField,
  TextFieldDescription,
  TextFieldErrorMessage,
  TextFieldInput,
  TextFieldLabel,
  TextFieldTextArea,
} from "../../components/text-field";
import type { FieldConfig } from "../types";
import { DateFieldControl, DateTimeFieldControl, TimeFieldControl } from "./date-time-field-kit";

type InputType = "text" | "email" | "password" | "number";

function getInputType(type: string): InputType {
  switch (type) {
    case "password":
      return "password";
    case "number":
      return "number";
    case "email":
      return "email";
    default:
      return "text";
  }
}

export function TextInput<TValues extends object>(props: {
  field: FieldConfig<TValues>;
  value: string;
  onChange: (value: string | number) => void;
  onBlur: () => void;
  error?: string;
  disabled?: boolean;
}) {
  const isTextarea = () => props.field.type === "textarea";
  const isDate = () => props.field.type === "date";
  const isTime = () => props.field.type === "time";
  const isDateTime = () => props.field.type === "datetime";

  return (
    <TextField name={String(props.field.name)} validationState={props.error ? "invalid" : "valid"}>
      <TextFieldLabel>
        {props.field.label} {props.field.required && <span class="text-destructive">*</span>}
      </TextFieldLabel>
      <Show when={isDate()}>
        <DateFieldControl
          value={props.value}
          placeholder={props.field.placeholder}
          error={props.error}
          disabled={props.disabled}
          minDate={props.field.dateConfig?.minDate}
          maxDate={props.field.dateConfig?.maxDate}
          onChange={(value) => props.onChange(value)}
        />
      </Show>
      <Show when={isTime()}>
        <TimeFieldControl
          value={props.value}
          placeholder={props.field.placeholder}
          error={props.error}
          disabled={props.disabled}
          onChange={(value) => props.onChange(value)}
        />
      </Show>
      {/* Combined DateTime picker — calendar + time side by side */}
      <Show when={isDateTime()}>
        <DateTimeFieldControl
          value={props.value}
          placeholder={props.field.placeholder}
          error={props.error}
          disabled={props.disabled}
          minDate={props.field.dateConfig?.minDate}
          maxDate={props.field.dateConfig?.maxDate}
          onChange={(value) => props.onChange(value)}
        />
      </Show>
      <Show when={!isDate() && !isTime() && !isDateTime()}>
        <Show
          when={isTextarea()}
          fallback={
            <TextFieldInput
              type={getInputType(props.field.type)}
              placeholder={props.field.placeholder}
              value={props.value}
              onInput={(event) =>
                props.onChange(
                  props.field.type === "number"
                    ? Number(event.currentTarget.value)
                    : event.currentTarget.value,
                )
              }
              onBlur={props.onBlur}
              disabled={props.disabled}
              min={props.field.type === "number" ? props.field.numberConfig?.min : undefined}
              max={props.field.type === "number" ? props.field.numberConfig?.max : undefined}
              step={props.field.type === "number" ? props.field.numberConfig?.step : undefined}
            />
          }
        >
          <TextFieldTextArea
            placeholder={props.field.placeholder}
            value={props.value}
            onInput={(event) => props.onChange(event.currentTarget.value)}
            onBlur={props.onBlur}
            disabled={props.disabled}
            rows={props.field.rows}
          />
        </Show>
      </Show>
      <Show when={props.field.description}>
        <TextFieldDescription>{props.field.description}</TextFieldDescription>
      </Show>
      <Show when={props.error}>
        <TextFieldErrorMessage>{props.error}</TextFieldErrorMessage>
      </Show>
    </TextField>
  );
}
