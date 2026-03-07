import { For, Show } from "solid-js";
import { Button } from "../../components/button";
import { TextField, TextFieldInput, TextFieldLabel } from "../../components/text-field";
import type { FieldConfig, FormContextValue } from "../types";

/**
 * ArrayFieldInput component for dynamic list of fields.
 */
export function ArrayFieldInput<TValues extends object>(props: {
  field: FieldConfig<TValues>;
  name: keyof TValues;
  form: FormContextValue<TValues>;
}) {
  const arrayConfig = props.field.arrayConfig!;
  const items = () => (props.form.values[props.name] as unknown[]) || [];

  const addItem = () => {
    const currentItems = [...items()];
    const newItem: Record<string, unknown> = {};
    arrayConfig.itemFields.forEach((f) => {
      newItem[f.name as string] = "";
    });
    currentItems.push(newItem);
    props.form.setValue(props.name, currentItems as TValues[keyof TValues]);
  };

  const removeItem = (index: number) => {
    const currentItems = [...items()];
    currentItems.splice(index, 1);
    props.form.setValue(props.name, currentItems as TValues[keyof TValues]);
  };

  const updateItem = (index: number, fieldName: string, value: unknown) => {
    const currentItems = [...items()];
    if (currentItems[index]) {
      (currentItems[index] as Record<string, unknown>)[fieldName] = value;
      props.form.setValue(props.name, currentItems as TValues[keyof TValues]);
    }
  };

  const canAdd = () => !arrayConfig.maxItems || items().length < arrayConfig.maxItems;
  const canRemove = () => !arrayConfig.minItems || items().length > arrayConfig.minItems;

  return (
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <label class="text-sm font-medium leading-none">
          {props.field.label} {props.field.required && <span class="text-destructive">*</span>}
        </label>
        <Show when={canAdd()}>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            {arrayConfig.addLabel || "Add Item"}
          </Button>
        </Show>
      </div>

      <Show when={props.field.description}>
        <p class="text-xs text-muted-foreground">{props.field.description}</p>
      </Show>

      <div class="space-y-4">
        <For each={items()}>
          {(item, index) => (
            <div class="border rounded-lg p-4 relative">
              <Show when={canRemove()}>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  class="absolute top-2 right-2"
                  onClick={() => removeItem(index())}
                >
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
                </Button>
              </Show>
              <div class="grid gap-4">
                <For each={arrayConfig.itemFields}>
                  {(itemField) => (
                    <TextField name={`${String(props.name)}-${index()}-${itemField.name}`}>
                      <TextFieldLabel>{itemField.label}</TextFieldLabel>
                      <TextFieldInput
                        type={
                          itemField.type === "email"
                            ? "email"
                            : itemField.type === "number"
                              ? "number"
                              : "text"
                        }
                        placeholder={itemField.placeholder}
                        value={String(
                          (item as Record<string, unknown>)[itemField.name as string] ?? "",
                        )}
                        onInput={(e) =>
                          updateItem(
                            index(),
                            itemField.name as string,
                            itemField.type === "number"
                              ? Number(e.currentTarget.value)
                              : e.currentTarget.value,
                          )
                        }
                      />
                    </TextField>
                  )}
                </For>
              </div>
            </div>
          )}
        </For>
      </div>

      <Show when={items().length === 0}>
        <div class="text-center py-8 border border-dashed rounded-lg text-muted-foreground">
          No items added yet. Click "{arrayConfig.addLabel || "Add Item"}" to add one.
        </div>
      </Show>
    </div>
  );
}
