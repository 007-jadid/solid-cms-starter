import { For, type JSX, Show } from "solid-js";
import { useAuth } from "~/features/context/auth";
import { useI18n } from "~/features/context/i18n";
import {
  type PermissionedAction,
  PermissionGuard,
  usePermissionedActions,
  usePermissions,
  withPermission,
} from "~/features/context/permissions";
import { Badge } from "~/features/ui/components/badge";
import { Button } from "~/features/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/features/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/features/ui/components/dropdown-menu";

// Demo data
interface Customer {
  id: string;
  name: string;
  email: string;
}

// Icons
const EditIcon = () => (
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
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const TrashIcon = () => (
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
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const EyeIcon = () => (
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
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const MoreIcon = () => (
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
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

function DisabledButton(props: { children?: JSX.Element }) {
  const { t } = useI18n();
  return (
    <Button variant="outline" disabled class="opacity-50 cursor-not-allowed">
      {props.children ?? t("permissions.noPermission")}
    </Button>
  );
}

const ProtectedEditButton = withPermission(Button, {
  action: "datatable.edit",
  FallbackComponent: DisabledButton,
});

/**
 * Permissions Demo
 *
 * Features demonstrated:
 * - PermissionGuard component (single, ALL, ANY modes)
 * - withPermission HOC for wrapping components
 * - usePermissionedActions hook for dynamic action filtering
 * - Permission check functions (can, hasPermissions)
 */
export function PermissionsDemo() {
  const auth = useAuth();
  const permissions = usePermissions();
  const { t } = useI18n();

  const customers: Customer[] = [
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
    { id: "3", name: "Bob Wilson", email: "bob@example.com" },
  ];

  const customerActions: PermissionedAction<Customer>[] = [
    {
      key: "view",
      label: "View",
      permission: "datatable.view",
      icon: EyeIcon,
      onClick: (row) => alert(`Viewing ${row.name}`),
    },
    {
      key: "edit",
      label: "Edit",
      permission: "datatable.edit",
      icon: EditIcon,
      onClick: (row) => alert(`Editing ${row.name}`),
    },
    {
      key: "delete",
      label: "Delete",
      permission: "users.manage",
      icon: TrashIcon,
      onClick: (row) => alert(`Deleting ${row.name}`),
      destructive: true,
    },
  ];

  const { getVisibleActions } = usePermissionedActions(customerActions);

  return (
    <div class="space-y-4">
      {/* Current User Info */}
      <Card>
        <CardHeader>
          <CardTitle>{t("permissions.currentUser")}</CardTitle>
          <CardDescription>{t("permissions.currentUserDesc")}</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center gap-4">
            <div class="size-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span class="text-lg font-semibold text-primary">
                {auth.state.user?.name?.[0] ?? "?"}
              </span>
            </div>
            <div>
              <p class="font-medium">{auth.state.user?.name}</p>
              <p class="text-sm text-muted-foreground">{auth.state.user?.email}</p>
            </div>
          </div>
          <div>
            <p class="text-sm font-medium mb-2">{t("permissions.roles")}</p>
            <div class="flex gap-2 flex-wrap">
              <For each={auth.state.user?.roles ?? []}>
                {(role) => <Badge variant="secondary">{role}</Badge>}
              </For>
            </div>
          </div>
          <div>
            <p class="text-sm font-medium mb-2">{t("permissions.permissionsLabel")}</p>
            <div class="flex gap-2 flex-wrap">
              <For each={permissions.permissions()}>
                {(perm) => (
                  <Badge variant="outline" class="font-mono text-xs">
                    {perm}
                  </Badge>
                )}
              </For>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PermissionGuard Demo */}
      <Card>
        <CardHeader>
          <CardTitle>{t("permissions.guardComponent")}</CardTitle>
          <CardDescription>{t("permissions.guardComponentDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4 md:grid-cols-3">
            <div class="p-4 border rounded-lg">
              <p class="text-sm font-medium mb-2">Single Permission (dashboard.view)</p>
              <PermissionGuard
                action="dashboard.view"
                fallback={<Badge variant="error">{t("permissions.noAccess")}</Badge>}
              >
                <Badge variant="default">{t("permissions.hasAccess")}</Badge>
              </PermissionGuard>
            </div>
            <div class="p-4 border rounded-lg">
              <p class="text-sm font-medium mb-2">Multiple - ALL Mode</p>
              <p class="text-xs text-muted-foreground mb-2">(datatable.view + datatable.edit)</p>
              <PermissionGuard
                actions={["datatable.view", "datatable.edit"]}
                mode="all"
                fallback={<Badge variant="error">{t("permissions.missingSome")}</Badge>}
              >
                <Badge variant="default">{t("permissions.hasBoth")}</Badge>
              </PermissionGuard>
            </div>
            <div class="p-4 border rounded-lg">
              <p class="text-sm font-medium mb-2">Multiple - ANY Mode</p>
              <p class="text-xs text-muted-foreground mb-2">(users.manage OR settings.view)</p>
              <PermissionGuard
                actions={["users.manage", "settings.view"]}
                mode="any"
                fallback={<Badge variant="error">{t("permissions.noAccess")}</Badge>}
              >
                <Badge variant="default">{t("permissions.hasAtLeastOne")}</Badge>
              </PermissionGuard>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* withPermission HOC Demo */}
      <Card>
        <CardHeader>
          <CardTitle>{t("permissions.withPermissionHoc")}</CardTitle>
          <CardDescription>{t("permissions.withPermissionHocDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex gap-4 items-center">
            <div>
              <p class="text-sm font-medium mb-2">Protected Edit Button (datatable.edit)</p>
              <ProtectedEditButton variant="default">
                <EditIcon />
                <span class="ml-2">{t("permissions.editRecord")}</span>
              </ProtectedEditButton>
            </div>
            <div>
              <p class="text-sm font-medium mb-2">Regular Button (no permission)</p>
              <Button variant="outline">
                <EyeIcon />
                <span class="ml-2">{t("permissions.viewRecord")}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DataTable Actions Demo */}
      <Card>
        <CardHeader>
          <CardTitle>{t("permissions.dataTableActions")}</CardTitle>
          <CardDescription>{t("permissions.dataTableActionsDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="border rounded-lg overflow-hidden">
            <table class="w-full">
              <thead class="bg-muted/50">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th class="px-4 py-3 text-left text-sm font-medium">Email</th>
                  <th class="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <For each={customers}>
                  {(customer) => (
                    <tr class="border-t">
                      <td class="px-4 py-3 text-sm">{customer.name}</td>
                      <td class="px-4 py-3 text-sm text-muted-foreground">{customer.email}</td>
                      <td class="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger as={Button} variant="ghost" size="sm">
                            <MoreIcon />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <For each={getVisibleActions()}>
                              {(action, index) => (
                                <>
                                  <Show when={action.destructive && index() > 0}>
                                    <DropdownMenuSeparator />
                                  </Show>
                                  <DropdownMenuItem
                                    onClick={() => action.onClick(customer)}
                                    class={action.destructive ? "text-destructive" : ""}
                                  >
                                    <Show when={action.icon}>
                                      <span class="mr-2">{action.icon!()}</span>
                                    </Show>
                                    {action.label}
                                  </DropdownMenuItem>
                                </>
                              )}
                            </For>
                            <Show when={getVisibleActions().length === 0}>
                              <DropdownMenuItem disabled>
                                {t("permissions.noActionsAvailable")}
                              </DropdownMenuItem>
                            </Show>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
          <div class="mt-4 p-4 bg-muted/50 rounded-lg">
            <p class="text-sm font-medium mb-2">{t("permissions.visibleActions")}</p>
            <div class="flex gap-2 flex-wrap">
              <For each={getVisibleActions()}>
                {(action) => (
                  <Badge variant={action.destructive ? "error" : "secondary"}>
                    {action.label} ({action.permission})
                  </Badge>
                )}
              </For>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permission Check Functions */}
      <Card>
        <CardHeader>
          <CardTitle>{t("permissions.checkFunctions")}</CardTitle>
          <CardDescription>{t("permissions.checkFunctionsDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="p-4 border rounded-lg space-y-2">
              <p class="font-medium">can() / hasPermission()</p>
              <code class="text-xs bg-muted px-2 py-1 rounded block">
                permissions.can("dashboard.view") = {String(permissions.can("dashboard.view"))}
              </code>
              <code class="text-xs bg-muted px-2 py-1 rounded block">
                permissions.can("admin.super") = {String(permissions.can("admin.super"))}
              </code>
            </div>
            <div class="p-4 border rounded-lg space-y-2">
              <p class="font-medium">hasPermissions()</p>
              <code class="text-xs bg-muted px-2 py-1 rounded block">
                hasPermissions(["dashboard.view", "form.view"], "all") ={" "}
                {String(permissions.hasPermissions(["dashboard.view", "form.view"], "all"))}
              </code>
              <code class="text-xs bg-muted px-2 py-1 rounded block">
                hasPermissions(["admin.super", "dashboard.view"], "any") ={" "}
                {String(permissions.hasPermissions(["admin.super", "dashboard.view"], "any"))}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <pre class="text-xs bg-muted p-4 rounded-md overflow-auto">
            {`// 1. PermissionGuard — declarative show/hide
<PermissionGuard action="datatable.edit" fallback={<span>No access</span>}>
  <EditButton />
</PermissionGuard>

// 2. withPermission HOC — wrap any component
const ProtectedButton = withPermission(Button, {
  action: "datatable.edit",
  FallbackComponent: DisabledButton,
});

// 3. usePermissionedActions — filter actions list
const actions: PermissionedAction<T>[] = [
  { key: "edit", label: "Edit", permission: "datatable.edit", onClick: ... },
  { key: "delete", label: "Delete", permission: "users.manage", onClick: ... },
];
const { getVisibleActions } = usePermissionedActions(actions);

// 4. Imperative checks
const { can, hasPermissions } = usePermissions();
if (can("datatable.edit")) { ... }
if (hasPermissions(["a", "b"], "all")) { ... }`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
