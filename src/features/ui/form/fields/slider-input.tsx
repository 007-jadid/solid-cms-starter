import { Show } from "solid-js";
import {
  Slider,
  SliderFill,
  SliderLabel,
  SliderThumb,
  SliderTrack,
  SliderValueLabel,
} from "../../components/slider";
import type { FieldConfig } from "../types";

/**
 * SliderInput component for range selection.
 */
export function SliderInput<TValues extends object>(props: {
  field: FieldConfig<TValues>;
  value: number;
  onChange: (value: number) => void;
  error?: string;
}) {
  const sliderConfig = props.field.sliderConfig;

  return (
    <div class="space-y-1.5 rounded-md border border-input bg-background px-4 py-3">
      <Slider
        value={[props.value]}
        onChange={(values) => props.onChange(values[0])}
        minValue={sliderConfig?.min ?? 0}
        maxValue={sliderConfig?.max ?? 100}
        step={sliderConfig?.step ?? 1}
      >
        <div class="flex justify-between mb-2">
          <SliderLabel>
            {props.field.label} {props.field.required && <span class="text-destructive">*</span>}
          </SliderLabel>
          <Show when={sliderConfig?.showValue !== false}>
            <SliderValueLabel />
          </Show>
        </div>
        <SliderTrack>
          <SliderFill />
          <SliderThumb />
        </SliderTrack>
      </Slider>
      <Show when={props.field.description}>
        <p class="text-xs text-muted-foreground">{props.field.description}</p>
      </Show>
      <Show when={props.error}>
        <p class="text-xs text-destructive">{props.error}</p>
      </Show>
    </div>
  );
}
