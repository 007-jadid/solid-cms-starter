import { toLocalDateInputValue } from "~/features/lib/date-time";
import type { FieldConfig, FormConfig } from "~/features/ui/form/types";
import { type OnboardingData, onboardingSchema } from "../schemas";

export const onboardingFields: FieldConfig<OnboardingData>[] = [
  { name: "fullName", label: "Full Name", type: "text", required: true },
  {
    name: "dateOfBirth",
    label: "Date of Birth",
    type: "date",
    required: true,
    dateConfig: { maxDate: toLocalDateInputValue(new Date()) },
  },
  { name: "email", label: "Email Address", type: "email", required: true },
  {
    name: "phone",
    label: "Phone Number",
    type: "text",
    required: true,
    placeholder: "+1 (555) 000-0000",
  },
  {
    name: "newsletter",
    label: "Subscribe to newsletter",
    type: "switch",
    description: "Receive updates and promotions via email",
  },
  {
    name: "theme",
    label: "Preferred Theme",
    type: "select",
    required: true,
    options: [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
      { label: "System", value: "system" },
    ],
  },
];

export const onboardingFormConfig: FormConfig<OnboardingData> = {
  defaultValues: {
    fullName: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    newsletter: false,
    theme: "system",
  },
  schema: onboardingSchema,
  fields: onboardingFields,
  layout: {
    gap: "lg",
    multiStep: {
      enabled: true,
      validationMode: "onNext",
      allowJumpToStep: false,
    },
    sections: [
      {
        id: "step1",
        title: "Personal Info",
        description: "Tell us about yourself",
        columns: 1,
        fields: ["fullName", "dateOfBirth"],
      },
      {
        id: "step2",
        title: "Contact",
        description: "How can we reach you?",
        columns: 1,
        fields: ["email", "phone"],
      },
      {
        id: "step3",
        title: "Preferences",
        description: "Customize your experience",
        columns: 1,
        fields: ["newsletter", "theme"],
      },
    ],
  },
  onSubmit: async (values) => {
    console.log("Onboarding completed:", values);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    alert(`Welcome aboard!\n\n${JSON.stringify(values, null, 2)}`);
  },
  submitLabel: "Complete Setup",
};
