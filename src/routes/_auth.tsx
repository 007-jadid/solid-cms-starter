import { createFileRoute, Outlet, redirect } from "@tanstack/solid-router";
import { AuthLayout } from "~/features/ui/layout/auth-layout";

export const Route = createFileRoute("/_auth")({
  // Already authenticated — send to dashboard instead of showing login.
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated()) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
