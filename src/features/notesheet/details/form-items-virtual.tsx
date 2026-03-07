import { createVirtualizer } from "@tanstack/solid-virtual";
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
} from "solid-js";
import * as v from "valibot";
import { useGet } from "~/features/hooks/query";
import { Button } from "~/features/ui/components/button";
import { Input } from "~/features/ui/components/input";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "~/features/ui/components/table";
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

const ROW_HEIGHT = 75;

function NotesheetContentVirtual() {
  const query = useGet<DetailsResponse>("/v1/notesheets/218");
  const Forms = createForm<NotesheetFormValues>(formConfig);

  const apiItems = () => query.data?.data.notesheet_items ?? [];

  createEffect(
    on(
      () => query.isSuccess,
      (isSuccess) => {
        const items = apiItems();
        if (isSuccess && items.length > 0) {
          batch(() => {
            Forms.setValue("items", items);
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
          <ItemsTableWrapper useForm={Forms.useForm} />
        </Match>
      </Switch>
    </Forms.Form>
  );
}

/** Thin wrapper that reads items and conditionally mounts the virtual table */
function ItemsTableWrapper(props: { useForm: () => FormContextValue<NotesheetFormValues> }) {
  const form = props.useForm();
  const items = () => form.values.items;

  return (
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        {/* biome-ignore lint/a11y/noLabelWithoutControl: decorative label for section heading */}
        <label class="text-sm font-medium">
          Notesheet Items
          <Show when={items().length > 0}>
            <span class="ml-1.5 text-xs text-muted-foreground font-normal">
              ({items().length} items)
            </span>
          </Show>
        </label>
      </div>

      <Show
        when={items().length > 0}
        fallback={
          <div class="flex items-center justify-center py-8 border border-dashed rounded-lg text-sm text-muted-foreground">
            No items available.
          </div>
        }
      >
        {/* VirtualTableBody only mounts when items exist → scroll ref is always in DOM */}
        <VirtualTableBody items={items} setValue={(v) => form.setValue("items", v)} />
      </Show>
    </div>
  );
}

/** The actual virtualized table — only mounts when items.length > 0 */
function VirtualTableBody(props: { items: () => ItemRow[]; setValue: (items: ItemRow[]) => void }) {
  let scrollRef!: HTMLDivElement;

  const [cellErrors, setCellErrors] = createSignal<Record<string, string>>({});

  const virtualizer = createVirtualizer({
    get count() {
      return props.items().length;
    },
    getScrollElement: () => scrollRef,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  const visibleRange = createMemo(() => {
    const vItems = virtualizer.getVirtualItems();
    if (vItems.length === 0) return { start: 0, end: 0 };
    return {
      start: vItems[0].index + 1,
      end: vItems[vItems.length - 1].index + 1,
    };
  });

  const paddingTop = () => {
    const vItems = virtualizer.getVirtualItems();
    return vItems.length > 0 ? vItems[0].start : 0;
  };

  const paddingBottom = () => {
    const vItems = virtualizer.getVirtualItems();
    if (vItems.length === 0) return 0;
    return virtualizer.getTotalSize() - vItems[vItems.length - 1].end;
  };

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
    const updated = [...props.items()];
    updated[globalIndex] = { ...updated[globalIndex], [field]: value };
    props.setValue(updated);
  };

  const removeItem = (globalIndex: number) => {
    setCellErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        if (key.startsWith(`${globalIndex}_`)) delete next[key];
      }
      return next;
    });
    props.setValue(props.items().filter((_, i) => i !== globalIndex));
  };

  return (
    <>
      <div class="flex justify-end">
        <span class="text-xs text-muted-foreground">
          Showing {visibleRange().start}–{visibleRange().end} of {props.items().length}
        </span>
      </div>

      <div ref={scrollRef} class="rounded-md border max-h-150 overflow-y-auto">
        <Table>
          <TableHeader class="sticky top-0 z-10 bg-background">
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
          <tbody>
            {/* Top spacer */}
            <Show when={paddingTop() > 0}>
              <tr>
                <td style={{ height: `${paddingTop()}px` }} colspan="7" />
              </tr>
            </Show>

            <For each={virtualizer.getVirtualItems()}>
              {(virtualRow) => {
                const item = () => props.items()[virtualRow.index];
                const idx = virtualRow.index;
                return (
                  <Show when={item()}>
                    <TableRow>
                      <TableCell class="text-muted-foreground w-14">{idx + 1}</TableCell>
                      <TableCell class="font-medium">{item().product_name}</TableCell>
                      <TableCell class="text-muted-foreground">{item().sku}</TableCell>
                      <TableCell class="w-32">
                        <div>
                          <Input
                            type="number"
                            value={item().unit_price}
                            onInput={(e) => updateItem(idx, "unit_price", e.currentTarget.value)}
                            step="0.01"
                            class={
                              cellErrors()[`${idx}_unit_price`]
                                ? "border-destructive focus-visible:ring-destructive/40"
                                : ""
                            }
                          />
                          <p class="min-h-3.5 text-[11px] text-destructive mt-0.5">
                            {cellErrors()[`${idx}_unit_price`] ?? ""}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell class="w-28">
                        <div>
                          <Input
                            type="number"
                            value={item().vat}
                            onInput={(e) => updateItem(idx, "vat", e.currentTarget.value)}
                            step="0.01"
                            class={
                              cellErrors()[`${idx}_vat`]
                                ? "border-destructive focus-visible:ring-destructive/40"
                                : ""
                            }
                          />
                          <p class="min-h-3.5 text-[11px] text-destructive mt-0.5">
                            {cellErrors()[`${idx}_vat`] ?? ""}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell class="w-28">
                        <div>
                          <Input
                            type="number"
                            value={item().discount}
                            onInput={(e) => updateItem(idx, "discount", e.currentTarget.value)}
                            step="0.01"
                            class={
                              cellErrors()[`${idx}_discount`]
                                ? "border-destructive focus-visible:ring-destructive/40"
                                : ""
                            }
                          />
                          <p class="min-h-3.5 text-[11px] text-destructive mt-0.5">
                            {cellErrors()[`${idx}_discount`] ?? ""}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell class="w-16">
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={() => removeItem(idx)}
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
                  </Show>
                );
              }}
            </For>

            {/* Bottom spacer */}
            <Show when={paddingBottom() > 0}>
              <tr>
                <td style={{ height: `${paddingBottom()}px` }} colspan="7" />
              </tr>
            </Show>
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default NotesheetContentVirtual;
