import { createMemo, lazy, Match, Show, Suspense, Switch } from "solid-js";
import type { MapLocation } from "~/features/ui/components/map";
import type { MediaFile } from "~/features/ui/components/media-picker-dialog";
import { EDITOR_BUILD_FLAGS } from "./editor-build-config";
import {
  ArrayFieldInput,
  AsyncSelect,
  CheckboxInput,
  ColorInput,
  DateRangeInput,
  FileInput,
  NumberInput,
  OTPInput,
  PhoneInput,
  RadioGroupInput,
  RatingInput,
  SearchInput,
  SelectInput,
  SliderInput,
  SwitchInput,
  TagsInput,
  TextInput,
  URLInput,
} from "./fields";
import { resolveDynamicValue } from "./form-helpers";
import type { FieldConfig, FormContextValue } from "./types";

const RichTextInput = EDITOR_BUILD_FLAGS.quill
  ? lazy(() => import("./fields/rich-text-input").then((m) => ({ default: m.RichTextInput })))
  : null;
const MediaPickerInput = lazy(() =>
  import("./fields/media-picker-input").then((m) => ({ default: m.MediaPickerInput })),
);
const MapInput = lazy(() => import("./fields/map-input").then((m) => ({ default: m.MapInput })));

/**
 * Renders the appropriate input component based on field type.
 * Uses Switch/Match so only one branch evaluates per render cycle.
 */
