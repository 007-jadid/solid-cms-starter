import { useNavigate } from "@tanstack/solid-router";
import { createMemo } from "solid-js";
import { useAuth } from "~/features/context/auth/auth.context";
import { useI18n } from "~/features/context/i18n";
import { pressScale } from "~/features/lib/gsap-directives";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/avatar";
import { Button } from "../../components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/dropdown-menu";

void pressScale;

export function NavUserMenu(props: { onSetSettingsOpen: (open: boolean) => void }) {
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();

  // Generate user initials
  const userInitials = createMemo(() => {
    const name = auth.state.user?.name ?? "";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || "??";
  });

  // Avatar URL
  const avatarUrl = createMemo(() => {
    if (auth.state.user?.avatar) {
      return auth.state.user.avatar;
    }
    const seed = encodeURIComponent(auth.state.user?.name ?? "guest");
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  });

  return (
    <DropdownMenu placement="bottom-end">
      <DropdownMenuTrigger class="focus:outline-none">
        <Button
          variant="ghost"
          size="icon"
          use:pressScale={{ scale: 0.96 }}
          class="rounded-full bg-background p-1 hover:bg-accent"
        >
          <Avatar class="size-7 border border-border/60">
            <AvatarImage src={avatarUrl()} alt="User avatar" />
            <AvatarFallback class="text-[10px] font-medium">{userInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56">
        <DropdownMenuLabel class="font-normal">
          <div class="flex flex-col items-start gap-1">
            <p class="text-sm font-medium text-left">{auth.state.user?.name ?? "Guest"}</p>
            <p class="text-xs text-muted-foreground text-left">
              {auth.state.user?.email ?? "guest@example.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem class="gap-2" onSelect={() => navigate({ to: "/settings" })}>
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
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          {t("nav.profile")}
        </DropdownMenuItem>
        <DropdownMenuItem
          class="gap-2"
          onSelect={() => {
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
            class="size-4"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {t("nav.settings")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          class="gap-2 text-destructive focus:text-destructive"
          onSelect={() => {
            auth.logout();
            navigate({ to: "/auth/login", search: { redirect: undefined } });
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
            class="size-4"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {t("auth.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
