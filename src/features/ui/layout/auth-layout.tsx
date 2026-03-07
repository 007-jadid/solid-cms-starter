import type { JSX } from "solid-js";

const LogoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="size-12 text-primary"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

interface AuthLayoutProps {
  children: JSX.Element;
}

export function AuthLayout(props: AuthLayoutProps) {
  return (
    <div class="flex min-h-screen flex-col bg-background">
      {/* Header with logo */}
      <header class="flex items-center justify-center py-8">
        <a href="/" class="flex items-center gap-3">
          <LogoIcon />
          <span class="text-2xl font-bold">CMS Boilerplate</span>
        </a>
      </header>

      {/* Main content - centered */}
      <main class="flex flex-1 items-center justify-center px-4 pb-16">
        <div class="w-full max-w-md">{props.children}</div>
      </main>

      {/* Footer */}
      <footer class="py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} CMS Boilerplate. All rights reserved.</p>
      </footer>
    </div>
  );
}
