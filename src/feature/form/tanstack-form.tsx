import { createForm } from "@tanstack/solid-form";
import { For } from "solid-js/web";
import { z } from "zod";
import { useForm } from "../ui/form";
import { FormProvider } from "../ui/form/form.provider";

export const TanstackForm = () => {
  const form = createForm(() => ({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
    onSubmit(props) {
      console.log({ props });
    },
    validators: {
      onSubmit: z.object({
        firstName: z.string().min(5),
        lastName: z.string().min(5),
      }),
    },
  }));

  return (
    <FormProvider form={form}>
      <FormProvider.Form>
        <form.Field
          name="firstName"
          children={(field) => {
            return (
              <div class="space-x-1">
                <label for={field().name}>FirstName</label>

                <input
                  id={field().name}
                  name={field().name}
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().handleChange(e.target.value)}
                />
                {field().state.meta.isTouched && !field().state.meta.isValid ? (
                  <For each={field().state.meta.errors}>
                    {(error) => <li>{error?.message}</li>}
                  </For>
                ) : null}
                {field().state.meta.isValidating ? "Validating..." : null}
              </div>
            );
          }}
        />
        <form.Field
          name="lastName"
          children={(field) => {
            return (
              <div class="space-x-1">
                <label for={field().name}>LatName</label>
                <input
                  id={field().name}
                  name={field().name}
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().handleChange(e.target.value)}
                />
                {field().state.meta.isTouched && !field().state.meta.isValid ? (
                  <For each={field().state.meta.errors}>
                    {(error) => <li>{error?.message}</li>}
                  </For>
                ) : null}
                {field().state.meta.isValidating ? "Validating..." : null}
              </div>
            );
          }}
        />
        <SubmitButton />
      </FormProvider.Form>
    </FormProvider>
  );
};

function SubmitButton() {
  const form = useForm();

  if (!form) return null;
  return (
    <form.Subscribe
      selector={(state) => ({
        canSubmit: state.canSubmit,
        isSubmitting: state.isSubmitting,
      })}
      children={(state) => {
        return (
          <button type="submit" disabled={!state().canSubmit}>
            {state().isSubmitting ? "..." : "Submit"}
          </button>
        );
      }}
    />
  );
}
