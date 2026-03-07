import * as ColorFieldPrimitive from "@kobalte/core/color-field";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { cva } from "class-variance-authority";
import type { ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

import { cn } from "~/features/lib/utils";
import { inputBase, inputInvalid, inputRing, inputSize } from "../styles/input";

const ColorField = ColorFieldPrimitive.Root;

type ColorFieldInputProps<T extends ValidComponent = "input"> =
  ColorFieldPrimitive.ColorFieldInputProps<T> & { class?: string | undefined };

const ColorFieldInput = <T extends ValidComponent = "input">(
  props: PolymorphicProps<T, ColorFieldInputProps<T>>,
) => {
  const [local, others] = splitProps(props as ColorFieldInputProps, ["class"]);
  return (
    <ColorFieldPrimitive.Input
      class={cn(inputBase, inputSize.default, inputRing, inputInvalid, "font-mono", local.class)}
      {...others}
    />
  );
};

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        label: "data-[invalid]:text-destructive",
        description: "font-normal text-muted-foreground",
        error: "text-xs text-destructive",
      },
    },
    defaultVariants: {
      variant: "label",
    },
  },
);

type ColorFieldLabelProps<T extends ValidComponent = "label"> =
  ColorFieldPrimitive.ColorFieldLabelProps<T> & { class?: string | undefined };

const ColorFieldLabel = <T extends ValidComponent = "label">(
  props: PolymorphicProps<T, ColorFieldLabelProps<T>>,
) => {
  const [local, others] = splitProps(props as ColorFieldLabelProps, ["class"]);
  return <ColorFieldPrimitive.Label class={cn(labelVariants(), local.class)} {...others} />;
};

type ColorFieldDescriptionProps<T extends ValidComponent = "div"> =
  ColorFieldPrimitive.ColorFieldDescriptionProps<T> & { class?: string | undefined };

const ColorFieldDescription = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ColorFieldDescriptionProps<T>>,
) => {
  const [local, others] = splitProps(props as ColorFieldDescriptionProps, ["class"]);
  return (
    <ColorFieldPrimitive.Description
      class={cn(labelVariants({ variant: "description" }), local.class)}
      {...others}
    />
  );
};

type ColorFieldErrorMessageProps<T extends ValidComponent = "div"> =
  ColorFieldPrimitive.ColorFieldErrorMessageProps<T> & { class?: string | undefined };

const ColorFieldErrorMessage = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ColorFieldErrorMessageProps<T>>,
) => {
  const [local, others] = splitProps(props as ColorFieldErrorMessageProps, ["class"]);
  return (
    <ColorFieldPrimitive.ErrorMessage
      class={cn(labelVariants({ variant: "error" }), local.class)}
      {...others}
    />
  );
};

export {
  ColorField,
  ColorFieldInput,
  ColorFieldLabel,
  ColorFieldDescription,
  ColorFieldErrorMessage,
};
