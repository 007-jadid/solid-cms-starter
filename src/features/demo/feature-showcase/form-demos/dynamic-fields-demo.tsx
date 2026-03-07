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
 * Dynamic Fields Demo
 *
 * Features demonstrated:
 * - Conditional field visibility (hidden)
 * - Dynamic disabled state
 * - Computed/derived fields
 * - Field effects/watchers
 */

interface DynamicFormData {
  employmentType: string;
  companyName?: string;
  position?: string;
  salary?: number;
  freelanceRate?: number;
  projectType?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

const dynamicFormSchema = v.object({
  employmentType: v.pipe(v.string(), v.minLength(1, "Please select employment type")),
  companyName: v.optional(v.string()),
  position: v.optional(v.string()),
  salary: v.optional(v.number()),
  freelanceRate: v.optional(v.number()),
  projectType: v.optional(v.string()),
  quantity: v.pipe(v.number(), v.minValue(1, "Quantity must be at least 1")),
  unitPrice: v.pipe(v.number(), v.minValue(0.01, "Price must be positive")),
  total: v.number(),
});

export function DynamicFieldsDemo() {
  const { Form } = createForm<DynamicFormData>({
    defaultValues: {
      employmentType: "",
      companyName: "",
      position: "",
      salary: 0,
      freelanceRate: 0,
      projectType: "",
      quantity: 1,
      unitPrice: 100,
      total: 100,
    },
    fields: [
      {
        name: "employmentType",
        label: "Employment Type",
        type: "select",
        options: [
          { label: "Full-time Employee", value: "employee" },
          { label: "Freelancer", value: "freelance" },
          { label: "Student", value: "student" },
        ],
      },
      // Employee-only fields
      {
        name: "companyName",
        label: "Company Name",
        type: "text",
        placeholder: "Acme Inc.",
        hidden: (values) => values.employmentType !== "employee",
      },
      {
        name: "position",
        label: "Job Title",
        type: "text",
        placeholder: "Software Engineer",
        hidden: (values) => values.employmentType !== "employee",
      },
      {
        name: "salary",
        label: "Annual Salary",
        type: "number",
        placeholder: "75000",
        hidden: (values) => values.employmentType !== "employee",
      },
      // Freelancer-only fields
      {
        name: "freelanceRate",
        label: "Hourly Rate ($)",
        type: "number",
        placeholder: "150",
        hidden: (values) => values.employmentType !== "freelance",
      },
      {
        name: "projectType",
        label: "Project Type",
        type: "select",
        options: [
          { label: "Web Development", value: "web" },
          { label: "Mobile App", value: "mobile" },
          { label: "Design", value: "design" },
          { label: "Consulting", value: "consulting" },
        ],
        hidden: (values) => values.employmentType !== "freelance",
      },
      // Computed fields example
      {
        name: "quantity",
        label: "Quantity",
        type: "number",
        placeholder: "1",
      },
      {
        name: "unitPrice",
        label: "Unit Price ($)",
        type: "number",
        placeholder: "100",
      },
      {
        name: "total",
        label: "Total (Computed)",
        type: "number",
        disabled: true, // Read-only
        computed: {
          dependencies: ["quantity", "unitPrice"],
          compute: (values) => (values.quantity || 0) * (values.unitPrice || 0),
        },
      },
    ],
    columns: 2,
    schema: dynamicFormSchema,
    // Field effects for complex interactions
    effects: [
      {
        watch: ["employmentType"],
        handler: (values, form) => {
          // Reset related fields when employment type changes
          if (values.employmentType === "employee") {
            form.setFieldValue("freelanceRate", 0);
            form.setFieldValue("projectType", "");
          } else if (values.employmentType === "freelance") {
            form.setFieldValue("companyName", "");
            form.setFieldValue("position", "");
            form.setFieldValue("salary", 0);
          }
        },
      },
    ],
  });

  const handleSubmit = (data: DynamicFormData) => {
    console.log("Dynamic form data:", data);
    alert(`Submitted!\n\n${JSON.stringify(data, null, 2)}`);
  };

  return (
    <div class="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Dynamic Fields</CardTitle>
          <CardDescription>
            Fields can be dynamically hidden, disabled, or computed based on other field values. Try
            changing the "Employment Type" to see different fields appear.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit} class="max-w-2xl" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dynamic Field Types</CardTitle>
        </CardHeader>
        <CardContent class="prose prose-sm dark:prose-invert max-w-none">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h4 class="font-semibold text-sm mb-2">Hidden Fields</h4>
              <pre class="text-xs bg-muted p-2 rounded">
                {`hidden: (values) =>
  values.type !== "employee"`}
              </pre>
            </div>
            <div>
              <h4 class="font-semibold text-sm mb-2">Disabled Fields</h4>
              <pre class="text-xs bg-muted p-2 rounded">
                {`disabled: (values) =>
  values.status === "locked"`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Computed Fields</CardTitle>
        </CardHeader>
        <CardContent>
          <pre class="text-xs bg-muted p-4 rounded-md overflow-auto">
            {`{
  name: "total",
  label: "Total",
  type: "number",
  disabled: true,  // Computed fields should be read-only
  computed: {
    // Only these fields trigger recomputation
    dependencies: ["quantity", "unitPrice"],
    // Compute function receives all form values
    compute: (values) => values.quantity * values.unitPrice,
  },
}`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Field Effects (Watchers)</CardTitle>
        </CardHeader>
        <CardContent>
          <pre class="text-xs bg-muted p-4 rounded-md overflow-auto">
            {`const { Form } = createForm({
  // ...fields
  effects: [
    {
      // Watch specific fields for changes
      watch: ["country"],
      // Handler called when any watched field changes
      handler: (values, form, changedField) => {
        // Reset dependent fields
        form.setFieldValue("state", "");
        form.setFieldValue("city", "");
      },
    },
    {
      watch: ["employmentType"],
      handler: (values, form) => {
        if (values.employmentType === "student") {
          // Auto-set some defaults
          form.setFieldValue("salary", 0);
        }
      },
    },
  ],
});`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