export function FieldRenderer<TValues extends object>(props: {
  name: keyof TValues;
  class?: string;
  fieldMap: () => Map<keyof TValues, FieldConfig<TValues>>;
  useForm: () => FormContextValue<TValues>;
}) {
  const form = props.useForm();
  const field = props.fieldMap().get(props.name);
  if (!field) return <div />;

  const showField = createMemo(() => {
    if (field.showWhen && !field.showWhen(form.values)) return false;
    if (field.hidden?.(form.values)) return false;
    return true;
  });

  const isDisabled = createMemo(() => {
    const computedDisabled = field.computed !== undefined;
    const dynamicDisabled = resolveDynamicValue(field.disabled, form.values, false);
    return computedDisabled || dynamicDisabled;
  });

  const colSpan = field.colSpan || 1;
  const style = { "grid-column": `span ${colSpan} / span ${colSpan}` };

  return (
    <Show when={showField()}>
      <div class={`space-y-1.5 ${props.class || ""}`} style={style}>
        <Switch>
          {/* Async select takes priority over type === "select" */}
          <Match when={field.asyncOptions}>
            <AsyncSelect
              field={field}
              value={form.values[field.name]}
              onChange={(value) => form.setValue(field.name, value as TValues[keyof TValues])}
            />
          </Match>

          <Match when={field.type === "select"}>
            <SelectInput
              field={field}
              value={form.values[field.name]}
              onChange={(value) => form.setValue(field.name, value as TValues[keyof TValues])}
              error={form.errors[field.name]}
            />
          </Match>

          <Match when={field.type === "number" && field.numberConfig}>
            <NumberInput
              field={field}
              value={Number(form.values[field.name]) || 0}
              onChange={(value) => form.setValue(field.name, value as TValues[keyof TValues])}
              onBlur={() => form.handleBlur(field.name)}
              error={form.errors[field.name]}
              disabled={isDisabled()}
            />
          </Match>

          <Match when={field.type === "slider"}>
            <SliderInput
              field={field}
              value={Number(form.values[field.name]) || 0}
              onChange={(value) => form.setValue(field.name, value as TValues[keyof TValues])}
              error={form.errors[field.name]}
            />
          </Match>

          <Match when={field.type === "otp"}>
            <OTPInput
              field={field}
              value={String(form.values[field.name] ?? "")}
              onChange={(value) => form.setValue(field.name, value as TValues[keyof TValues])}
              error={form.errors[field.name]}
            />
          </Match>

          <Match when={field.type === "date-range"}>
            <DateRangeInput
              field={field}
              value={(form.values[field.name] as { start?: string; end?: string }) || {}}
              onChange={(value) => form.setValue(field.name, value as TValues[keyof TValues])}
              onBlur={() => form.handleBlur(field.name)}
              error={form.errors[field.name]}
              disabled={isDisabled()}
            />
          </Match>

          <Match when={field.type === "checkbox"}>
            <CheckboxInput
              field={field}
              value={Boolean(form.values[field.name])}
              onChange={(checked) => form.setValue(field.name, checked as TValues[keyof TValues])}
              error={form.errors[field.name]}
            />
          </Match>

          <Match when={field.type === "switch"}>
            <SwitchInput
              field={field}
              value={Boolean(form.values[field.name])}
              onChange={(checked) => form.setValue(field.name, checked as TValues[keyof TValues])}
              error={form.errors[field.name]}
            />
          </Match>

          <Match when={field.type === "array"}>
            <ArrayFieldInput field={field} name={props.name} form={form} />
          </Match>

          <Match when={field.type === "radio-group"}>
            <RadioGroupInput
              field={field}
              value={form.values[field.name] as string | number}
              onChange={(value) => form.setValue(field.name, value as TValues[keyof TValues])}
              error={form.errors[field.name]}
              disabled={isDisabled()}
            />
          </Match>

          <Match when={field.type === "file"}>
            <FileInput
              field={field}
              value={
                (form.values[field.name] as {
                  name: string;
                  size: number;
                  type: string;
                }[]) || []
              }
              onChange={(value) => form.setValue(field.name, value as TValues[keyof TValues])}
              error={form.errors[field.name]}
              disabled={isDisabled()}
            />
          </Match>

          <Match when={field.type === "color"}>
            <ColorInput
              field={field}
              value={String(form.values[field.name] ?? "")}
              onChange={(value) => form.setValue(field.name, value as TValues[keyof TValues])}
              error={form.errors[field.name]}
              disabled={isDisabled()}
            />
          </Match>

          <Match when={field.type === "tags"}>
            <TagsInput
              field={field}
              value={(form.values[field.name] as string[]) || []}
              onChange={(value) => form.setValue(field.name, value as TValues[keyof TValues])}
              error={form.errors[field.name]}
              disabled={isDisabled()}
            />
          </Match>

          <Match when={field.type === "phone"}>
            <PhoneInput
              field={field}
              value={String(form.values[field.name] ?? "")}
              onChange={(value) => form.setValue(field.name, value as TValues[keyof TValues])}
              onBlur={() => form.handleBlur(field.name)}
              error={form.errors[field.name]}
              disabled={isDisabled()}
            />
          </Match>

          <Match when={field.type === "url"}>
            <URLInput
              field={field}
              value={String(form.values[field.name] ?? "")}
              onChange={(value) => form.setValue(field.name, value as TValues[keyof TValues])}
              onBlur={() => form.handleBlur(field.name)}
              error={form.errors[field.name]}
              disabled={isDisabled()}
            />
          </Match>

          <Match when={field.type === "search"}>
            <SearchInput
              field={field}
              value={String(form.values[field.name] ?? "")}
              onChange={(value) => form.setValue(field.name, value as TValues[keyof TValues])}
              onBlur={() => form.handleBlur(field.name)}
              error={form.errors[field.name]}
              disabled={isDisabled()}
            />
          </Match>

          <Match when={field.type === "rating"}>
            <RatingInput
              field={field}
              value={Number(form.values[field.name]) || 0}
              onChange={(value) => form.setValue(field.name, value as TValues[keyof TValues])}
              error={form.errors[field.name]}
              disabled={isDisabled()}
            />
          </Match>

          <Match when={field.type === "richtext" && RichTextInput}>
            {(Input) => {
              const ResolvedInput = Input();
              return (
                <Suspense fallback={<div class="h-32 animate-pulse rounded-md bg-muted" />}>
                  <ResolvedInput
                    field={field as FieldConfig<object>}
                    value={String(form.values[field.name] ?? "")}
                    onChange={(value) => form.setValue(field.name, value as TValues[keyof TValues])}
                    onBlur={() => form.handleBlur(field.name)}
                    error={form.errors[field.name]}
                    disabled={isDisabled()}
                  />
                </Suspense>
              );
            }}
          </Match>

          <Match when={field.type === "media"}>
            <Suspense fallback={<div class="h-10 animate-pulse rounded-md bg-muted" />}>
              <MediaPickerInput
                field={field as FieldConfig<object>}
                value={(form.values[field.name] as MediaFile | MediaFile[] | null) ?? null}
                onChange={(value) => form.setValue(field.name, value as TValues[keyof TValues])}
                error={form.errors[field.name]}
                disabled={isDisabled()}
              />
            </Suspense>
          </Match>

          <Match when={field.type === "map"}>
            <Suspense fallback={<div class="h-90 animate-pulse rounded-md bg-muted" />}>
              <MapInput
                field={field as FieldConfig<object>}
                value={(form.values[field.name] as MapLocation | null) ?? null}
                onChange={(value) => form.setValue(field.name, value as TValues[keyof TValues])}
                error={form.errors[field.name]}
                disabled={isDisabled()}
              />
            </Suspense>
          </Match>

          {/* Fallback: text, email, password, textarea, date, time, basic number */}
          <Match when={true}>
            <TextInput
              field={field}
              value={String(form.values[field.name] ?? "")}
              onChange={(value) => form.setValue(field.name, value as TValues[keyof TValues])}
              onBlur={() => form.handleBlur(field.name)}
              error={form.errors[field.name]}
              disabled={isDisabled()}
            />
          </Match>
        </Switch>
      </div>
    </Show>
  );
}
