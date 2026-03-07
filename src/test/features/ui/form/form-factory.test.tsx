/**
 * Form Factory Tests
 *
 * Tests the core createForm() factory: field rendering, validation,
 * and multi-step navigation behaviour.
 */

import { fireEvent, render, screen } from "@solidjs/testing-library";
import * as v from "valibot";
import { describe, expect, it, vi } from "vitest";
import { createForm } from "~/features/ui/form/form-factory";

// ── Test 1: renders a text field with correct label ──────────────────────────

describe("createForm – text field", () => {
  it("renders the field label", () => {
    const form = createForm({
      fields: [{ name: "username" as const, label: "Username", type: "text" }],
      onSubmit: vi.fn(),
    });

    render(() => <form.Form />);

    expect(screen.getByText("Username")).toBeInTheDocument();
  });
});

// ── Test 2: does not call onSubmit when required schema validation fails ─────

describe("createForm – validation", () => {
  it("does not call onSubmit when a required field is empty", async () => {
    const onSubmit = vi.fn();
    const form = createForm({
      fields: [
        {
          name: "email" as const,
          label: "Email",
          type: "email",
          required: true,
        },
      ],
      schema: v.object({
        email: v.pipe(v.string(), v.minLength(1, "Email is required")),
      }),
      onSubmit,
    });

    render(() => <form.Form />);

    const submitBtn = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitBtn);

    // onSubmit should NOT have been called because validation failed
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

// ── Test 3: multi-step form advances when step 1 is valid ────────────────────

describe("createForm – multi-step", () => {
  it("advances to step 2 when step 1 fields are valid", async () => {
    const form = createForm({
      fields: [
        {
          name: "firstName" as const,
          label: "First Name",
          type: "text",
          defaultValue: "Jane",
        },
        { name: "lastName" as const, label: "Last Name", type: "text" },
      ],
      layout: {
        multiStep: {
          enabled: true,
          validationMode: "onNext",
        },
        sections: [
          { title: "Step 1", fields: ["firstName" as const] },
          { title: "Step 2", fields: ["lastName" as const] },
        ],
      },
      onSubmit: vi.fn(),
    });

    render(() => <form.Form />);

    // Step 1 should be visible
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.queryByText("Last Name")).not.toBeInTheDocument();

    const nextBtn = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextBtn);

    // After clicking next, step 2 should render
    expect(screen.getByText("Last Name")).toBeInTheDocument();
  });
});

// ── Test 4: multi-step stays on step 1 when schema validation fails ──────────

describe("createForm – multi-step validation", () => {
  it("stays on step 1 when a required field is empty", async () => {
    const form = createForm({
      fields: [
        {
          name: "requiredField" as const,
          label: "Required Field",
          type: "text",
          required: true,
        },
        { name: "otherField" as const, label: "Other Field", type: "text" },
      ],
      schema: v.object({
        requiredField: v.pipe(v.string(), v.minLength(1, "This field is required")),
        otherField: v.optional(v.string()),
      }),
      layout: {
        multiStep: {
          enabled: true,
          validationMode: "onNext",
        },
        sections: [
          { title: "Step 1", fields: ["requiredField" as const] },
          { title: "Step 2", fields: ["otherField" as const] },
        ],
      },
      onSubmit: vi.fn(),
    });

    render(() => <form.Form />);

    // Do NOT fill the required field, click next
    const nextBtn = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextBtn);

    // Should still be on step 1 — step 2 field should not render
    expect(screen.getByText("Required Field")).toBeInTheDocument();
    expect(screen.queryByText("Other Field")).not.toBeInTheDocument();
  });
});
