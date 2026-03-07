import {
  batch,
  createEffect,
  createMemo,
  createSignal,
  For,
  Match,
  on,
  Show,
  Switch,
  startTransition,
} from "solid-js";
import * as v from "valibot";
import { useGet } from "~/features/hooks/query";
import { Button } from "~/features/ui/components/button";
import { Input } from "~/features/ui/components/input";
import {
  SwitchControl,
  SwitchLabel,
  SwitchThumb,
  Switch as ToggleSwitch,
} from "~/features/ui/components/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/features/ui/components/table";
import { createForm } from "~/features/ui/form";
import type { FormConfig, FormContextValue } from "~/features/ui/form/types";
import type { DetailsResponse } from "./type";

interface ItemRow {
  product_name: string;
  sku: string;
  unit_price: string;
  vat: string;
  discount: string;
}

interface NotesheetFormValues {
  items: ItemRow[];
}

const itemRowSchema = v.object({
  product_name: v.string(),
  sku: v.string(),
  unit_price: v.pipe(
    v.string(),
    v.check(
      (val) => val !== "" && !Number.isNaN(parseFloat(val)) && parseFloat(val) >= 0,
      "Unit price must be a valid number ≥ 0",
    ),
  ),
  vat: v.pipe(
    v.string(),
    v.check((val) => {
      const n = parseFloat(val);
      return val !== "" && !Number.isNaN(n) && n >= 0 && n <= 100;
    }, "VAT must be a number between 0 and 100"),
  ),
  discount: v.pipe(
    v.string(),
    v.check((val) => {
      const n = parseFloat(val);
      return val !== "" && !Number.isNaN(n) && n >= 0 && n <= 100;
    }, "Discount must be a number between 0 and 100"),
  ),
});

const notesheetSchema = v.object({
  items: v.array(itemRowSchema),
});

function validateItemField(field: "unit_price" | "vat" | "discount", value: string): string {
  const num = parseFloat(value);
  if (value === "" || Number.isNaN(num)) return "Must be a valid number";
  if (num < 0) return "Must be ≥ 0";
  if ((field === "vat" || field === "discount") && num > 100) return "Must be ≤ 100";
  return "";
}

const formConfig: FormConfig<NotesheetFormValues> = {
  defaultValues: { items: [] },
  schema: notesheetSchema,
  fields: [
    {
      name: "items",
      label: "Notesheet Items",
      type: "array",
      arrayConfig: {
        itemFields: [
          { name: "product_name", label: "Product Name", type: "text" },
          { name: "sku", label: "SKU", type: "text" },
          { name: "unit_price", label: "Unit Price", type: "number" },
          { name: "vat", label: "VAT", type: "number" },
          { name: "discount", label: "Discount", type: "number" },
        ],
      },
    },
  ],
  onSubmit: async (values) => {
    if (import.meta.env.DEV) console.log("Submitted items:", values.items);
  },
  submitLabel: "Save Changes",
};

const PAGE_SIZE = 20;

function NotesheetContent() {
  const query = useGet<DetailsResponse>("/v1/notesheets/218");
  const Forms = createForm<NotesheetFormValues>(formConfig);

  const [paginated, setPaginated] = createSignal(false);

  const apiItems = () => query.data?.data.notesheet_items ?? [];

  createEffect(
    on(
      () => query.isSuccess,
      (isSuccess) => {
        const items = apiItems();
        if (isSuccess && items.length > 0) {
          startTransition(() => {
            batch(() => {
              Forms.setValue("items", items);
            });
          });
        }
      },
    ),
  );

  return (
    <Forms.Form>
      <Switch>
        <Match when={query.isLoading}>Loading...</Match>
        <Match when={query.isError}>Error loading notesheet details</Match>
        <Match when={query.isSuccess}>
          <ItemsTable useForm={Forms.useForm} paginated={paginated()} setPaginated={setPaginated} />
        </Match>
      </Switch>
    </Forms.Form>
  );
}

