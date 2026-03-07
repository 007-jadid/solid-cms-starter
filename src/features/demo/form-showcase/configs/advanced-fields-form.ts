import type { FieldConfig, FormConfig } from "~/features/ui/form/types";
import { type AdvancedData, advancedSchema } from "../schemas";

export const advancedFields: FieldConfig<AdvancedData>[] = [
  {
    name: "startDate",
    label: "Start Date",
    type: "date",
    required: true,
    description: "Select a date for the appointment",
  },
  {
    name: "dateRange",
    label: "Date Range",
    type: "date-range",
    description: "Select a range of dates",
  },
  {
    name: "appointmentTime",
    label: "Appointment Time",
    type: "time",
    description: "Select preferred time",
  },
  {
    name: "rating",
    label: "Rating",
    type: "slider",
    sliderConfig: { min: 0, max: 10, step: 1, showValue: true },
    description: "Rate from 0 to 10",
  },
  {
    name: "verificationCode",
    label: "Verification Code",
    type: "otp",
    required: true,
    otpConfig: { length: 6 },
    description: "Enter the 6-digit code",
  },
  {
    name: "budget",
    label: "Budget",
    type: "number",
    required: true,
    numberConfig: {
      min: 0,
      max: 1000000,
      step: 100,
      formatOptions: { style: "currency", currency: "USD" },
    },
    description: "Set your budget (0 - $1,000,000)",
  },
];

export const advancedFormConfig: FormConfig<AdvancedData> = {
  defaultValues: {
    startDate: "",
    dateRange: { start: "", end: "" },
    appointmentTime: "",
    rating: 5,
    verificationCode: "",
    budget: 1000,
  },
  schema: advancedSchema,
  fields: advancedFields,
  layout: {
    gap: "lg",
    sections: [
      {
        id: "dates",
        title: "Date & Time",
        description: "Various date and time field types",
        columns: 2,
        fields: ["startDate", "dateRange", "appointmentTime"],
      },
      {
        id: "inputs",
        title: "Advanced Inputs",
        description: "Slider, OTP, and number fields",
        columns: 2,
        fields: ["rating", "verificationCode", "budget"],
      },
    ],
  },
  onSubmit: async (values) => {
    console.log("Advanced form submitted:", values);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(`Form submitted!\n\n${JSON.stringify(values, null, 2)}`);
  },
  submitLabel: "Submit",
};
