import { useNavigate } from "@tanstack/solid-router";
import { createSignal, onCleanup, onMount } from "solid-js";
import { useI18n } from "~/features/context/i18n";
import { pressScale } from "~/features/lib/gsap-directives";
import { cn } from "~/features/lib/utils";
import { Button } from "../../components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "../../components/command";
import { Dialog, DialogContent } from "../../components/dialog";
import { useLayout } from "../layout.context";

void pressScale;

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="size-4"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const PanelLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="size-4 text-muted-foreground"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M9 3v18" />
  </svg>
);

interface NavSearchProps {
  onSetSettingsOpen: (open: boolean) => void;
}

export function NavSearch(props: NavSearchProps) {
  const [searchOpen, setSearchOpen] = createSignal(false);
  const navigate = useNavigate();
  const layout = useLayout();
  const { t } = useI18n();

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  onMount(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    onCleanup(() => window.removeEventListener("keydown", handleKeyDown));
  });

  return (
    <>
      <div class="flex flex-1 items-center justify-center px-4">
        <Button
          variant="ghost"
          onClick={() => setSearchOpen(true)}
          use:pressScale={{ scale: 0.985 }}
          class={cn(
            "h-10 w-full max-w-xs justify-start gap-3 border border-border/60 bg-white px-3 font-normal",
            "hover:border-border hover:bg-muted/50",
            "dark:bg-card",
          )}
        >
          <SearchIcon />
          <span class="flex-1 text-left text-muted-foreground/70">{t("search.placeholder")}</span>
          <kbd class="hidden h-5 items-center gap-0.5 rounded border border-border/60 bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
            <span class="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      <Dialog open={searchOpen()} onOpenChange={setSearchOpen}>
        <DialogContent class="max-w-lg overflow-hidden border-0 p-0 shadow-2xl" hideCloseButton>
          <Command>
            <CommandInput placeholder={t("search.commandsPlaceholder")} />
            <CommandList>
              <CommandEmpty />
              <CommandGroup heading={t("search.navigationGroup")}>
                <CommandItem
                  onSelect={() => {
                    navigate({ to: "/dashboard" });
                    setSearchOpen(false);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="size-4 text-muted-foreground"
                  >
                    <rect width="7" height="9" x="3" y="3" rx="1" />
                    <rect width="7" height="5" x="14" y="3" rx="1" />
                    <rect width="7" height="9" x="14" y="12" rx="1" />
                    <rect width="7" height="5" x="3" y="16" rx="1" />
                  </svg>
                  <span>{t("nav.dashboard")}</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    navigate({ to: "/settings" });
                    setSearchOpen(false);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="size-4 text-muted-foreground"
                  >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span>{t("nav.settings")}</span>
                </CommandItem>
              </CommandGroup>
              <CommandGroup heading={t("search.actionsGroup")}>
                <CommandItem
                  onSelect={() => {
                    layout.toggleSidebar();
                    setSearchOpen(false);
                  }}
                >
                  <PanelLeftIcon />
                  <span>{t("search.toggleSidebar")}</span>
                  <CommandShortcut>⌘B</CommandShortcut>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    setSearchOpen(false);
                    (document.activeElement as HTMLElement | null)?.blur?.();
                    requestAnimationFrame(() => props.onSetSettingsOpen(true));
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="size-4 text-muted-foreground"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                  </svg>
                  <span>{t("search.appearanceSettings")}</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
