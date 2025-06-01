import { createForm, useField } from "@gapu/formix";
import { effect } from "solid-js/web";
import { z } from "zod";
import { TanstackForm } from "./tanstack-form";

const initialState = {
  name: "",
  email: "",
};

const schema = z.object({
  name: z.string().min(5).max(50),
  email: z.string().email(),
});

const EmailField = () => {
  const field = useField<string>("email");

  return (
    <div>
      <label>Email:</label>
      <input
        value={field.value()}
        onInput={(e) => field.setValue(e.currentTarget.value)}
        onFocus={() => field.setMeta((prev) => ({ ...prev, touched: true }))}
        disabled={field.meta().disabled}
      />

      {field.wasModified() && <span>Field was modified</span>}
      <button onClick={() => field.reset()}>Reset</button>
    </div>
  );
};
const NameFeild = () => {
  const field = useField<string>("name");

  effect(() => {
    console.log("Name -> Error ", field.errors());
  });

  return (
    <div>
      <label>Email:</label>
      <input
        value={field.value()}
        onInput={(e) => field.setValue(e.currentTarget.value)}
        onFocus={() => field.setMeta((prev) => ({ ...prev, touched: true }))}
        disabled={field.meta().disabled}
      />

      {field.wasModified() && <span>Field was modified</span>}
      <button onClick={() => field.reset()}>Reset</button>
    </div>
  );
};

export const FormComponent = () => {
  const form = createForm({
    initialState,
    schema,
    onSubmit(state) {
      console.log("Submitted");

      console.log({ state });
    },
  });

  return (
    <div>
      <TanstackForm />
    </div>
  );
};
