# Contributing

Thank you for considering contributing to CMS Boilerplate Solid! This guide will help you get started.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/007-jadid/solid-cms-starter.git
   cd solid-cms-starter
   ```
3. Install dependencies:
   ```bash
   bun install
   ```
4. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
5. Start the dev server:
   ```bash
   bun run dev
   ```

## Development Workflow

### Branch Naming

- `feat/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation changes
- `refactor/description` - Code refactoring

### Before Submitting a PR

Run all checks:

```bash
bun run lint        # Biome + ESLint
bun run test        # Vitest
bun run build       # Vite build + TypeScript check
```

### Code Style

- **TypeScript strict mode** is enabled; avoid `any` types
- **Biome** handles formatting (2-space indent, double quotes, semicolons)
- **ESLint** with `eslint-plugin-solid` catches SolidJS-specific issues
- Use **kebab-case** for file and directory names
- Use **barrel exports** (`index.ts`) in feature directories
- Follow SolidJS reactivity rules:
  - Never destructure props
  - Use `createMemo` for derived state, not `createEffect`
  - Use `on()` for explicit effect dependencies

### Component Conventions

- UI primitives go in `src/features/ui/components/`
- Use CVA (class-variance-authority) for component variants
- Use `splitProps` to separate local props from pass-through
- Export from the barrel file in `src/features/ui/components/index.tsx`

### Adding a New Feature

1. Create a directory under `src/features/your-feature/`
2. Add an `index.ts` barrel export
3. Add i18n keys to `src/features/context/i18n/locales/en.ts` and `bn.ts`
4. Add a route in `src/routes/_protected/` if it needs a page
5. Add a sidebar entry in `src/features/navigation/navigation.config.tsx` if needed

## Reporting Issues

Please include:

- Steps to reproduce
- Expected vs actual behavior
- Browser and OS
- Screenshots if applicable

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
