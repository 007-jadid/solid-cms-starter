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
 * Validation Demo
 *
 * Features demonstrated:
 * - Valibot schema validation
 * - Real-time validation (onChange)
 * - Field-level error display
 * - Cross-field validation (password confirm)
 */

interface RegistrationData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: number;
}

const registrationSchema = v.pipe(
  v.object({
    username: v.pipe(
      v.string(),
      v.minLength(3, "Username must be at least 3 characters"),
      v.maxLength(20, "Username must be at most 20 characters"),
      v.regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),
    ),
    email: v.pipe(v.string(), v.email("Please enter a valid email address")),
    password: v.pipe(
      v.string(),
      v.minLength(8, "Password must be at least 8 characters"),
      v.regex(/[A-Z]/, "Must contain at least one uppercase letter"),
      v.regex(/[a-z]/, "Must contain at least one lowercase letter"),
      v.regex(/[0-9]/, "Must contain at least one number"),
    ),
    confirmPassword: v.string(),
    age: v.pipe(
      v.number("Age must be a number"),
      v.minValue(18, "You must be at least 18 years old"),
      v.maxValue(120, "Please enter a valid age"),
    ),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["confirmPassword"]],
      (input) => input.password === input.confirmPassword,
      "Passwords don't match",
    ),
    ["confirmPassword"],
  ),
);

export function ValidationDemo() {
  const { Form } = createForm<RegistrationData>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      age: 0,
    },
    validationMode: "onChange",
    fields: [
      {
        name: "username",
        label: "Username",
        type: "text",
        placeholder: "johndoe",
        description: "3-20 characters, letters, numbers, underscores only",
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "john@example.com",
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter a strong password",
        description: "Min 8 chars, 1 uppercase, 1 lowercase, 1 number",
      },
      {
        name: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        placeholder: "Re-enter your password",
      },
      {
        name: "age",
        label: "Age",
        type: "number",
        placeholder: "18",
      },
    ],
    columns: 2,
    schema: registrationSchema,
  });

  const handleSubmit = (data: RegistrationData) => {
    console.log("Registration data:", data);
    alert("Registration successful!");
  };

  return (
    <div class="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Form Validation</CardTitle>
          <CardDescription>
            Comprehensive validation using Valibot schemas. Errors are shown in real-time as you
            type. Try entering invalid data to see the validation messages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit} class="max-w-2xl" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Validation Features</CardTitle>
        </CardHeader>
        <CardContent class="prose prose-sm dark:prose-invert max-w-none">
          <ul class="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>onChange validation:</strong> Validates as user types for immediate feedback
            </li>
            <li>
              <strong>onBlur validation:</strong> Validates when field loses focus
            </li>
            <li>
              <strong>onSubmit validation:</strong> Validates only on form submission
            </li>
            <li>
              <strong>Cross-field validation:</strong> Compare fields (e.g., password confirmation)
            </li>
            <li>
              <strong>Custom messages:</strong> Valibot provides detailed error messages
            </li>
            <li>
              <strong>Multiple errors:</strong> Fields can show multiple validation errors
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Valibot Schema Example</CardTitle>
        </CardHeader>
        <CardContent>
          <pre class="text-xs bg-muted p-4 rounded-md overflow-auto">
            {`const schema = v.pipe(
  v.object({
    username: v.pipe(
      v.string(),
      v.minLength(3, "Min 3 characters"),
      v.maxLength(20, "Max 20 characters"),
      v.regex(/^[a-zA-Z0-9_]+$/, "Invalid characters"),
    ),
    email: v.pipe(v.string(), v.email("Invalid email")),
    password: v.pipe(
      v.string(),
      v.minLength(8, "Min 8 characters"),
      v.regex(/[A-Z]/, "Need uppercase"),
      v.regex(/[0-9]/, "Need number"),
    ),
    confirmPassword: v.string(),
  }),
  // Cross-field validation
  v.forward(
    v.partialCheck(
      [["password"], ["confirmPassword"]],
      (input) => input.password === input.confirmPassword,
      "Passwords don't match",
    ),
    ["confirmPassword"],  // Shows error on this field
  ),
);

// Apply to form
const { Form } = createForm({
  // ...fields
  schema,  // Validation applied
});`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
