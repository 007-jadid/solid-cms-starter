import { Show } from "solid-js";
import {
  FileField,
  FileFieldDescription,
  FileFieldDropzone,
  FileFieldErrorMessage,
  FileFieldHiddenInput,
  FileFieldItem,
  FileFieldItemDeleteTrigger,
  FileFieldItemList,
  FileFieldItemName,
  FileFieldItemSize,
  FileFieldLabel,
  FileFieldTrigger,
} from "../../components/file-field";
import type { FieldConfig } from "../types";

/**
 * FileInput component for file upload fields.
 * Built on @kobalte/core/file-field.
 */
export function FileInput<TValues extends object>(props: {
  field: FieldConfig<TValues>;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  disabled?: boolean;
}) {
  const fileConfig = props.field.fileConfig;
  const multiple = fileConfig?.multiple ?? false;
  const maxSize = fileConfig?.maxSize ?? 10 * 1024 * 1024;
  const maxFiles = fileConfig?.maxFiles ?? 5;

  return (
    <FileField
      multiple={multiple}
      maxFiles={maxFiles}
      maxFileSize={maxSize}
      accept={fileConfig?.accept}
      validationState={props.error ? "invalid" : "valid"}
      disabled={props.disabled}
      class="flex flex-col gap-2"
    >
      <FileFieldLabel>
        {props.field.label} {props.field.required && <span class="text-destructive">*</span>}
      </FileFieldLabel>
      <Show when={props.field.description}>
        <FileFieldDescription>{props.field.description}</FileFieldDescription>
      </Show>
      <FileFieldDropzone>
        <FileFieldHiddenInput />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-8 text-muted-foreground"
          aria-hidden="true"
        >
          <title>Upload</title>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
        <div class="text-center">
          <p class="text-sm text-muted-foreground">
            <span class="font-medium text-foreground">Drop files here</span> or
          </p>
          <FileFieldTrigger class="mt-2">Browse Files</FileFieldTrigger>
        </div>
      </FileFieldDropzone>
      <FileFieldItemList>
        {() => (
          <FileFieldItem>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            >
              <title>File</title>
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <div class="flex-1 min-w-0">
              <FileFieldItemName />
              <FileFieldItemSize />
            </div>
            <FileFieldItemDeleteTrigger>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-4"
              >
                <path d="M18 6l-12 12" />
                <path d="M6 6l12 12" />
              </svg>
            </FileFieldItemDeleteTrigger>
          </FileFieldItem>
        )}
      </FileFieldItemList>
      <Show when={props.error}>
        <FileFieldErrorMessage>{props.error}</FileFieldErrorMessage>
      </Show>
    </FileField>
  );
}
