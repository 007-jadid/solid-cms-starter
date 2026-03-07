import type { ComponentProps } from "solid-js";
import { mergeProps, splitProps } from "solid-js";

import { cn } from "~/features/lib/utils";
import { inputBase, inputFile, inputRing, inputSize } from "../styles/input";

/**
 * Standalone Input component — a plain styled <input> that works anywhere
 * without requiring Kobalte's TextField context.
 *
 * For form fields with validation/error state integration, the form system
 * uses TextField + TextFieldInput from text-field.tsx instead.
 */

type InputProps = ComponentProps<"input"> & {
  class?: string | undefined;
  type?:
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week";
};

const Input = (rawProps: InputProps) => {
  const props = mergeProps({ type: "text" as const }, rawProps);
  const [local, others] = splitProps(props, ["type", "class"]);
  return (
    <input
      type={local.type}
      class={cn(
        inputBase,
        inputSize.default,
        inputRing,
        inputFile,
        "cursor-text file:cursor-pointer",
        local.class,
      )}
      {...others}
    />
  );
};

export { Input };
export type { InputProps };
