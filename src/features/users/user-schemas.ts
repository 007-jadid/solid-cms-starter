import * as v from "valibot";

export const userCreateSchema = v.pipe(
  v.object({
    name: v.pipe(v.string(), v.minLength(2, "Name must be at least 2 characters")),
    email: v.pipe(v.string(), v.email("Invalid email address")),
    role: v.picklist(["admin", "editor", "viewer"]),
    status: v.picklist(["active", "inactive"]),
    department: v.pipe(v.string(), v.minLength(1, "Department is required")),
    phone: v.optional(v.string()),
    bio: v.optional(v.string()),
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

export type UserCreateData = v.InferOutput<typeof userCreateSchema>;
