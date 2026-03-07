/**
 * Query Hook Tests
 *
 * Tests useGet, usePost and useLazyGet against a mocked apiClient.
 */

import { render, screen, waitFor } from "@solidjs/testing-library";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import type { JSX } from "solid-js";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the apiClient module so no real HTTP calls are made
vi.mock("~/features/lib/api-client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import { useGet, useLazyGet, usePost } from "~/features/hooks/query";
import { apiClient } from "~/features/lib/api-client";

// Helper: wraps children in a fresh QueryClientProvider for each test
function makeWrapper(children: () => JSX.Element) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return () => <QueryClientProvider client={client}>{children()}</QueryClientProvider>;
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ── Test 1: useGet fetches and renders data ───────────────────────────────────

describe("useGet", () => {
  it("fetches data and makes it available", async () => {
    (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ name: "Alice" });

    function TestComponent() {
      const q = useGet<{ name: string }>("/api/user");
      return <div>{q.isSuccess ? <span>{q.data?.name}</span> : <span>loading</span>}</div>;
    }

    render(makeWrapper(() => <TestComponent />));

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    expect(apiClient.get).toHaveBeenCalledWith("/api/user", expect.any(Object));
  });
});

// ── Test 2: usePost mutation calls endpoint with payload ─────────────────────

describe("usePost", () => {
  it("calls the API endpoint with the given payload on mutate()", async () => {
    (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 42 });

    let mutateFn: ((p: { title: string }) => void) | undefined;

    function TestComponent() {
      const m = usePost<{ id: number }, Error, { title: string }>("/api/posts");
      mutateFn = (p) => m.mutate(p);
      return <div>{m.data ? <span>created-{m.data.id}</span> : null}</div>;
    }

    render(makeWrapper(() => <TestComponent />));

    mutateFn!({ title: "Hello World" });

    await waitFor(() => {
      expect(screen.getByText("created-42")).toBeInTheDocument();
    });

    expect(apiClient.post).toHaveBeenCalledWith("/api/posts", { title: "Hello World" });
  });
});

// ── Test 3: useLazyGet does not fetch until trigger() is called ──────────────

describe("useLazyGet", () => {
  it("does not call the API before trigger() is invoked", async () => {
    (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 1 });

    let triggerFn: (() => void) | undefined;

    function TestComponent() {
      const [trigger, q] = useLazyGet<{ id: number }>("/api/item/1");
      triggerFn = () => void trigger();
      return <div>{q.isSuccess ? <span>loaded-{q.data?.id}</span> : <span>idle</span>}</div>;
    }

    render(makeWrapper(() => <TestComponent />));

    // Before trigger — no fetch should have occurred
    expect(apiClient.get).not.toHaveBeenCalled();
    expect(screen.getByText("idle")).toBeInTheDocument();

    // Trigger the fetch
    triggerFn!();

    await waitFor(() => {
      expect(screen.getByText("loaded-1")).toBeInTheDocument();
    });

    expect(apiClient.get).toHaveBeenCalledTimes(1);
  });
});
