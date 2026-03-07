import type { FormConfig } from "~/features/ui/form/types";
import { type UserCreateData, userCreateSchema } from "./user-schemas";

export const userCreateFormConfig: FormConfig<UserCreateData> = {
  defaultValues: {
    name: "",
    email: "",
    role: "viewer",
    status: "active",
    department: "",
    phone: "",
    bio: "",
    password: "",
    confirmPassword: "",
  },
  schema: userCreateSchema,
  fields: [
    { name: "name", label: "Full Name", type: "text", required: true, colSpan: 1 },
    { name: "email", label: "Email Address", type: "email", required: true, colSpan: 1 },
    { name: "phone", label: "Phone", type: "text", placeholder: "+1 (555) 000-0000", colSpan: 1 },
    {
      name: "department",
      label: "Department",
      type: "select",
      required: true,
      colSpan: 1,
      options: [
        { label: "Engineering", value: "Engineering" },
        { label: "Marketing", value: "Marketing" },
        { label: "Sales", value: "Sales" },
        { label: "Support", value: "Support" },
        { label: "HR", value: "HR" },
        { label: "Finance", value: "Finance" },
        { label: "Design", value: "Design" },
        { label: "Product", value: "Product" },
      ],
    },
    {
      name: "bio",
      label: "Bio",
      type: "textarea",
      description: "A short description about the user",
      rows: 3,
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      required: true,
      colSpan: 1,
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
        { label: "Viewer", value: "viewer" },
      ],
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      colSpan: 1,
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
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
    gap: "xl",
    sections: [
      {
        id: "personal",
        title: "Personal Information",
        description: "Basic user details",
        columns: 2,
        fields: ["name", "email", "phone", "department", "bio"],
      },
      {
        id: "account",
        title: "Account Settings",
        description: "Role and access level",
        columns: 2,
        fields: ["role", "status"],
      },
      {
        id: "security",
        title: "Security",
        description: "Set the initial password",
        columns: 2,
        fields: ["password", "confirmPassword"],
      },
    ],
  },
  onSubmit: async (values) => {
    if (import.meta.env.DEV) console.log("User form submitted:", values);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    alert(`User created!\n\n${JSON.stringify(values, null, 2)}`);
  },
  submitLabel: "Create User",
};
