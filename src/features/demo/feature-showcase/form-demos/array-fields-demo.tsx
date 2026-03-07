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
 * Array Fields Demo
 *
 * Features demonstrated:
 * - Dynamic array of fields
 * - Add/remove items
 * - Nested field configuration
 */

interface InvoiceFormData {
  clientName: string;
  clientEmail: string;
  items: Array<{ description: string }>;
  notes?: string;
}

const invoiceSchema = v.object({
  clientName: v.pipe(v.string(), v.minLength(1, "Client name is required")),
  clientEmail: v.pipe(v.string(), v.email("Invalid email")),
  items: v.pipe(
    v.array(
      v.object({ description: v.pipe(v.string(), v.minLength(1, "Item description required")) }),
    ),
    v.minLength(1, "At least one item required"),
  ),
  notes: v.optional(v.string()),
});

export function ArrayFieldsDemo() {
  const { Form } = createForm<InvoiceFormData>({
    defaultValues: {
      clientName: "",
      clientEmail: "",
      items: [{ description: "" }],
      notes: "",
    },
    fields: [
      {
        name: "clientName",
        label: "Client Name",
        type: "text",
        placeholder: "Acme Corporation",
      },
      {
        name: "clientEmail",
        label: "Client Email",
        type: "email",
        placeholder: "billing@acme.com",
      },
      {
        name: "items",
        label: "Invoice Items",
        type: "array",
        arrayConfig: {
          itemFields: [
            {
              name: "description",
              label: "Item Description",
              type: "text",
              placeholder: "Enter item description",
            },
          ],
          addLabel: "Add Item",
          minItems: 1,
        },
      },
      {
        name: "notes",
        label: "Additional Notes",
        type: "textarea",
        placeholder: "Payment terms, special instructions...",
      },
    ],
    columns: 2,
    schema: invoiceSchema,
  });

  const handleSubmit = (data: InvoiceFormData) => {
    console.log("Invoice data:", data);
    alert(
      `Invoice Created!\n\nClient: ${data.clientName}\nItems: ${data.items.length}\n\n${data.items.map((item, i) => `${i + 1}. ${item.description}`).join("\n")}`,
    );
  };

  return (
    <div class="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Array Fields</CardTitle>
          <CardDescription>
            Dynamic arrays allow users to add or remove items. Click the "Add" button to add new
            items and the trash icon to remove them. Great for line items, tags, or repeating data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit} class="max-w-2xl" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Array Field Features</CardTitle>
        </CardHeader>
        <CardContent class="prose prose-sm dark:prose-invert max-w-none">
          <ul class="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>Add Items:</strong> Click the "Add" button to append new entries
            </li>
            <li>
              <strong>Remove Items:</strong> Click the trash icon to delete an entry
            </li>
            <li>
              <strong>Validation:</strong> Each item can have its own validation rules
            </li>
            <li>
              <strong>Array-level validation:</strong> Validate minimum/maximum items
            </li>
            <li>
              <strong>Nested Fields:</strong> Each item can use any field type (text, select, etc.)
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <pre class="text-xs bg-muted p-4 rounded-md overflow-auto">
            {`interface FormData {
  tags: string[];
}

const { Form } = createForm<FormData>({
  defaultValues: {
    tags: [""],  // Start with one empty item
  },
  fields: [
    {
      name: "tags",
      label: "Tags",
      type: "array",
      // Define the field type for each array item
      itemField: {
        name: "tag",  // Individual item name
        label: "Tag",
        type: "text",
        placeholder: "Enter a tag",
      },
    },
  ],
});

// Validation with Valibot
const schema = v.object({
  tags: v.pipe(
    v.array(v.pipe(v.string(), v.minLength(1, "Tag cannot be empty"))),
    v.minLength(1, "At least one tag required"),
    v.maxLength(10, "Maximum 10 tags allowed"),
  ),
});`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advanced: Complex Array Items</CardTitle>
        </CardHeader>
        <CardContent>
          <pre class="text-xs bg-muted p-4 rounded-md overflow-auto">
            {`// For complex nested objects in arrays,
// you would typically use a custom component
// or multiple array fields:

interface LineItem {
  description: string;
  quantity: number;
  price: number;
}

// Current implementation supports single-field arrays
// For complex objects, consider:
// 1. Multiple separate arrays (descriptions[], quantities[], prices[])
// 2. Custom form component with nested forms
// 3. JSON string field with custom parsing

// Future enhancement could support:
{
  name: "lineItems",
  type: "array",
  itemFields: [  // Multiple fields per item
    { name: "description", type: "text" },
    { name: "quantity", type: "number" },
    { name: "price", type: "number" },
  ],
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
