import { Link } from "@tanstack/solid-router";
import type { ColumnDef } from "@tanstack/solid-table";
import { createMemo, createSignal } from "solid-js";
import { useI18n } from "~/features/context/i18n";
import { formatDateDisplay } from "~/features/lib/date-time";
import { Badge } from "~/features/ui/components/badge";
import { Checkbox } from "~/features/ui/components/checkbox";
import { ConfirmActionDialog } from "~/features/ui/components/confirm-action-dialog";
import { DataTable } from "~/features/ui/data-table/data-table";
import { MOCK_USERS, type User } from "./mock-data";

const statusVariant: Record<
  string,
  "default" | "secondary" | "error" | "outline"
> = {
  active: "default",
  inactive: "secondary",
  suspended: "error",
};

const roleVariant: Record<string, "default" | "secondary" | "outline"> = {
  admin: "default",
  editor: "secondary",
  viewer: "outline",
};

interface UsersListProps {
  compact?: boolean;
  activeUserId?: string | null;
}

export function UsersList(props: UsersListProps) {
  const { t } = useI18n();
  const [rows, setRows] = createSignal(MOCK_USERS);
  const [deleteDialogOpen, setDeleteDialogOpen] = createSignal(false);
  const [userToDelete, setUserToDelete] = createSignal<User | null>(null);

  const handleDelete = async () => {
    const user = userToDelete();
    if (!user) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
    setRows((prev) => prev.filter((u) => u.id !== user.id));
    setUserToDelete(null);
  };

  const columns = createMemo((): ColumnDef<User, unknown>[] => {
    const selectCol: ColumnDef<User, unknown> = {
      id: "select",
      enableSorting: false,
      enableHiding: false,
      header: (info) => (
        <Checkbox
          checked={info.table.getIsAllPageRowsSelected()}
          indeterminate={info.table.getIsSomePageRowsSelected() && !info.table.getIsAllPageRowsSelected()}
          onChange={(value) => info.table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: (info) => (
        <Checkbox
          checked={info.row.getIsSelected()}
          onChange={(value) => info.row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    };

    const nameCol: ColumnDef<User, unknown> = {
      id: "name",
      header: t("users.columns.name"),
      accessorKey: "name",
      enableSorting: true,
      cell: (info) => (
        <Link
          to="/users/$userId"
          params={{ userId: info.row.original.id }}
          class="font-medium text-primary hover:underline"
        >
          <div class="flex items-center gap-2.5">
            <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {info.row.original.avatar}
            </div>
            <span>{String(info.getValue())}</span>
          </div>
        </Link>
      ),
    };

    const roleCol: ColumnDef<User, unknown> = {
      id: "role",
      header: t("users.columns.role"),
      accessorKey: "role",
      cell: (info) => {
        const role = String(info.getValue());
        return (
          <Badge variant={roleVariant[role] ?? "outline"} class="capitalize">
            {t(`users.filters.${role}` as "users.filters.admin")}
          </Badge>
        );
      },
    };

    const statusCol: ColumnDef<User, unknown> = {
      id: "status",
      header: t("users.columns.status"),
      accessorKey: "status",
      cell: (info) => {
        const status = String(info.getValue());
        return (
          <Badge
            variant={statusVariant[status] ?? "secondary"}
            class="capitalize"
          >
            {t(`users.filters.${status}` as "users.filters.active")}
          </Badge>
        );
      },
    };

    if (props.compact) {
      return [selectCol, nameCol, roleCol, statusCol];
    }

    return [
      selectCol,
      nameCol,
      {
        id: "email",
        header: t("users.columns.email"),
        accessorKey: "email",
        enableSorting: true,
      },
      roleCol,
      statusCol,
      {
        id: "department",
        header: t("users.columns.department"),
        accessorKey: "department",
        enableSorting: true,
      },
      {
        id: "joinDate",
        header: t("users.columns.joined"),
        accessorKey: "joinDate",
        enableSorting: true,
        cell: (info) => formatDateDisplay(String(info.getValue() ?? "")),
      },
    ];
  });

  return (
    <>
      <ConfirmActionDialog
        open={deleteDialogOpen()}
        onOpenChange={setDeleteDialogOpen}
        title={t("users.deleteConfirm.title")}
        description={t("users.deleteConfirm.description")}
        confirmLabel={t("users.deleteConfirm.confirm")}
        variant="destructive"
        onConfirm={handleDelete}
      />

      <DataTable<User, unknown>
        tableId="users"
        columns={columns()}
        data={rows()}
        enableRowSelection
        enableExport={!props.compact}
        exportFilename="users-export"
        searchKey="name"
        searchPlaceholder={`${t("common.search")} ${t("users.columns.name").toLowerCase()}...`}
        filterFields={[
          {
            label: t("users.filters.role"),
            value: "role",
            type: "select",
            options: [
              { label: t("users.filters.admin"), value: "admin" },
              { label: t("users.filters.editor"), value: "editor" },
              { label: t("users.filters.viewer"), value: "viewer" },
            ],
          },
          {
            label: t("users.filters.status"),
            value: "status",
            type: "select",
            options: [
              { label: t("users.filters.active"), value: "active" },
              { label: t("users.filters.inactive"), value: "inactive" },
              { label: t("users.filters.suspended"), value: "suspended" },
            ],
          },
          {
            label: t("users.filters.department"),
            value: "department",
            type: "select",
            options: [
              { label: "Engineering", value: "Engineering" },
              { label: "Marketing", value: "Marketing" },
              { label: "Sales", value: "Sales" },
              { label: "Support", value: "Support" },
              { label: "HR", value: "HR" },
              { label: "Finance", value: "Finance" },
              { label: "Design", value: "Design" },
              { label: "Product", value: "Product" },
            ],
          },
        ]}
        showTab={!props.compact}
        bulkActions={[
          {
            label: t("users.bulk.deleteSelected"),
            variant: "destructive",
            onClick: (selected) => {
              const ids = new Set(selected.map((u) => u.id));
              setRows((prev) => prev.filter((u) => !ids.has(u.id)));
            },
          },
          {
            label: t("users.bulk.deactivateSelected"),
            variant: "secondary",
            onClick: (selected) => {
              const ids = new Set(selected.map((u) => u.id));
              setRows((prev) =>
                prev.map((u) =>
                  ids.has(u.id) ? { ...u, status: "inactive" as const } : u,
                ),
              );
            },
          },
        ]}
      />
    </>
  );
}
