import { createFileRoute, Link } from "@tanstack/solid-router";
import { For } from "solid-js";
import { useI18n } from "~/features/context/i18n";
import { fadeIn, hoverLift, staggerChildren } from "~/features/lib/gsap-directives";
import { Card, CardDescription, CardHeader, CardTitle } from "~/features/ui/components/card";
import { DemoBanner } from "~/features/ui/components/demo-banner";

void fadeIn;
void hoverLift;
void staggerChildren;

export const Route = createFileRoute("/_protected/")({
  component: IndexComponent,
});

const quickLinks = [
  {
    titleKey: "home.quickLinks.viewDashboard",
    descKey: "home.quickLinks.viewDashboardDesc",
    href: "/dashboard",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3.75 6v1.5a.75.75 0 0 0 .75.75H19.5a.75.75 0 0 0 .75-.75V6M3.75 10.5v1.5a.75.75 0 0 0 .75.75H19.5a.75.75 0 0 0 .75-.75v-1.5M3.75 15v1.5a.75.75 0 0 0 .75.75H19.5a.75.75 0 0 0 .75-.75V15"
        />
      </svg>
    ),
  },
  {
    titleKey: "home.quickLinks.manageUsers",
    descKey: "home.quickLinks.manageUsersDesc",
    href: "/users",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
        />
      </svg>
    ),
  },
  {
    titleKey: "home.quickLinks.featureShowcase",
    descKey: "home.quickLinks.featureShowcaseDesc",
    href: "/demo",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
        />
      </svg>
    ),
  },
  {
    titleKey: "home.quickLinks.systemSettings",
    descKey: "home.quickLinks.systemSettingsDesc",
    href: "/settings",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.127c-.332.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
        />
      </svg>
    ),
  },
];

function IndexComponent() {
  const { t } = useI18n();

  return (
    <div class="mx-auto max-w-4xl py-12">
      <DemoBanner class="mb-8" />
      <div class="mb-12 text-center" use:fadeIn={{ y: 8, duration: 0.22 }}>
        <h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl">{t("home.title")}</h1>
        <p class="mt-4 text-xl text-muted-foreground">{t("home.subtitle")}</p>
        <div class="mt-8 flex justify-center gap-4">
          <Link
            to="/dashboard"
            class="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {t("home.getStarted")}
          </Link>
          <a
            href="https://github.com/your-org/cms-boilerplate-solid"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {t("home.documentation")}
          </a>
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-2" use:staggerChildren={{ stagger: 0.05 }}>
        <For each={quickLinks}>
          {(link) => (
            <Link to={link.href} use:hoverLift={{ y: -2 }}>
              <Card class="transition-all hover:border-primary/50 hover:bg-muted/50">
                <CardHeader class="flex flex-row items-center gap-4 space-y-0">
                  <div class="rounded-lg bg-primary/10 p-2 text-primary">{link.icon()}</div>
                  <div>
                    <CardTitle class="text-lg">{t(link.titleKey)}</CardTitle>
                    <CardDescription>{t(link.descKey)}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          )}
        </For>
      </div>

      <div
        class="mt-16 rounded-xl border bg-card p-8 text-card-foreground shadow-sm"
        use:fadeIn={{ y: 8, duration: 0.22, delay: 0.12 }}
      >
        <h2 class="mb-4 text-2xl font-semibold">{t("home.projectHighlights")}</h2>
        <div class="grid gap-8 md:grid-cols-3" use:staggerChildren={{ stagger: 0.05, delay: 0.05 }}>
          <div>
            <h3 class="font-medium">{t("home.highlights.tanstackRouter")}</h3>
            <p class="mt-2 text-sm text-muted-foreground">
              {t("home.highlights.tanstackRouterDesc")}
            </p>
          </div>
          <div>
            <h3 class="font-medium">{t("home.highlights.modularArch")}</h3>
            <p class="mt-2 text-sm text-muted-foreground">{t("home.highlights.modularArchDesc")}</p>
          </div>
          <div>
            <h3 class="font-medium">{t("home.highlights.builtInAuth")}</h3>
            <p class="mt-2 text-sm text-muted-foreground">{t("home.highlights.builtInAuthDesc")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
