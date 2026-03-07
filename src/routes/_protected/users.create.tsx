import { createFileRoute, Link } from "@tanstack/solid-router";
import { Show } from "solid-js";
import { useI18n } from "~/features/context/i18n";
import { Button } from "~/features/ui/components/button";
import { createForm } from "~/features/ui/form/form-factory";
import { useLayout } from "~/features/ui/layout/layout.context";
import { userCreateFormConfig } from "~/features/users";

export const Route = createFileRoute("/_protected/users/create")({
  component: UserCreatePanel,
});

function UserCreatePanel() {
  const { t } = useI18n();
  const layout = useLayout();
  const { Form } = createForm(userCreateFormConfig);

  return (
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold">{t("users.createUser")}</h2>
          <p class="text-sm text-muted-foreground">{t("users.form.personalInfo")}</p>
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
      <Form />
    </div>
  );
}
