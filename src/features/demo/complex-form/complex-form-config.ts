import type { FormConfig } from "~/features/ui/form/types";
import { type ComplexFormData, complexFormSchema } from "./complex-form-schema";

export const complexFormConfig: FormConfig<ComplexFormData> = {
  defaultValues: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    bio: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    addressLine: "",
    isEmployed: false,
    companyName: "",
    jobTitle: "",
    yearsOfExperience: 0,
    salary: 0,
    theme: "system",
    language: "en",
    notifications: true,
    newsletter: false,
    skills: [{ name: "", level: "beginner" }],
    password: "",
    confirmPassword: "",
  },
  schema: complexFormSchema,
  fields: [
    // Personal Info
    { name: "firstName", label: "First Name", type: "text", required: true, colSpan: 1 },
    { name: "lastName", label: "Last Name", type: "text", required: true, colSpan: 1 },
    { name: "email", label: "Email", type: "email", required: true, colSpan: 1 },
    { name: "phone", label: "Phone", type: "text", placeholder: "+1 (555) 000-0000", colSpan: 1 },
    { name: "dateOfBirth", label: "Date of Birth", type: "date", required: true, colSpan: 1 },
    {
      name: "bio",
      label: "Bio",
      type: "textarea",
      description: "Tell us about yourself",
      rows: 3,
      colSpan: 2,
    },

    // Address
    {
      name: "country",
      label: "Country",
      type: "select",
      required: true,
      colSpan: 1,
      options: [
        { label: "United States", value: "US" },
        { label: "United Kingdom", value: "UK" },
        { label: "Canada", value: "CA" },
        { label: "Australia", value: "AU" },
        { label: "Bangladesh", value: "BD" },
        { label: "India", value: "IN" },
      ],
    },
    { name: "state", label: "State / Province", type: "text", colSpan: 1 },
    { name: "city", label: "City", type: "text", colSpan: 1 },
    { name: "zipCode", label: "Zip Code", type: "text", colSpan: 1 },
    { name: "addressLine", label: "Address Line", type: "text", colSpan: 2 },

    // Employment
    { name: "isEmployed", label: "Currently Employed", type: "switch" },
    {
      name: "companyName",
      label: "Company Name",
      type: "text",
      colSpan: 1,
      showWhen: (values) => values.isEmployed,
    },
    {
      name: "jobTitle",
      label: "Job Title",
      type: "text",
      colSpan: 1,
      showWhen: (values) => values.isEmployed,
    },
    {
      name: "yearsOfExperience",
      label: "Years of Experience",
      type: "slider",
      colSpan: 1,
      showWhen: (values) => values.isEmployed,
      sliderConfig: { min: 0, max: 30, step: 1, showValue: true },
    },
    {
      name: "salary",
      label: "Annual Salary",
      type: "number",
      colSpan: 1,
      showWhen: (values) => values.isEmployed,
      numberConfig: {
        min: 0,
        max: 500000,
        step: 1000,
        formatOptions: { style: "currency", currency: "USD" },
      },
    },

    // Preferences
    {
      name: "theme",
      label: "Theme",
      type: "radio-group",
      colSpan: 1,
      options: [
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
        { label: "System", value: "system" },
      ],
    },
    {
      name: "language",
      label: "Language",
      type: "select",
      colSpan: 1,
      options: [
        { label: "English", value: "en" },
        { label: "Bengali", value: "bn" },
      ],
    },
    { name: "notifications", label: "Enable Notifications", type: "switch", colSpan: 1 },
    { name: "newsletter", label: "Subscribe to Newsletter", type: "checkbox", colSpan: 1 },

    // Skills (array)
    {
      name: "skills",
      label: "Skills",
      type: "array",
      arrayConfig: {
        itemFields: [
          { name: "name", label: "Skill Name", type: "text", required: true } as never,
          {
            name: "level",
            label: "Proficiency",
            type: "select",
            options: [
              { label: "Beginner", value: "beginner" },
              { label: "Intermediate", value: "intermediate" },
              { label: "Advanced", value: "advanced" },
            ],
          } as never,
        ],
        minItems: 1,
        maxItems: 10,
        addLabel: "Add Skill",
      },
    },

    // Security
    { name: "password", label: "Password", type: "password", required: true, colSpan: 1 },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      required: true,
      colSpan: 1,
    },
  ],
  layout: {
    gap: "lg",
    multiStep: {
      enabled: true,
      validationMode: "onNext",
      allowJumpToStep: true,
      stepLabels: ["Personal Info", "Address", "Employment", "Preferences", "Skills", "Security"],
    },
    sections: [
      {
        id: "personal",
        title: "Personal Information",
        description: "Your basic details",
        columns: 2,
        fields: ["firstName", "lastName", "email", "phone", "dateOfBirth", "bio"],
      },
      {
        id: "address",
        title: "Address",
        description: "Where you live",
        columns: 2,
        fields: ["country", "state", "city", "zipCode", "addressLine"],
      },
      {
        id: "employment",
        title: "Employment",
        description: "Your current work status",
        columns: 2,
        fields: ["isEmployed", "companyName", "jobTitle", "yearsOfExperience", "salary"],
      },
      {
        id: "preferences",
        title: "Preferences",
        description: "Customize your experience",
        columns: 2,
        fields: ["theme", "language", "notifications", "newsletter"],
      },
      {
        id: "skills",
        title: "Skills & Certifications",
        description: "Add your professional skills",
        columns: 1,
        fields: ["skills"],
      },
      {
        id: "security",
        title: "Security",
        description: "Set your password",
        columns: 2,
        fields: ["password", "confirmPassword"],
      },
    ],
  },
  effects: [
    {
      watch: ["isEmployed"],
      handler: (values, form) => {
        if (!values.isEmployed) {
          form.setValue("companyName", "");
          form.setValue("jobTitle", "");
          form.setValue("yearsOfExperience", 0);
          form.setValue("salary", 0);
        }
      },
    },
  ],
  onSubmit: async (values) => {
    if (import.meta.env.DEV) console.log("Complex form submitted:", values);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    alert(`Application submitted!\n\n${JSON.stringify(values, null, 2)}`);
  },
  submitLabel: "Submit Application",
};
