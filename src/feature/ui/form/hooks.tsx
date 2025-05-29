import { useContext } from "solid-js";
import { FormContext } from "./form.context";

export function useForm() {
  const context = useContext(FormContext);

  return context;
}
