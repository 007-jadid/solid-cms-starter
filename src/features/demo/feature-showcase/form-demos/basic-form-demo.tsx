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
 * Basic Form Demo
 *
 * Features demonstrated:
 * - Simple form creation with createForm
 * - Basic field types (text, email, textarea)
 * - Form submission handling
 */

interface BasicFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

const basicFormSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, "Name is required")),
  email: v.pipe(v.string(), v.email("Invalid email address")),
  phone: v.optional(v.string()),
  message: v.pipe(v.string(), v.minLength(10, "Message must be at least 10 characters")),
});

export function BasicFormDemo() {
  const { Form } = createForm<BasicFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
    fields: [
      {
        name: "name",
        label: "Full Name",
        type: "text",
        placeholder: "Enter your name",
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        placeholder: "you@example.com",
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "text",
        placeholder: "+1 (555) 123-4567",
      },
      {
        name: "message",
        label: "Message",
        type: "textarea",
        placeholder: "How can we help you?",
      },
    ],
    columns: 2,
    schema: basicFormSchema,
  });

  const handleSubmit = (data: BasicFormData) => {
    console.log("Form submitted:", data);
    alert(`Form submitted!\n\n${JSON.stringify(data, null, 2)}`);
  };

  return (
    <div class="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Basic Form</CardTitle>
          <CardDescription>
            A simple contact form demonstrating basic field types and validation. Uses{" "}
            <code class="text-xs bg-muted px-1 py-0.5 rounded">createForm</code> for declarative
            form creation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit} class="max-w-2xl" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <pre class="text-xs bg-muted p-4 rounded-md overflow-auto">
            {`import { createForm } from "~/features/ui/form";
import * as v from "valibot";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const schema = v.object({
  name: v.pipe(v.string(), v.minLength(1, "Required")),
  email: v.pipe(v.string(), v.email("Invalid email")),
  message: v.pipe(v.string(), v.minLength(10, "Min 10 chars")),
});

const { Form } = createForm<FormData>({
  defaultValues: {
    name: "",
    email: "",
    message: "",
  },
  fields: [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "message", label: "Message", type: "textarea" },
  ],
  columns: 2,
  schema,
});

// Usage in component
function ContactPage() {
  return <Form onSubmit={(data) => console.log(data)} />;
}`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Field Types</CardTitle>
        </CardHeader>
        <CardContent class="prose prose-sm dark:prose-invert max-w-none">
          <ul class="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <code class="text-xs bg-muted px-1 py-0.5 rounded">text</code> - Standard text input
            </li>
            <li>
              <code class="text-xs bg-muted px-1 py-0.5 rounded">email</code> - Email input with
              HTML5 validation
            </li>
            <li>
              <code class="text-xs bg-muted px-1 py-0.5 rounded">number</code> - Numeric input with
              auto-conversion
            </li>
            <li>
              <code class="text-xs bg-muted px-1 py-0.5 rounded">password</code> - Password input
              (hidden text)
            </li>
            <li>
              <code class="text-xs bg-muted px-1 py-0.5 rounded">textarea</code> - Multi-line text
              area
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
