import type { FieldConfig, FormConfig } from "~/features/ui/form/types";
import { type OrderData, orderSchema } from "../schemas";

export const orderFields: FieldConfig<OrderData>[] = [
  { name: "productName", label: "Product Name", type: "text", required: true },
  {
    name: "quantity",
    label: "Quantity",
    type: "number",
    required: true,
    numberConfig: { min: 1, max: 100, step: 1 },
  },
  {
    name: "unitPrice",
    label: "Unit Price ($)",
    type: "number",
    required: true,
    numberConfig: { min: 0, step: 0.01 },
  },
  {
    name: "discount",
    label: "Discount (%)",
    type: "slider",
    sliderConfig: { min: 0, max: 50, step: 5, showValue: true },
  },
  {
    name: "total",
    label: "Total ($)",
    type: "number",
    disabled: true,
    description: "Automatically calculated: quantity × unitPrice × (1 - discount/100)",
    computed: {
      dependencies: ["quantity", "unitPrice", "discount"],
      compute: (values) => {
        const qty = values.quantity || 0;
        const price = values.unitPrice || 0;
        const disc = values.discount || 0;
        return Math.round(qty * price * (1 - disc / 100) * 100) / 100;
      },
    },
  },
];

export const orderFormConfig: FormConfig<OrderData> = {
  defaultValues: { productName: "", quantity: 1, unitPrice: 0, discount: 0, total: 0 },
  schema: orderSchema,
  fields: orderFields,
  layout: {
    gap: "md",
    sections: [
      {
        id: "order",
        title: "Order Details",
        description: "Enter product and pricing information",
        columns: 2,
        fields: ["productName", "quantity", "unitPrice", "discount", "total"],
      },
    ],
  },
  onSubmit: async (values) => {
    console.log("Order submitted:", values);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(`Order placed!\n\n${JSON.stringify(values, null, 2)}`);
  },
  submitLabel: "Place Order",
};
