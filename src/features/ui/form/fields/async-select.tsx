import { createMemo, Show } from "solid-js";
import { useGet } from "~/features/hooks/query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/select";
import type { FieldConfig, FieldOption } from "../types";

/**
 * AsyncSelect component for loading options from an API.
 * Uses the project's useGet hook (TanStack Query + apiClient) for
 * consistent auth headers, caching, and error handling.
 */
export function AsyncSelect<TValues extends object>(props: {
  field: FieldConfig<TValues>;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const asyncConfig = props.field.asyncOptions!;
  const pageSize = asyncConfig.pageSize || 20;

  // Build URL with pagination params
  const url = () => {
    const params = new URLSearchParams();
    if (asyncConfig.paginated) {
      params.set(asyncConfig.pageParam || "page", "1");
      params.set(asyncConfig.pageSizeParam || "pageSize", String(pageSize));
    }
    const paramStr = params.toString();
    return paramStr ? `${asyncConfig.apiUrl}?${paramStr}` : asyncConfig.apiUrl;
  };

  const query = useGet<unknown>(url);

  // Map raw API response to FieldOption[]
  const options = createMemo(() => {
    const data = query.data;
    if (!data) return [];
    const items = Array.isArray(data)
      ? data
      : (data as Record<string, unknown>).items || (data as Record<string, unknown>).data || [];
    return (items as unknown[]).map(asyncConfig.optionMapper);
  });

  return (
    <div class="space-y-1.5">
      <Select<FieldOption>
        value={options().find((opt) => opt.value === String(props.value ?? ""))}
        onChange={(opt) => props.onChange(opt?.value ?? "")}
        options={options()}
        optionValue="value"
        optionTextValue="label"
        itemComponent={(itemProps) => (
          <SelectItem item={itemProps.item}>
            {(itemProps.item.rawValue as unknown as FieldOption)?.label ??
              String(itemProps.item.rawValue)}
          </SelectItem>
        )}
      >
        <SelectLabel>
          {props.field.label} {props.field.required && <span class="text-destructive">*</span>}
        </SelectLabel>
        <SelectTrigger>
          <SelectValue<FieldOption>>{(state) => state.selectedOption()?.label}</SelectValue>
        </SelectTrigger>
        <SelectContent />
      </Select>
      <Show when={query.isLoading}>
        <p class="text-xs text-muted-foreground">Loading options...</p>
      </Show>
    </div>
  );
}
