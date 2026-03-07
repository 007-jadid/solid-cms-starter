import { For, Show } from "solid-js";
import { useI18n } from "~/features/context/i18n";
import { cms } from "~/features/core";
import { pressScale } from "~/features/lib/gsap-directives";
import { Button } from "../../components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/dropdown-menu";
import { ThemeToggle } from "../../components/theme-toggle";

void pressScale;

const CheckIcon = () => (
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
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export function NavActions() {
  const { locale, setLocale } = useI18n();

  return (
    <div class="flex items-center gap-1 px-3">
      {/* Locale dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger
          as={Button}
          variant="ghost"
          size="sm"
          use:pressScale={{ scale: 0.96 }}
          class="h-9 w-9 px-0 font-medium text-[11px] text-muted-foreground hover:text-foreground border border-border/40 bg-white dark:bg-card hover:bg-accent dark:hover:bg-accent"
        >
          {locale() === "en" ? "EN" : "বাং"}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            class="flex items-center justify-between gap-2"
            onSelect={() => setLocale("en")}
          >
            English
            <Show when={locale() === "en"}>
              <CheckIcon />
            </Show>
          </DropdownMenuItem>
          <DropdownMenuItem
            class="flex items-center justify-between gap-2"
            onSelect={() => setLocale("bn")}
          >
            বাংলা
            <Show when={locale() === "bn"}>
              <CheckIcon />
            </Show>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Plugin-provided nav actions (notification bell, connection dots, etc.) */}
      <For each={cms.navActions}>{(Action) => <Action />}</For>

      <ThemeToggle />
    </div>
  );
}
