import type {
  FormApi,
  FormAsyncValidateOrFn,
  FormValidateOrFn,
} from "@tanstack/solid-form";

export type FormContext<TValues = Record<string, unknown>> = FormApi<
  TValues,
  FormValidateOrFn<TValues> | undefined,
  FormValidateOrFn<TValues> | undefined,
  FormAsyncValidateOrFn<TValues> | undefined,
  FormValidateOrFn<TValues> | undefined,
  FormAsyncValidateOrFn<TValues> | undefined,
  FormValidateOrFn<TValues> | undefined,
  FormAsyncValidateOrFn<TValues> | undefined,
  FormAsyncValidateOrFn<TValues> | undefined,
  never
>;
