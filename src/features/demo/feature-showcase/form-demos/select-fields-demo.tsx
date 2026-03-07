import * as v from "valibot";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/features/ui/components/card";
import { createForm } from "~/features/ui/form";

/**
 * Select Fields Demo
 *
 * Features demonstrated:
 * - Single select dropdown with static options
 * - Various option configurations
 *
 * Note: For multi-select, searchable, or async options,
 * see the AsyncSelect component demo.
 */

interface SelectFormData {
  country: string;
  category: string;
  priority: string;
}

const selectFormSchema = v.object({
  country: v.pipe(v.string(), v.minLength(1, "Please select a country")),
  category: v.pipe(v.string(), v.minLength(1, "Please select a category")),
  priority: v.pipe(v.string(), v.minLength(1, "Please select priority")),
});

export function SelectFieldsDemo() {
  const { Form } = createForm<SelectFormData>({
    defaultValues: {
      country: "",
      category: "",
      priority: "",
    },
    validationMode: "onChange",
    fields: [
      {
        name: "country",
        label: "Country",
        type: "select",
        placeholder: "Select a country",
        options: [
          { label: "United States", value: "us" },
          { label: "Canada", value: "ca" },
          { label: "United Kingdom", value: "uk" },
          { label: "Germany", value: "de" },
          { label: "France", value: "fr" },
          { label: "Japan", value: "jp" },
          { label: "Australia", value: "au" },
        ],
      },
      {
        name: "category",
        label: "Category",
        type: "select",
        placeholder: "Select category",
        options: [
          { label: "Technology", value: "tech" },
          { label: "Business", value: "business" },
          { label: "Design", value: "design" },
          { label: "Marketing", value: "marketing" },
          { label: "Sales", value: "sales" },
        ],
      },
      {
        name: "priority",
        label: "Priority",
        type: "select",
        placeholder: "Set priority",
        options: [
          { label: "Low", value: "low" },
          { label: "Medium", value: "medium" },
          { label: "High", value: "high" },
          { label: "Critical", value: "critical" },
        ],
      },
    ],
    columns: 2,
    schema: selectFormSchema,
  });

  const handleSubmit = (data: SelectFormData) => {
    console.log("Select form data:", data);
    alert(
      `Submitted!\n\nCountry: ${data.country}\nCategory: ${data.category}\nPriority: ${data.priority}`,
    );
  };

  return (
    <div class="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Select Fields</CardTitle>
          <CardDescription>
            Single select dropdown with static options. For multi-select, searchable, or async
            options, see the AsyncSelect Demo tab.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit} class="max-w-2xl" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Select Field Features</CardTitle>
        </CardHeader>
        <CardContent class="prose prose-sm dark:prose-invert max-w-none">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h4 class="font-semibold text-sm mb-2">Single Select</h4>
              <ul class="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                <li>Dropdown with one selection</li>
                <li>Keyboard navigation</li>
                <li>Static options only</li>
              </ul>
            </div>
            <div>
              <h4 class="font-semibold text-sm mb-2">Need More?</h4>
              <ul class="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                <li>Multi-select with chips</li>
                <li>Async/API-loaded options</li>
                <li>Searchable autocomplete</li>
              </ul>
              <p class="text-sm text-muted-foreground mt-2">
                See <strong>AsyncSelect Demo</strong> tab
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <pre class="text-xs bg-muted p-4 rounded-md overflow-auto">
            {`// Single select with static options
{
  name: "country",
  label: "Country",
  type: "select",
  placeholder: "Select a country",
  options: [
    { label: "USA", value: "us" },
    { label: "Canada", value: "ca" },
    { label: "UK", value: "uk" },
  ],
}

// With validation
const schema = v.object({
  country: v.pipe(v.string(), v.minLength(1, "Please select a country")),
});

// For multi-select, searchable, or async options,
// use the AsyncSelect component directly.
// See the "AsyncSelect Demo" tab for examples.`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
