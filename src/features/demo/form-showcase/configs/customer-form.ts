import type { FieldConfig, FormConfig } from "~/features/ui/form/types";
import { type CustomerData, customerSchema } from "../schemas";

export const customerFields: FieldConfig<CustomerData>[] = [
  { name: "firstName", label: "First Name", type: "text", required: true, colSpan: 1 },
  { name: "lastName", label: "Last Name", type: "text", required: true, colSpan: 1 },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "text", placeholder: "+1 (555) 000-0000" },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
  {
    name: "notes",
    label: "Notes",
    type: "textarea",
    description: "Internal notes about the customer",
    rows: 3,
  },
  {
    name: "country",
    label: "Country",
    type: "select",
    options: [
      { label: "United States", value: "usa" },
      { label: "Canada", value: "canada" },
      { label: "United Kingdom", value: "uk" },
    ],
  },
  {
    name: "state",
    label: "State/Province",
    type: "text",
    placeholder: "Enter state or province",
    dependsOn: "country",
  },
  {
    name: "paymentMethod",
    label: "Payment Method",
    type: "select",
    required: true,
    options: [
      { label: "Credit Card", value: "credit" },
      { label: "Bank Transfer", value: "bank" },
    ],
  },
  {
    name: "cardNumber",
    label: "Card Number",
    type: "text",
    placeholder: "4242 4242 4242 4242",
    hidden: (values) => values.paymentMethod !== "credit",
  },
  {
    name: "bankAccount",
    label: "Bank Account Number",
    type: "text",
    placeholder: "Enter bank account number",
    hidden: (values) => values.paymentMethod !== "bank",
  },
];

export const customerFormConfig: FormConfig<CustomerData> = {
  defaultValues: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "active",
    notes: "",
    country: "",
    state: "",
    paymentMethod: "credit",
    cardNumber: "",
    bankAccount: "",
  },
  schema: customerSchema,
  fields: customerFields,
  layout: {
    gap: "lg",
    sections: [
      {
        id: "personal",
        title: "Personal Information",
        description: "Basic customer details",
        columns: 2,
        fields: ["firstName", "lastName", "email", "phone"],
      },
      { id: "address", title: "Address", columns: 2, fields: ["country", "state"] },
      {
        id: "payment",
        title: "Payment Details",
        description: "Select preferred payment method",
        columns: 1,
        fields: ["paymentMethod", "cardNumber", "bankAccount"],
      },
      { id: "settings", title: "Additional Settings", columns: 1, fields: ["status", "notes"] },
    ],
  },
  effects: [
    {
      watch: ["country"],
      handler: (_values, form) => {
        form.setValue("state", "");
      },
    },
    {
      watch: ["paymentMethod"],
      handler: (values, form) => {
        if (values.paymentMethod !== "credit") form.setValue("cardNumber", "");
        if (values.paymentMethod !== "bank") form.setValue("bankAccount", "");
      },
    },
  ],
  onSubmit: async (values) => {
    console.log("Customer form submitted:", values);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    alert(`Customer saved!\n\n${JSON.stringify(values, null, 2)}`);
  },
  submitLabel: "Save Customer",
};
