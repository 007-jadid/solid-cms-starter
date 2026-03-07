import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as RadioGroupPrimitive from "@kobalte/core/radio-group";
import type { JSX, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

import { cn } from "~/features/lib/utils";

type RadioGroupRootProps<T extends ValidComponent = "div"> =
  RadioGroupPrimitive.RadioGroupRootProps<T> & { class?: string | undefined };

const RadioGroup = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, RadioGroupRootProps<T>>,
) => {
  const [local, others] = splitProps(props as RadioGroupRootProps, ["class"]);
  return <RadioGroupPrimitive.Root class={cn("grid gap-2", local.class)} {...others} />;
};

type RadioGroupItemProps<T extends ValidComponent = "div"> =
  RadioGroupPrimitive.RadioGroupItemProps<T> & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const RadioGroupItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, RadioGroupItemProps<T>>,
) => {
  const [local, others] = splitProps(props as RadioGroupItemProps, ["class", "children"]);
  return (
    <RadioGroupPrimitive.Item class={cn("flex items-center space-x-2", local.class)} {...others}>
      <RadioGroupPrimitive.ItemInput />
      <RadioGroupPrimitive.ItemControl class="aspect-square size-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50">
        <RadioGroupPrimitive.ItemIndicator class="flex h-full items-center justify-center ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-2.5 fill-current text-current"
          >
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
          </svg>
        </RadioGroupPrimitive.ItemIndicator>
      </RadioGroupPrimitive.ItemControl>
      {local.children}
    </RadioGroupPrimitive.Item>
  );
};

type RadioGroupItemLabelProps<T extends ValidComponent = "label"> =
  RadioGroupPrimitive.RadioGroupLabelProps<T> & {
    class?: string | undefined;
  };

const RadioGroupItemLabel = <T extends ValidComponent = "label">(
  props: PolymorphicProps<T, RadioGroupItemLabelProps<T>>,
) => {
  const [local, others] = splitProps(props as RadioGroupItemLabelProps, ["class"]);
  return (
    <RadioGroupPrimitive.ItemLabel
      class={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        local.class,
      )}
      {...others}
    />
  );
};

type RadioGroupLabelProps<T extends ValidComponent = "label"> =
  RadioGroupPrimitive.RadioGroupLabelProps<T> & { class?: string | undefined };

const RadioGroupLabel = <T extends ValidComponent = "label">(
  props: PolymorphicProps<T, RadioGroupLabelProps<T>>,
) => {
  const [local, others] = splitProps(props as RadioGroupLabelProps, ["class"]);
  return (
    <RadioGroupPrimitive.Label
      class={cn("text-sm font-medium leading-none data-invalid:text-destructive", local.class)}
      {...others}
    />
  );
};

type RadioGroupDescriptionProps<T extends ValidComponent = "div"> =
  RadioGroupPrimitive.RadioGroupDescriptionProps<T> & { class?: string | undefined };

const RadioGroupDescription = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, RadioGroupDescriptionProps<T>>,
) => {
  const [local, others] = splitProps(props as RadioGroupDescriptionProps, ["class"]);
  return (
    <RadioGroupPrimitive.Description
      class={cn("text-sm font-normal text-muted-foreground", local.class)}
      {...others}
    />
  );
};

type RadioGroupErrorMessageProps<T extends ValidComponent = "div"> =
  RadioGroupPrimitive.RadioGroupErrorMessageProps<T> & { class?: string | undefined };

const RadioGroupErrorMessage = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, RadioGroupErrorMessageProps<T>>,
) => {
  const [local, others] = splitProps(props as RadioGroupErrorMessageProps, ["class"]);
  return (
    <RadioGroupPrimitive.ErrorMessage
      class={cn("text-xs text-destructive", local.class)}
      {...others}
    />
  );
};

export {
  RadioGroup,
  RadioGroupLabel,
  RadioGroupItem,
  RadioGroupItemLabel,
  RadioGroupDescription,
  RadioGroupErrorMessage,
};
