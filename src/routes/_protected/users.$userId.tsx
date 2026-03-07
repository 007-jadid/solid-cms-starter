import { createFileRoute, Link } from "@tanstack/solid-router";
import { Show } from "solid-js";
import { useI18n } from "~/features/context/i18n";
import { ActivityTimeline } from "~/features/ui/components/activity-timeline";
import { Badge } from "~/features/ui/components/badge";
import { Button } from "~/features/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/features/ui/components/card";
import { useLayout } from "~/features/ui/layout/layout.context";
import { MOCK_USERS } from "~/features/users";

const statusVariant: Record<string, "default" | "secondary" | "error"> = {
  active: "default",
  inactive: "secondary",
  suspended: "error",
};

export const Route = createFileRoute("/_protected/users/$userId")({
  component: UserProfilePanel,
});

function UserProfilePanel() {
  const { t } = useI18n();
  const layout = useLayout();
  const params = Route.useParams();
  const user = () => MOCK_USERS.find((u) => u.id === params().userId);

  const activityItems = [
    { id: "1", user: "System", action: "Account created", time: "Jan 15, 2023", avatar: "SY" },
    {
      id: "2",
      user: "Admin",
      action: "Role updated to editor",
      time: "Mar 22, 2023",
      avatar: "AD",
    },
    { id: "3", user: "System", action: "Password changed", time: "Jun 10, 2023", avatar: "SY" },
    { id: "4", user: "Admin", action: "Department changed", time: "Sep 5, 2023", avatar: "AD" },
  ];

  return (
    <div class="space-y-6">
      {/* Panel header */}
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold">{t("users.userProfile")}</h2>
          <p class="text-sm text-muted-foreground">{user()?.name ?? ""}</p>
        </div>
        <Show
          when={layout.state.isMobile}
          fallback={
            <Link to="/users">
              <Button variant="ghost" size="icon" aria-label="Close">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="size-4"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </Button>
            </Link>
          }
        >
          <Link to="/users">
            <Button variant="outline" size="sm">
              {t("users.backToUsers")}
            </Button>
          </Link>
        </Show>
      </div>

      <Show
        when={user()}
        fallback={
          <Card>
            <CardContent class="p-8 text-center text-muted-foreground">
              {t("users.noUsers")}
            </CardContent>
          </Card>
        }
      >
        {(u) => (
          <>
            {/* User Info Card */}
            <Card>
              <CardContent class="flex items-center gap-4 p-6">
                <div class="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                  {u().avatar}
                </div>
                <div>
                  <h3 class="text-lg font-semibold">{u().name}</h3>
                  <p class="text-sm text-muted-foreground">{u().email}</p>
                  <div class="mt-2 flex gap-2">
                    <Badge variant={statusVariant[u().status] ?? "secondary"} class="capitalize">
                      {u().status}
                    </Badge>
                    <Badge variant="outline" class="capitalize">
                      {u().role}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle>{t("users.form.personalInfo")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="grid gap-4 sm:grid-cols-2">
                  <InfoRow label={t("users.columns.name")} value={u().name} />
                  <InfoRow label={t("users.columns.email")} value={u().email} />
                  <InfoRow label="Phone" value={u().phone} />
                  <InfoRow label={t("users.columns.department")} value={u().department} />
                  <InfoRow label={t("users.columns.role")} value={u().role} />
                  <InfoRow label={t("users.columns.status")} value={u().status} />
                  <InfoRow label={t("users.columns.joined")} value={u().joinDate} />
                  <InfoRow label={t("users.columns.lastActive")} value={u().lastActive} />
                </div>
                <p class="mt-4 text-sm text-muted-foreground">{u().bio}</p>
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>{t("users.activity")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityTimeline items={activityItems} />
              </CardContent>
            </Card>
          </>
        )}
      </Show>
    </div>
  );
}

function InfoRow(props: { label: string; value: string }) {
  return (
    <div>
      <dt class="text-xs font-medium text-muted-foreground">{props.label}</dt>
      <dd class="mt-0.5 text-sm font-medium capitalize">{props.value}</dd>
    </div>
  );
}
