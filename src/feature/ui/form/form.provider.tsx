import { splitProps, type JSX, type ParentProps } from "solid-js";
import { FormContext } from "./form.context";
import { useForm } from "./hooks";
import type { FormContext as TFormContext } from "./types";

type Props<T = unknown> = ParentProps<{
  form: TFormContext<T>;
}>;

export function FormProvider<T = unknown>(
  props: Props<Record<string, unknown>>
) {
  return (
    <FormContext.Provider value={props.form}>
      {props.children}
    </FormContext.Provider>
  );
}

FormProvider.Form = (
  props: ParentProps<Partial<JSX.FormHTMLAttributes<HTMLFormElement>>>
) => {
  const [children, restProps] = splitProps(props, ["children"]);
  const form = useForm();

  return (
    <form
      onsubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form?.handleSubmit();
      }}
      {...restProps}
    >
      {children.children}
    </form>
  );
};
