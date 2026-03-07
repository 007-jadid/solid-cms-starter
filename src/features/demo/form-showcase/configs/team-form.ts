import type { FieldConfig, FormConfig } from "~/features/ui/form/types";
import { type TeamData, teamSchema } from "../schemas";

export const teamFields: FieldConfig<TeamData>[] = [
  { name: "teamName", label: "Team Name", type: "text", required: true },
  {
    name: "members",
    label: "Team Members",
    type: "array",
    description: "Add team members with their details",
    arrayConfig: {
      minItems: 1,
      maxItems: 10,
      addLabel: "Add Member",
      removeLabel: "Remove",
      itemFields: [
        { name: "name", label: "Name", type: "text", placeholder: "John Doe" },
        { name: "email", label: "Email", type: "email", placeholder: "john@example.com" },
        { name: "role", label: "Role", type: "text", placeholder: "Developer" },
      ],
    },
  },
];

export const teamFormConfig: FormConfig<TeamData> = {
  defaultValues: { teamName: "", members: [] },
  schema: teamSchema,
  fields: teamFields,
  layout: {
    gap: "lg",
    sections: [{ id: "team", title: "Team Information", columns: 1, fields: ["teamName"] }],
  },
  onSubmit: async (values) => {
    console.log("Team form submitted:", values);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(`Team created!\n\n${JSON.stringify(values, null, 2)}`);
  },
  submitLabel: "Create Team",
};
