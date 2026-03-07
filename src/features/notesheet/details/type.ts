export interface DetailsResponse {
  code: number;
  data: Data;
  message: string;
  pagination: Record<string, unknown> | null;
  span_id: string;
  status: boolean;
  trace_id: string;
}

export interface Data {
  id: number;
  supplier: Supplier;
  transfer_cost: string;
  delivery_mode: DeliveryMode;
  description: string;
  attachment: string;
  notesheet_number: string;
  status: string;
  notesheet_items: NotesheetItem[];
  created_by: CreatedBy;
  updated_by: UpdatedBy;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: number;
  name: string;
  company: string;
}

export interface DeliveryMode {
  id: number;
  name: string;
}

export interface NotesheetItem {
  id: number;
  notesheet_id: number;
  product_id: number;
  product_name: string;
  thumb: string;
  variant_id: number;
  sku: string;
  unit_price: string;
  vat: string;
  discount: string;
  created_at: string;
  updated_at: string;
}

export interface CreatedBy {
  id: number;
  name: string;
}

export interface UpdatedBy {
  id: number;
  name: string;
}
