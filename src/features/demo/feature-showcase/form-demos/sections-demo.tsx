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
 * Section-Based Layout Demo
 *
 * Features demonstrated:
 * - Organized form sections with titles
 * - Section descriptions
 * - Per-section column configuration
 * - Custom section styling
 */

interface ProfileFormData {
  // Personal
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  // Work
  company?: string;
  jobTitle?: string;
  department?: string;
  employeeId?: string;
  // Social
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
  // Bio
  bio?: string;
}

const profileSchema = v.object({
  firstName: v.pipe(v.string(), v.minLength(1, "Required")),
  lastName: v.pipe(v.string(), v.minLength(1, "Required")),
  email: v.pipe(v.string(), v.email("Invalid email")),
  phone: v.optional(v.string()),
  company: v.optional(v.string()),
  jobTitle: v.optional(v.string()),
  department: v.optional(v.string()),
  employeeId: v.optional(v.string()),
  linkedin: v.union([v.pipe(v.string(), v.url()), v.literal("")]),
  twitter: v.optional(v.string()),
  github: v.optional(v.string()),
  website: v.union([v.pipe(v.string(), v.url()), v.literal("")]),
  bio: v.optional(v.pipe(v.string(), v.maxLength(500, "Bio must be under 500 characters"))),
});

export function SectionsDemo() {
  const { Form } = createForm<ProfileFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      jobTitle: "",
      department: "",
      employeeId: "",
      linkedin: "",
      twitter: "",
      github: "",
      website: "",
      bio: "",
    },
    fields: [
      // Personal fields
      { name: "firstName", label: "First Name", type: "text", placeholder: "John" },
      { name: "lastName", label: "Last Name", type: "text", placeholder: "Doe" },
      { name: "email", label: "Email", type: "email", placeholder: "john@example.com" },
      { name: "phone", label: "Phone", type: "text", placeholder: "+1 (555) 123-4567" },
      // Work fields
      { name: "company", label: "Company", type: "text", placeholder: "Acme Inc." },
      { name: "jobTitle", label: "Job Title", type: "text", placeholder: "Software Engineer" },
      { name: "department", label: "Department", type: "text", placeholder: "Engineering" },
      { name: "employeeId", label: "Employee ID", type: "text", placeholder: "EMP-001" },
      // Social fields
      {
        name: "linkedin",
        label: "LinkedIn",
        type: "text",
        placeholder: "https://linkedin.com/in/...",
      },
      { name: "twitter", label: "Twitter/X", type: "text", placeholder: "@username" },
      { name: "github", label: "GitHub", type: "text", placeholder: "username" },
      { name: "website", label: "Personal Website", type: "text", placeholder: "https://..." },
      // Bio
      {
        name: "bio",
        label: "Bio",
        type: "textarea",
        placeholder: "Tell us about yourself...",
        colSpan: 2,
      },
    ],
    layout: {
      gap: "lg",
      sections: [
        {
          id: "personal",
          title: "Personal Information",
          description: "Your basic contact details",
          columns: 2,
          fields: ["firstName", "lastName", "email", "phone"],
        },
        {
          id: "work",
          title: "Work Information",
          description: "Your professional details",
          columns: 4,
          fields: ["company", "jobTitle", "department", "employeeId"],
        },
        {
          id: "social",
          title: "Social Profiles",
          description: "Connect your social media accounts",
          columns: 2,
          fields: ["linkedin", "twitter", "github", "website"],
        },
        {
          id: "bio",
          title: "About You",
          description: "A brief description visible on your profile",
          columns: 2,
          fields: ["bio"],
        },
      ],
    },
    schema: profileSchema,
  });

  const handleSubmit = (data: ProfileFormData) => {
    console.log("Profile data:", data);
    alert(
      `Profile Updated!\n\n${data.firstName} ${data.lastName}\n${data.email}\n${data.company ? `@ ${data.company}` : ""}`,
    );
  };

  return (
    <div class="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Section-Based Layout</CardTitle>
          <CardDescription>
            Forms can be organized into logical sections with titles, descriptions, and independent
            column configurations. Great for complex forms with many fields.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Section Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <pre class="text-xs bg-muted p-4 rounded-md overflow-auto">
            {`const { Form } = createForm({
  fields: [...],
  layout: {
    gap: "lg",  // "sm" | "md" | "lg"
    sectionClassName: "custom-class",  // Apply to all sections
    sections: [
      {
        id: "personal",           // Unique identifier
        title: "Personal Info",   // Section heading
        description: "...",       // Optional description
        columns: 2,               // Grid columns for this section
        fields: ["firstName", "lastName", "email"],
        className: "bg-muted/50", // Custom styling for section
      },
      {
        id: "address",
        title: "Address",
        columns: 4,  // Different column count
        fields: ["street", "city", "state", "zip"],
      },
    ],
  },
});`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Field ColSpan</CardTitle>
        </CardHeader>
        <CardContent class="prose prose-sm dark:prose-invert max-w-none">
          <p class="text-sm text-muted-foreground mb-4">
            Individual fields can span multiple columns using the{" "}
            <code class="text-xs bg-muted px-1 py-0.5 rounded">colSpan</code> property:
          </p>
          <pre class="text-xs bg-muted p-4 rounded-md overflow-auto">
            {`{
  name: "description",
  label: "Description",
  type: "textarea",
  colSpan: 2,  // Span 2 columns in the grid
}

// In a 4-column section:
// colSpan: 1 = 25% width
// colSpan: 2 = 50% width
// colSpan: 4 = 100% width (full row)`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Layout Features</CardTitle>
        </CardHeader>
        <CardContent class="prose prose-sm dark:prose-invert max-w-none">
          <ul class="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>Sections:</strong> Group related fields with titles and descriptions
            </li>
            <li>
              <strong>Per-section columns:</strong> Each section can have different column counts
            </li>
            <li>
              <strong>Gap sizes:</strong> Control spacing between sections (sm, md, lg)
            </li>
            <li>
              <strong>ColSpan:</strong> Fields can span multiple columns
            </li>
            <li>
              <strong>Orphan handling:</strong> Fields not in any section are auto-rendered
            </li>
            <li>
              <strong>Responsive:</strong> Grid adapts to screen size with Tailwind breakpoints
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
