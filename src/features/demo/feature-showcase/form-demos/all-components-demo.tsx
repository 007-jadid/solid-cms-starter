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
 * All Form Components Demo
 *
 * A comprehensive showcase of every form field type available in the system.
 * Use this page to visually verify consistency and discover all available components.
 */

// ────────────────────────────────────────────
// 1. Text Inputs Section
// ────────────────────────────────────────────

interface TextInputsData {
  fullName: string;
  email: string;
  password: string;
  bio: string;
  phone: string;
  website: string;
  searchQuery: string;
}

const textInputsSchema = v.object({
  fullName: v.pipe(v.string(), v.minLength(1, "Name is required")),
  email: v.pipe(v.string(), v.email("Invalid email address")),
  password: v.pipe(v.string(), v.minLength(8, "Password must be at least 8 characters")),
  bio: v.pipe(v.string(), v.minLength(10, "Bio must be at least 10 characters")),
  phone: v.pipe(v.string(), v.minLength(10, "Phone number must be 10 digits")),
  website: v.union([v.pipe(v.string(), v.url("Invalid URL")), v.literal("")]),
  searchQuery: v.string(),
});

function TextInputsSection() {
  const { Form } = createForm<TextInputsData>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      bio: "",
      phone: "",
      website: "",
      searchQuery: "",
    },
    fields: [
      {
        name: "fullName",
        label: "Full Name",
        type: "text",
        placeholder: "John Doe",
        description: "Your legal full name",
        required: true,
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        placeholder: "john@example.com",
        required: true,
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter a secure password",
        description: "Must be at least 8 characters",
        required: true,
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "phone",
        placeholder: "(555) 123-4567",
        description: "Auto-formats as you type",
        required: true,
      },
      {
        name: "website",
        label: "Website URL",
        type: "url",
        placeholder: "https://example.com",
        description: "Shows validation status indicator",
      },
      {
        name: "searchQuery",
        label: "Search",
        type: "search",
        placeholder: "Search anything...",
        description: "With clear button",
      },
      {
        name: "bio",
        label: "Bio / About",
        type: "textarea",
        placeholder: "Tell us about yourself...",
        rows: 4,
        colSpan: 2,
      },
    ],
    columns: 2,
    schema: textInputsSchema,
    submitLabel: "Save Text Fields",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Text Inputs</CardTitle>
        <CardDescription>
          Text, Email, Password, Phone, URL, Search, and Textarea fields.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          onSubmit={(data) => {
            console.log("Text inputs:", data);
            alert("Text inputs submitted!");
          }}
        />
      </CardContent>
    </Card>
  );
}

// ────────────────────────────────────────────
// 2. Selection & Choice Section
// ────────────────────────────────────────────

interface SelectionData {
  country: string;
  priority: string;
  notifications: boolean;
  darkMode: boolean;
}

