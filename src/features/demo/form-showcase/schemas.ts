import * as v from "valibot";

// ============================================
// 1. Basic Customer Form Schema
// ============================================
export const customerSchema = v.object({
  firstName: v.pipe(v.string(), v.minLength(1, "First name required")),
  lastName: v.pipe(v.string(), v.minLength(1, "Last name required")),
  email: v.pipe(v.string(), v.email("Invalid email")),
  phone: v.optional(v.string()),
  status: v.picklist(["active", "inactive"]),
  notes: v.optional(v.string()),
  country: v.optional(v.string()),
  state: v.optional(v.string()),
  paymentMethod: v.picklist(["credit", "bank"]),
  cardNumber: v.optional(v.string()),
  bankAccount: v.optional(v.string()),
});

export type CustomerData = v.InferOutput<typeof customerSchema>;

// ============================================
// 2. Computed Fields Schema
// ============================================
export const orderSchema = v.object({
  productName: v.pipe(v.string(), v.minLength(1, "Product name required")),
  quantity: v.pipe(v.number(), v.minValue(1, "Quantity must be at least 1")),
  unitPrice: v.pipe(v.number(), v.minValue(0, "Price must be positive")),
  discount: v.optional(v.pipe(v.number(), v.minValue(0), v.maxValue(100))),
  total: v.number(),
});

export type OrderData = v.InferOutput<typeof orderSchema>;

// ============================================
// 3. Multi-Step Wizard Schema
// ============================================
export const onboardingSchema = v.object({
  fullName: v.pipe(v.string(), v.minLength(1, "Name required")),
  dateOfBirth: v.pipe(v.string(), v.minLength(1, "Date of birth required")),
  email: v.pipe(v.string(), v.email("Invalid email")),
  phone: v.pipe(v.string(), v.minLength(10, "Phone must be at least 10 characters")),
  newsletter: v.boolean(),
  theme: v.picklist(["light", "dark", "system"]),
});

export type OnboardingData = v.InferOutput<typeof onboardingSchema>;

// ============================================
// 4. Advanced Fields Schema
// ============================================
export const advancedSchema = v.object({
  startDate: v.pipe(v.string(), v.minLength(1, "Start date required")),
  dateRange: v.optional(
    v.object({
      start: v.optional(v.string()),
      end: v.optional(v.string()),
    }),
  ),
  appointmentTime: v.optional(v.string()),
  rating: v.pipe(v.number(), v.minValue(0), v.maxValue(10)),
  verificationCode: v.pipe(v.string(), v.length(6, "Code must be 6 digits")),
  budget: v.pipe(v.number(), v.minValue(0), v.maxValue(1000000)),
});

export type AdvancedData = v.InferOutput<typeof advancedSchema>;

// ============================================
// 5. Array Fields Schema
// ============================================
export const teamSchema = v.object({
  teamName: v.pipe(v.string(), v.minLength(1, "Team name required")),
  members: v.array(
    v.object({
      name: v.string(),
      email: v.string(),
      role: v.string(),
    }),
  ),
});

export type TeamData = v.InferOutput<typeof teamSchema>;