function ItemsTable(props: {
  useForm: () => FormContextValue<NotesheetFormValues>;
  paginated: boolean;
  setPaginated: (v: boolean) => void;
}) {
  const form = props.useForm();
  const items = () => form.values.items;
  const [page, setPage] = createSignal(0);
  const [cellErrors, setCellErrors] = createSignal<Record<string, string>>({});

  const totalPages = createMemo(() => Math.ceil(items().length / PAGE_SIZE));
  const displayItems = createMemo(() => {
    if (!props.paginated) return items();
    const start = page() * PAGE_SIZE;
    return items().slice(start, start + PAGE_SIZE);
  });
  // Global start index for Sl No
  const startIndex = createMemo(() => (props.paginated ? page() * PAGE_SIZE : 0));

  const updateItem = (globalIndex: number, field: keyof ItemRow, value: string) => {
    if (field === "unit_price" || field === "vat" || field === "discount") {
      const err = validateItemField(field, value);
      const key = `${globalIndex}_${field}`;
      setCellErrors((prev) => {
        const next = { ...prev };
        if (err) next[key] = err;
        else delete next[key];
        return next;
      });
    }
    const updated = [...items()];
    updated[globalIndex] = { ...updated[globalIndex], [field]: value };
    form.setValue("items", updated);
  };

  const removeItem = (globalIndex: number) => {
    setCellErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        if (key.startsWith(`${globalIndex}_`)) delete next[key];
      }
      return next;
    });
    form.setValue(
      "items",
      items().filter((_, i) => i !== globalIndex),
    );
    if (props.paginated && displayItems().length <= 1 && page() > 0) {
      setPage((p) => p - 1);
    }
  };

  return (
    <div class="space-y-3 max-h-150 overflow-y-auto">
      <div class="flex items-center justify-between ">
        {/* biome-ignore lint/a11y/noLabelWithoutControl: decorative label for section heading */}
        <label class="text-sm font-medium">
          Notesheet Items
          <Show when={items().length > 0}>
            <span class="ml-1.5 text-xs text-muted-foreground font-normal">
              ({items().length} items)
            </span>
          </Show>
        </label>
        <ToggleSwitch
          class="flex items-center gap-2"
          checked={props.paginated}
          onChange={(checked) => {
            props.setPaginated(checked);
            setPage(0);
          }}
        >
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
          <SwitchLabel class="text-xs text-muted-foreground">Pagination</SwitchLabel>
        </ToggleSwitch>
      </div>

      <Show
        when={items().length > 0}
        fallback={
          <div class="flex items-center justify-center py-8 border border-dashed rounded-lg text-sm text-muted-foreground">
            No items available.
          </div>
        }
      >
        <Table class="">
          <TableHeader>
            <TableRow>
              <TableHead class="w-14">Sl No</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead class="w-32">Unit Price</TableHead>
              <TableHead class="w-28">VAT</TableHead>
              <TableHead class="w-28">Discount</TableHead>
              <TableHead class="w-16">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <For each={displayItems()}>
              {(item, localIndex) => {
                const globalIndex = () => startIndex() + localIndex();
                return (
                  <TableRow>
                    <TableCell class="text-muted-foreground">{globalIndex() + 1}</TableCell>
                    <TableCell class="font-medium">{item.product_name}</TableCell>
                    <TableCell class="text-muted-foreground">{item.sku}</TableCell>
                    <TableCell>
                      <div>
                        <Input
                          type="number"
                          value={item.unit_price}
                          onInput={(e) =>
                            updateItem(globalIndex(), "unit_price", e.currentTarget.value)
                          }
                          step="0.01"
                          class={
                            cellErrors()[`${globalIndex()}_unit_price`]
                              ? "border-destructive focus-visible:ring-destructive/40"
                              : ""
                          }
                        />
                        <Show when={cellErrors()[`${globalIndex()}_unit_price`]}>
                          <p class="text-[11px] text-destructive mt-0.5">
                            {cellErrors()[`${globalIndex()}_unit_price`]}
                          </p>
                        </Show>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Input
                          type="number"
                          value={item.vat}
                          onInput={(e) => updateItem(globalIndex(), "vat", e.currentTarget.value)}
                          step="0.01"
                          class={
                            cellErrors()[`${globalIndex()}_vat`]
                              ? "border-destructive focus-visible:ring-destructive/40"
                              : ""
                          }
                        />
                        <Show when={cellErrors()[`${globalIndex()}_vat`]}>
                          <p class="text-[11px] text-destructive mt-0.5">
                            {cellErrors()[`${globalIndex()}_vat`]}
                          </p>
                        </Show>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Input
                          type="number"
                          value={item.discount}
                          onInput={(e) =>
                            updateItem(globalIndex(), "discount", e.currentTarget.value)
                          }
                          step="0.01"
                          class={
                            cellErrors()[`${globalIndex()}_discount`]
                              ? "border-destructive focus-visible:ring-destructive/40"
                              : ""
                          }
                        />
                        <Show when={cellErrors()[`${globalIndex()}_discount`]}>
                          <p class="text-[11px] text-destructive mt-0.5">
                            {cellErrors()[`${globalIndex()}_discount`]}
                          </p>
                        </Show>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => removeItem(globalIndex())}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="size-4 text-destructive"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              }}
            </For>
          </TableBody>
        </Table>

        {/* Pagination */}
        <Show when={props.paginated && totalPages() > 1}>
          <div class="flex items-center justify-between pt-2">
            <span class="text-xs text-muted-foreground">
              Page {page() + 1} of {totalPages()}
            </span>
            <div class="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={page() === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={page() >= totalPages() - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </Show>
      </Show>
    </div>
  );
}

export default NotesheetContent;
