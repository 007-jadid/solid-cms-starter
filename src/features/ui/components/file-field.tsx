import * as FileFieldPrimitive from "@kobalte/core/file-field";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { cva } from "class-variance-authority";
import type { JSX, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

import { cn } from "~/features/lib/utils";

const FileField = FileFieldPrimitive.Root;

type FileFieldLabelProps<T extends ValidComponent = "label"> =
  FileFieldPrimitive.FileFieldLabelProps<T> & { class?: string | undefined };

const FileFieldLabel = <T extends ValidComponent = "label">(
  props: PolymorphicProps<T, FileFieldLabelProps<T>>,
) => {
  const [local, others] = splitProps(props as FileFieldLabelProps, ["class"]);
  return <FileFieldPrimitive.Label class={cn(labelVariants(), local.class)} {...others} />;
};

type FileFieldDropzoneProps<T extends ValidComponent = "div"> =
  FileFieldPrimitive.FileFieldDropzoneProps<T> & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const FileFieldDropzone = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, FileFieldDropzoneProps<T>>,
) => {
  const [local, others] = splitProps(props as FileFieldDropzoneProps, ["class", "children"]);
  return (
    <FileFieldPrimitive.Dropzone
      class={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input p-6 transition-colors cursor-pointer hover:border-primary/50 data-[highlighted]:border-primary data-[highlighted]:bg-primary/5 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
        local.class,
      )}
      {...others}
    >
      {local.children}
    </FileFieldPrimitive.Dropzone>
  );
};

const FileFieldHiddenInput = FileFieldPrimitive.HiddenInput;

type FileFieldTriggerProps<T extends ValidComponent = "button"> =
  FileFieldPrimitive.FileFieldTriggerProps<T> & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const FileFieldTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, FileFieldTriggerProps<T>>,
) => {
  const [local, others] = splitProps(props as FileFieldTriggerProps, ["class", "children"]);
  return (
    <FileFieldPrimitive.Trigger
      class={cn(
        "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 py-1.5 cursor-pointer",
        local.class,
      )}
      {...others}
    >
      {local.children}
    </FileFieldPrimitive.Trigger>
  );
};

type FileFieldItemListProps<T extends ValidComponent = "ul"> =
  FileFieldPrimitive.FileFieldItemListProps<T> & { class?: string | undefined };

const FileFieldItemList = <T extends ValidComponent = "ul">(
  props: PolymorphicProps<T, FileFieldItemListProps<T>>,
) => {
  const [local, others] = splitProps(props as FileFieldItemListProps, ["class"]);
  return <FileFieldPrimitive.ItemList class={cn("mt-2 space-y-2", local.class)} {...others} />;
};

type FileFieldItemProps<T extends ValidComponent = "li"> =
  FileFieldPrimitive.FileFieldItemRootProps<T> & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const FileFieldItem = <T extends ValidComponent = "li">(
  props: PolymorphicProps<T, FileFieldItemProps<T>>,
) => {
  const [local, others] = splitProps(props as FileFieldItemProps, ["class", "children"]);
  return (
    <FileFieldPrimitive.Item
      class={cn(
        "flex items-center gap-3 rounded-md border border-input px-3 py-2 text-sm",
        local.class,
      )}
      {...others}
    >
      {local.children}
    </FileFieldPrimitive.Item>
  );
};

const FileFieldItemPreview = FileFieldPrimitive.ItemPreview;
const FileFieldItemPreviewImage = FileFieldPrimitive.ItemPreviewImage;

type FileFieldItemNameProps<T extends ValidComponent = "span"> =
  FileFieldPrimitive.FileFieldItemNameProps<T> & { class?: string | undefined };

const FileFieldItemName = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, FileFieldItemNameProps<T>>,
) => {
  const [local, others] = splitProps(props as FileFieldItemNameProps, ["class"]);
  return (
    <FileFieldPrimitive.ItemName class={cn("truncate font-medium", local.class)} {...others} />
  );
};

type FileFieldItemSizeProps<T extends ValidComponent = "span"> =
  FileFieldPrimitive.FileFieldItemSizeProps<T> & { class?: string | undefined };

const FileFieldItemSize = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, FileFieldItemSizeProps<T>>,
) => {
  const [local, others] = splitProps(props as FileFieldItemSizeProps, ["class"]);
  return (
    <FileFieldPrimitive.ItemSize
      class={cn("text-xs text-muted-foreground", local.class)}
      {...others}
    />
  );
};

type FileFieldItemDeleteTriggerProps<T extends ValidComponent = "button"> =
  FileFieldPrimitive.FileFieldItemDeleteTriggerProps<T> & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const FileFieldItemDeleteTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, FileFieldItemDeleteTriggerProps<T>>,
) => {
  const [local, others] = splitProps(props as FileFieldItemDeleteTriggerProps, [
    "class",
    "children",
  ]);
  return (
    <FileFieldPrimitive.ItemDeleteTrigger
      class={cn(
        "shrink-0 rounded-sm p-1 hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer",
        local.class,
      )}
      {...others}
    >
      {local.children}
    </FileFieldPrimitive.ItemDeleteTrigger>
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

type FileFieldDescriptionProps<T extends ValidComponent = "div"> =
  FileFieldPrimitive.FileFieldDescriptionProps<T> & { class?: string | undefined };

const FileFieldDescription = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, FileFieldDescriptionProps<T>>,
) => {
  const [local, others] = splitProps(props as FileFieldDescriptionProps, ["class"]);
  return (
    <FileFieldPrimitive.Description
      class={cn(labelVariants({ variant: "description" }), local.class)}
      {...others}
    />
  );
};

type FileFieldErrorMessageProps<T extends ValidComponent = "div"> =
  FileFieldPrimitive.FileFieldErrorMessageProps<T> & { class?: string | undefined };

const FileFieldErrorMessage = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, FileFieldErrorMessageProps<T>>,
) => {
  const [local, others] = splitProps(props as FileFieldErrorMessageProps, ["class"]);
  return (
    <FileFieldPrimitive.ErrorMessage
      class={cn(labelVariants({ variant: "error" }), local.class)}
      {...others}
    />
  );
};

export {
  FileField,
  FileFieldLabel,
  FileFieldDropzone,
  FileFieldHiddenInput,
  FileFieldTrigger,
  FileFieldItemList,
  FileFieldItem,
  FileFieldItemPreview,
  FileFieldItemPreviewImage,
  FileFieldItemName,
  FileFieldItemSize,
  FileFieldItemDeleteTrigger,
  FileFieldDescription,
  FileFieldErrorMessage,
};
