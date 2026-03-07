import { createFileRoute, useNavigate, useSearch } from "@tanstack/solid-router";
import { valibotValidator } from "@tanstack/valibot-adapter";
import { Show } from "solid-js";
import { createStore } from "solid-js/store";
import * as v from "valibot";
import { useAuth } from "~/features/context/auth";
import { useI18n } from "~/features/context/i18n";
import { fadeIn, scaleIn, staggerChildren } from "~/features/lib/gsap-directives";
import { Button } from "~/features/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/features/ui/components/card";
import { Input } from "~/features/ui/components/input";
import { Label } from "~/features/ui/components/label";

// Register directives (SolidJS tree-shaking guard)
void fadeIn;
void scaleIn;
void staggerChildren;

export const Route = createFileRoute("/_auth/auth/login")({
  component: RouteComponent,
  validateSearch: valibotValidator(
    v.object({
      redirect: v.optional(v.string()),
    }),
  ),
});

function RouteComponent() {
  const auth = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ from: "/_auth/auth/login" });
  const { t } = useI18n();
  const [form, setForm] = createStore({
    email: "admin@demo.com",
    password: "demo",
    error: null as string | null,
    isLoading: false,
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setForm("error", null);
    setForm("isLoading", true);
    try {
      const ok = await auth.login({
        email: form.email,
        password: form.password,
      });
      if (ok) {
        const redirectUrl = search().redirect || "/dashboard";
        navigate({ to: redirectUrl });
      } else {
        setForm("error", t("login.invalidCredentials"));
      }
    } finally {
      setForm("isLoading", false);
    }
  };

  return (
    <div class="space-y-6" use:fadeIn>
      <div class="flex flex-col space-y-2 text-center">
        <h1 class="text-3xl font-bold tracking-tight">{t("login.welcomeBack")}</h1>
        <p class="text-sm text-muted-foreground">{t("login.subtitle")}</p>
      </div>
      <Card class="border-none shadow-xl ring-1 ring-border/50" use:scaleIn={{ delay: 0.15 }}>
        <CardHeader>
          <CardTitle class="text-xl">{t("login.signIn")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Show when={form.error}>
            <div class="mb-4 rounded-lg bg-destructive/10 p-4 text-sm font-medium text-destructive">
              {form.error}
            </div>
          </Show>
          <form onSubmit={handleSubmit} class="space-y-4" use:staggerChildren={{ delay: 0.25 }}>
            <div class="space-y-2">
              <Label for="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onInput={(e) => setForm("email", e.currentTarget.value)}
                placeholder="you@example.com"
              />
            </div>
            <div class="space-y-2">
              <Label for="password">{t("auth.password")}</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onInput={(e) => setForm("password", e.currentTarget.value)}
                placeholder="••••••"
              />
            </div>
            <Button type="submit" class="w-full" disabled={form.isLoading} size="lg">
              {form.isLoading ? t("login.signingIn") : t("auth.login")}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div class="grid grid-cols-2 gap-4 text-xs" use:fadeIn={{ delay: 0.45, y: 8 }}>
        <div class="rounded-md bg-muted p-2 text-center">
          <div class="font-medium">{t("login.userHint")}</div>
          <div class="text-muted-foreground">admin@demo.com</div>
        </div>
        <div class="rounded-md bg-muted p-2 text-center">
          <div class="font-medium">{t("login.passHint")}</div>
          <div class="text-muted-foreground">demo</div>
        </div>
      </div>
    </div>
  );
}