function SelectionSection() {
  const { Form } = createForm<SelectionData>({
    defaultValues: {
      country: "",
      priority: "",
      notifications: true,
      darkMode: false,
    },
    fields: [
      {
        name: "country",
        label: "Country",
        type: "select",
        placeholder: "Select a country",
        required: true,
        options: [
          { label: "United States", value: "us" },
          { label: "United Kingdom", value: "uk" },
          { label: "Canada", value: "ca" },
          { label: "Australia", value: "au" },
          { label: "Germany", value: "de" },
          { label: "France", value: "fr" },
          { label: "Japan", value: "jp" },
          { label: "Brazil", value: "br" },
        ],
      },
      {
        name: "priority",
        label: "Priority Level",
        type: "radio-group",
        required: true,
        description: "Choose the priority for this task",
        options: [
          { label: "Low - No rush", value: "low" },
          { label: "Medium - Normal priority", value: "medium" },
          { label: "High - Needs attention", value: "high" },
          { label: "Critical - Urgent", value: "critical" },
        ],
      },
      {
        name: "notifications",
        label: "Enable Notifications",
        type: "checkbox",
        description: "Receive email notifications for updates",
      },
      {
        name: "darkMode",
        label: "Dark Mode",
        type: "switch",
        description: "Use dark theme across the application",
      },
    ],
    columns: 2,
    submitLabel: "Save Preferences",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selection & Choice</CardTitle>
        <CardDescription>
          Select dropdown, Radio group, Checkbox, and Switch fields.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          onSubmit={(data) => {
            console.log("Selection data:", data);
            alert("Selection preferences saved!");
          }}
        />
      </CardContent>
    </Card>
  );
}

// ────────────────────────────────────────────
// 3. Numeric & Range Section
// ────────────────────────────────────────────

interface NumericData {
  quantity: number;
  price: number;
  satisfaction: number;
  rating: number;
}

function NumericSection() {
  const { Form } = createForm<NumericData>({
    defaultValues: {
      quantity: 1,
      price: 0,
      satisfaction: 50,
      rating: 0,
    },
    fields: [
      {
        name: "quantity",
        label: "Quantity",
        type: "number",
        description: "With increment/decrement controls",
        required: true,
        numberConfig: {
          min: 1,
          max: 100,
          step: 1,
        },
      },
      {
        name: "price",
        label: "Price (USD)",
        type: "number",
        description: "Formatted as currency",
        required: true,
        numberConfig: {
          min: 0,
          max: 10000,
          step: 0.01,
          formatOptions: {
            style: "currency",
            currency: "USD",
          },
        },
      },
      {
        name: "satisfaction",
        label: "Satisfaction Level",
        type: "slider",
        description: "Drag to select a value",
        sliderConfig: {
          min: 0,
          max: 100,
          step: 5,
          showValue: true,
        },
      },
      {
        name: "rating",
        label: "Overall Rating",
        type: "rating",
        description: "Click a star to rate, click again to remove",
        required: true,
        ratingConfig: {
          max: 5,
        },
      },
    ],
    columns: 2,
    submitLabel: "Save Values",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Numeric & Range</CardTitle>
        <CardDescription>Number field with controls, Slider, and Star rating.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          onSubmit={(data) => {
            console.log("Numeric data:", data);
            alert("Numeric values saved!");
          }}
        />
      </CardContent>
    </Card>
  );
}

// ────────────────────────────────────────────
// 4. Date & Time Section
// ────────────────────────────────────────────

interface DateTimeData {
  startDate: string;
  meetingTime: string;
  appointment: string;
  dateRange: { start?: string; end?: string };
}

function DateTimeSection() {
  const { Form } = createForm<DateTimeData>({
    defaultValues: {
      startDate: "",
      meetingTime: "",
      appointment: "",
      dateRange: {},
    },
    fields: [
      {
        name: "startDate",
        label: "Start Date",
        type: "date",
        description: "Select a date",
        required: true,
      },
      {
        name: "meetingTime",
        label: "Meeting Time",
        type: "time",
        description: "Select a time",
        required: true,
      },
      {
        name: "appointment",
        label: "Appointment",
        type: "datetime",
        description: "Pick both date and time",
        colSpan: 2,
      },
      {
        name: "dateRange",
        label: "Date Range",
        type: "date-range",
        description: "Select start and end dates",
        colSpan: 2,
        dateConfig: {
          minDate: "2024-01-01",
          maxDate: "2026-12-31",
        },
      },
    ],
    columns: 2,
    submitLabel: "Save Dates",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Date & Time</CardTitle>
        <CardDescription>
          Date picker, Time picker, DateTime combined, and Date range fields.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          onSubmit={(data) => {
            console.log("Date/Time data:", data);
            alert("Dates saved!");
          }}
        />
      </CardContent>
    </Card>
  );
}

// ────────────────────────────────────────────
// 5. Special Inputs Section
// ────────────────────────────────────────────

interface SpecialData {
  otp: string;
  brandColor: string;
  tags: string[];
  documents: { name: string; size: number; type: string }[];
}

function SpecialInputsSection() {
  const { Form } = createForm<SpecialData>({
    defaultValues: {
      otp: "",
      brandColor: "#3b82f6",
      tags: ["solidjs", "typescript"],
      documents: [],
    },
    fields: [
      {
        name: "otp",
        label: "Verification Code",
        type: "otp",
        description: "Enter the 6-digit code sent to your email",
        required: true,
        otpConfig: {
          length: 6,
        },
      },
      {
        name: "brandColor",
        label: "Brand Color",
        type: "color",
        description: "Pick a color or enter a hex value",
        colorConfig: {
          presets: [
            "#ef4444",
            "#f97316",
            "#f59e0b",
            "#eab308",
            "#84cc16",
            "#22c55e",
            "#14b8a6",
            "#06b6d4",
            "#3b82f6",
            "#6366f1",
            "#8b5cf6",
            "#a855f7",
            "#d946ef",
            "#ec4899",
            "#f43f5e",
            "#000000",
          ],
        },
      },
      {
        name: "tags",
        label: "Tags",
        type: "tags",
        description: "Add relevant tags for categorization",
        placeholder: "Add a tag...",
        colSpan: 2,
        tagsConfig: {
          maxTags: 8,
          allowDuplicates: false,
        },
      },
      {
        name: "documents",
        label: "Upload Documents",
        type: "file",
        description: "Upload project files (PDF, images, documents)",
        colSpan: 2,
        fileConfig: {
          accept: ".pdf,.png,.jpg,.jpeg,.doc,.docx",
          multiple: true,
          maxSize: 5 * 1024 * 1024,
          maxFiles: 3,
        },
      },
    ],
    columns: 2,
    submitLabel: "Save All",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Special Inputs</CardTitle>
        <CardDescription>
          OTP/PIN, Color picker, Tags/Multi-input, and File upload fields.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          onSubmit={(data) => {
            console.log("Special data:", data);
            alert("Special inputs saved!");
          }}
        />
      </CardContent>
    </Card>
  );
}

// ────────────────────────────────────────────
// 6. Kitchen Sink — All types in one form
// ────────────────────────────────────────────

interface KitchenSinkData {
  name: string;
  email: string;
  phone: string;
  website: string;
  role: string;
  plan: string;
  terms: boolean;
  newsletter: boolean;
  experience: number;
  rating: number;
  startDate: string;
  themeColor: string;
  skills: string[];
}

function KitchenSinkSection() {
  const { Form } = createForm<KitchenSinkData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      website: "",
      role: "",
      plan: "",
      terms: false,
      newsletter: true,
      experience: 3,
      rating: 0,
      startDate: "",
      themeColor: "#3b82f6",
      skills: [],
    },
    fields: [
      { name: "name", label: "Name", type: "text", placeholder: "Your name", required: true },
      { name: "email", label: "Email", type: "email", placeholder: "you@co.com", required: true },
      { name: "phone", label: "Phone", type: "phone" },
      { name: "website", label: "Website", type: "url", placeholder: "https://..." },
      {
        name: "role",
        label: "Role",
        type: "select",
        options: [
          { label: "Developer", value: "dev" },
          { label: "Designer", value: "design" },
          { label: "Product Manager", value: "pm" },
          { label: "QA Engineer", value: "qa" },
        ],
      },
      {
        name: "plan",
        label: "Plan",
        type: "radio-group",
        options: [
          { label: "Free", value: "free" },
          { label: "Pro ($9/mo)", value: "pro" },
          { label: "Enterprise", value: "enterprise" },
        ],
      },
      {
        name: "experience",
        label: "Years of Experience",
        type: "slider",
        sliderConfig: { min: 0, max: 20, step: 1, showValue: true },
      },
      { name: "rating", label: "Self Rating", type: "rating", ratingConfig: { max: 5 } },
      { name: "startDate", label: "Available From", type: "date" },
      { name: "themeColor", label: "Preferred Color", type: "color" },
      {
        name: "skills",
        label: "Skills",
        type: "tags",
        placeholder: "Add skill...",
        colSpan: 2,
        tagsConfig: { maxTags: 6 },
      },
      { name: "terms", label: "I agree to terms & conditions", type: "checkbox", required: true },
      { name: "newsletter", label: "Subscribe to newsletter", type: "switch" },
    ],
    columns: 2,
    submitLabel: "Submit Application",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kitchen Sink</CardTitle>
        <CardDescription>
          All field types combined in a single form — the ultimate integration test.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          onSubmit={(data) => {
            console.log("Kitchen sink:", data);
            alert(`Application submitted!\n\n${JSON.stringify(data, null, 2)}`);
          }}
        />
      </CardContent>
    </Card>
  );
}

// ────────────────────────────────────────────
// Main Export
// ────────────────────────────────────────────

export function AllComponentsDemo() {
  return (
    <div class="space-y-8">
      <div class="space-y-1">
        <h2 class="text-2xl font-bold tracking-tight">All Form Components</h2>
        <p class="text-muted-foreground">
          Complete catalogue of every form field type available in the system. All components come
          from the centralized <code class="text-xs bg-muted px-1 py-0.5 rounded">createForm</code>{" "}
          factory — ensuring consistent design, validation, and behavior.
        </p>
      </div>

      {/* Component count summary */}
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Text Fields",
            count: "7",
            types: "text, email, password, phone, url, search, textarea",
          },
          { label: "Selection", count: "4", types: "select, radio-group, checkbox, switch" },
          { label: "Numeric", count: "3", types: "number, slider, rating" },
          {
            label: "Special",
            count: "9",
            types: "date, time, datetime, date-range, otp, color, tags, file, array",
          },
        ].map((item) => (
          <div class="rounded-lg border border-input p-4 text-center">
            <div class="text-2xl font-bold">{item.count}</div>
            <div class="text-sm font-medium">{item.label}</div>
            <div class="text-xs text-muted-foreground mt-1">{item.types}</div>
          </div>
        ))}
      </div>

      <TextInputsSection />
      <SelectionSection />
      <NumericSection />
      <DateTimeSection />
      <SpecialInputsSection />
      <KitchenSinkSection />
    </div>
  );
}
