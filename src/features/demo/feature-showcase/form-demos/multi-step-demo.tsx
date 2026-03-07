import * as v from "valibot";

import { Button } from "~/features/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/features/ui/components/card";
import { createForm } from "~/features/ui/form";

/**
 * Multi-Step Form Demo
 *
 * Features demonstrated:
 * - Step-based navigation
 * - Per-step validation
 * - Step indicator variants
 * - Step labels and progress
 */

interface MultiStepData {
  // Step 1: Personal
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  // Step 2: Address
  street: string;
  city: string;
  state: string;
  zipCode: string;
  // Step 3: Preferences
  newsletter: boolean;
  theme: string;
  notifications: string;
}

const multiStepSchema = v.object({
  firstName: v.pipe(v.string(), v.minLength(1, "First name is required")),
  lastName: v.pipe(v.string(), v.minLength(1, "Last name is required")),
  email: v.pipe(v.string(), v.email("Invalid email")),
  phone: v.optional(v.string()),
  street: v.pipe(v.string(), v.minLength(1, "Street address is required")),
  city: v.pipe(v.string(), v.minLength(1, "City is required")),
  state: v.pipe(v.string(), v.minLength(1, "State is required")),
  zipCode: v.pipe(v.string(), v.regex(/^\d{5}$/, "ZIP code must be 5 digits")),
  newsletter: v.boolean(),
  theme: v.string(),
  notifications: v.string(),
});

export function MultiStepDemo() {
  const { Form, StepIndicator, stepNavigation } = createForm<MultiStepData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      newsletter: false,
      theme: "system",
      notifications: "email",
    },
    fields: [
      // Step 1: Personal Information
      { name: "firstName", label: "First Name", type: "text", placeholder: "John" },
      { name: "lastName", label: "Last Name", type: "text", placeholder: "Doe" },
      { name: "email", label: "Email", type: "email", placeholder: "john@example.com" },
      { name: "phone", label: "Phone", type: "text", placeholder: "+1 (555) 123-4567" },
      // Step 2: Address
      { name: "street", label: "Street Address", type: "text", placeholder: "123 Main St" },
      { name: "city", label: "City", type: "text", placeholder: "New York" },
      { name: "state", label: "State", type: "text", placeholder: "NY" },
      { name: "zipCode", label: "ZIP Code", type: "text", placeholder: "10001" },
      // Step 3: Preferences
      { name: "newsletter", label: "Subscribe to newsletter", type: "checkbox" },
      {
        name: "theme",
        label: "Theme Preference",
        type: "select",
        options: [
          { label: "System Default", value: "system" },
          { label: "Light Mode", value: "light" },
          { label: "Dark Mode", value: "dark" },
        ],
      },
      {
        name: "notifications",
        label: "Notification Method",
        type: "select",
        options: [
          { label: "Email", value: "email" },
          { label: "SMS", value: "sms" },
          { label: "Push Notifications", value: "push" },
          { label: "None", value: "none" },
        ],
      },
    ],
    layout: {
      gap: "lg",
      sections: [
        {
          id: "personal",
          title: "Personal Information",
          description: "Tell us about yourself",
          columns: 2,
          fields: ["firstName", "lastName", "email", "phone"],
        },
        {
          id: "address",
          title: "Address",
          description: "Where should we ship to?",
          columns: 2,
          fields: ["street", "city", "state", "zipCode"],
        },
        {
          id: "preferences",
          title: "Preferences",
          description: "Customize your experience",
          columns: 1,
          fields: ["newsletter", "theme", "notifications"],
        },
      ],
      multiStep: {
        enabled: true,
        initialStep: 0,
        validationMode: "onNext",
        allowJumpToStep: false,
        stepLabels: ["Personal", "Address", "Preferences"],
      },
    },
    schema: multiStepSchema,
  });

  const handleSubmit = (data: MultiStepData) => {
    console.log("Multi-step form submitted:", data);
    alert(`Registration complete!\n\nWelcome, ${data.firstName}!`);
  };

  return (
    <div class="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Multi-Step Form</CardTitle>
          <CardDescription>
            Forms can be split into multiple steps with per-step validation. Each step must be valid
            before proceeding to the next.
          </CardDescription>
        </CardHeader>
        <CardContent class="max-w-2xl mx-auto space-y-6">
          {/* Step Indicator */}
          <StepIndicator variant="numbers" showLabels />

          {/* Form Content */}
          <Form onSubmit={handleSubmit} showSubmitButton={false} />

          {/* Navigation Buttons */}
          <div class="flex justify-between pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={stepNavigation?.prevStep}
              disabled={stepNavigation?.isFirstStep()}
            >
              Previous
            </Button>

            {stepNavigation?.isLastStep() ? (
              <Button
                type="button"
                onClick={() => {
                  document.querySelector("form")?.requestSubmit();
                }}
              >
                Complete Registration
              </Button>
            ) : (
              <Button type="button" onClick={stepNavigation?.nextStep}>
                Next Step
              </Button>
            )}
          </div>

          {/* Progress */}
          <div class="text-center text-sm text-muted-foreground">
            Step {(stepNavigation?.currentStep() ?? 0) + 1} of {stepNavigation?.totalSteps ?? 0}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step Indicator Variants</CardTitle>
        </CardHeader>
        <CardContent class="prose prose-sm dark:prose-invert max-w-none">
          <ul class="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <code class="text-xs bg-muted px-1 py-0.5 rounded">dots</code> - Simple circle
              indicators
            </li>
            <li>
              <code class="text-xs bg-muted px-1 py-0.5 rounded">numbers</code> - Numbered badges
              with checkmarks for completed
            </li>
            <li>
              <code class="text-xs bg-muted px-1 py-0.5 rounded">progress</code> - Progress bar with
              percentage
            </li>
            <li>
              <code class="text-xs bg-muted px-1 py-0.5 rounded">breadcrumb</code> - Slash-separated
              step links
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Multi-Step Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <pre class="text-xs bg-muted p-4 rounded-md overflow-auto">
            {`const { Form, StepIndicator, stepNavigation } = createForm({
  fields: [...],
  layout: {
    sections: [
      {
        id: "step1",
        title: "Personal Info",
        step: 0,  // Assign to step
        fields: ["firstName", "lastName"],
      },
      {
        id: "step2",
        title: "Address",
        step: 1,
        fields: ["street", "city"],
        // Optional: Custom step validation
        stepValidation: (values) => values.city.length > 0,
        // Optional: Skip this step conditionally
        skipIf: (values) => values.noAddress === true,
      },
    ],
    multiStep: {
      enabled: true,
      initialStep: 0,
      validationMode: "onNext",  // or "onChange" or "onSubmit"
      allowJumpToStep: false,    // Allow clicking indicator to jump
      stepLabels: ["Personal", "Address", "Done"],
    },
  },
});

// stepNavigation provides:
// - currentStep(), totalSteps
// - isFirstStep(), isLastStep()
// - nextStep(), prevStep(), goToStep(n)
// - getStepStatus(n), canGoToStep(n)`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
