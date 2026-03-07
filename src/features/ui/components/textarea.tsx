import type { PolymorphicProps } from "@kobalte/core";
import * as TextFieldPrimitive from "@kobalte/core/text-field";
import type { ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

import { cn } from "~/features/lib/utils";

type TextareaProps<T extends ValidComponent = "textarea"> =
  TextFieldPrimitive.TextFieldTextAreaProps<T> & {
    class?: string | undefined;
    rows?: number;
  };

const Textarea = <T extends ValidComponent = "textarea">(
  props: PolymorphicProps<T, TextareaProps<T>>,
) => {
  const [local, others] = splitProps(props as TextareaProps, ["class"]);
  return (
    <TextFieldPrimitive.TextArea
      class={cn(
        "flex min-h-[80px] w-full cursor-text rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[invalid]:border-error-foreground data-[invalid]:text-error-foreground",
        local.class,
      )}
      {...others}
    />
  );
};

export { Textarea };
export type { TextareaProps };
