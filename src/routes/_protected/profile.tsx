import { createFileRoute } from "@tanstack/solid-router";
import { Show } from "solid-js";
import { useAuth } from "~/features/context/auth/auth.context";
import { useI18n } from "~/features/context/i18n";
import { fadeIn, hoverLift, staggerChildren } from "~/features/lib/gsap-directives";
import type { AuditLogEntry } from "~/features/ui/components/audit-log";
import { AuditLog } from "~/features/ui/components/audit-log";
import { Avatar, AvatarFallback, AvatarImage } from "~/features/ui/components/avatar";
import { Badge } from "~/features/ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/features/ui/components/card";
import { Separator } from "~/features/ui/components/separator";
import { StatCard } from "~/features/ui/components/stat-card";
import { PageLayout } from "~/features/ui/layout";

void fadeIn;
void hoverLift;
void staggerChildren;

export const Route = createFileRoute("/_protected/profile")({
  component: ProfilePage,
});

const demoActivity: AuditLogEntry[] = [
  {
    id: "1",
    user: "You",
    action: "login",
    resource: "Dashboard",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    user: "You",
    action: "update",
    resource: "User Settings",
    detail: "Changed theme to dark mode",
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    user: "You",
    action: "create",
    resource: "Report: Q4 Revenue",
    timestamp: "Yesterday",
  },
  {
    id: "4",
    user: "You",
    action: "export",
    resource: "Users CSV",
    detail: "Exported 1,234 records",
    timestamp: "2 days ago",
  },
];

function ProfilePage() {
  const auth = useAuth();
  const { t } = useI18n();

  const initials = () => {
    const user = auth.state.user;
    if (!user) return "?";
    return (
      `${user.firstName?.charAt(0) ?? ""}${user.lastName?.charAt(0) ?? ""}`.toUpperCase() ||
      user.name?.charAt(0)?.toUpperCase() ||
      "?"
    );
  };

  return (
    <PageLayout
      class="space-y-8 p-6"
      title={t("profile.title")}
      description={t("profile.description")}
    >
      <div class="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div class="lg:col-span-1" use:fadeIn={{ y: 12 }}>
          <Card>
            <CardContent class="flex flex-col items-center gap-4 p-6 text-center">
              <Avatar class="size-20">
                <Show when={auth.state.user?.avatar}>
                  {(avatar) => <AvatarImage src={avatar()} alt={auth.state.user?.name} />}
                </Show>
                <AvatarFallback class="text-xl">{initials()}</AvatarFallback>
              </Avatar>

              <div class="space-y-1">
                <h2 class="text-lg font-semibold">{auth.state.user?.name ?? "—"}</h2>
                <p class="text-sm text-muted-foreground">{auth.state.user?.email ?? "—"}</p>
              </div>

              <div class="flex flex-wrap justify-center gap-2">
                <Show when={auth.state.user?.role}>
                  <Badge variant="secondary">{auth.state.user!.role}</Badge>
                </Show>
              </div>

              <Separator />

              <div class="w-full space-y-3 text-left text-sm">
                <div class="flex justify-between">
                  <span class="text-muted-foreground">{t("profile.fields.name")}</span>
                  <span class="font-medium">{auth.state.user?.name ?? "—"}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">{t("profile.fields.email")}</span>
                  <span class="font-medium">{auth.state.user?.email ?? "—"}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">{t("profile.fields.role")}</span>
                  <span class="font-medium">{auth.state.user?.role ?? "—"}</span>
                </div>
                <Show when={auth.state.user?.roles?.length}>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">{t("profile.fields.roles")}</span>
                    <div class="flex flex-wrap justify-end gap-1">
                      {auth.state.user!.roles.map((r) => (
                        <Badge variant="outline" class="text-[11px]">
                          {r}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Show>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div class="space-y-6 lg:col-span-2">
          {/* Stats */}
          <div class="grid gap-4 sm:grid-cols-3" use:staggerChildren={{ stagger: 0.08 }}>
            <div use:hoverLift>
              <StatCard
                title={t("profile.stats.sessions")}
                value="142"
                trend={{ value: "+12%", direction: "up" }}
                description={t("profile.stats.last30Days")}
              />
            </div>
            <div use:hoverLift>
              <StatCard
                title={t("profile.stats.actions")}
                value="1,847"
                trend={{ value: "+8%", direction: "up" }}
                description={t("profile.stats.last30Days")}
              />
            </div>
            <div use:hoverLift>
              <StatCard
                title={t("profile.stats.permissions")}
                value={String(auth.state.user?.permissions?.length ?? 0)}
                description={t("profile.stats.granted")}
              />
            </div>
          </div>

          {/* Activity Log */}
          <Card use:fadeIn={{ y: 12, delay: 0.2 }}>
            <CardHeader>
              <CardTitle>{t("profile.recentActivity")}</CardTitle>
            </CardHeader>
            <CardContent>
              <AuditLog entries={demoActivity} />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
