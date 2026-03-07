import * as v from "valibot";

export const complexFormSchema = v.pipe(
  v.object({
    // Personal Info
    firstName: v.pipe(v.string(), v.minLength(1, "First name is required")),
    lastName: v.pipe(v.string(), v.minLength(1, "Last name is required")),
    email: v.pipe(v.string(), v.email("Invalid email address")),
    phone: v.optional(v.string()),
    dateOfBirth: v.pipe(v.string(), v.minLength(1, "Date of birth is required")),
    bio: v.optional(v.string()),

    // Address
    country: v.pipe(v.string(), v.minLength(1, "Country is required")),
    state: v.optional(v.string()),
    city: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    addressLine: v.optional(v.string()),

    // Employment
    isEmployed: v.boolean(),
    companyName: v.optional(v.string()),
    jobTitle: v.optional(v.string()),
    yearsOfExperience: v.optional(v.number()),
    salary: v.optional(v.number()),

    // Preferences
    theme: v.picklist(["light", "dark", "system"]),
    language: v.picklist(["en", "bn"]),
    notifications: v.boolean(),
    newsletter: v.boolean(),

    // Skills (array)
    skills: v.array(
      v.object({
        name: v.pipe(v.string(), v.minLength(1, "Skill name is required")),
        level: v.picklist(["beginner", "intermediate", "advanced"]),
      }),
    ),

    // Security
    password: v.pipe(v.string(), v.minLength(8, "Password must be at least 8 characters")),
    confirmPassword: v.string(),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["confirmPassword"]],
      (input) => input.password === input.confirmPassword,
      "Passwords must match",
    ),
    ["confirmPassword"],
  ),
);

export type ComplexFormData = v.InferOutput<typeof complexFormSchema>;
