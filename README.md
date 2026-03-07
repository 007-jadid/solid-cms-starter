# SolidJS CMS Boilerplate

A production-ready, feature-rich CMS starter built with **SolidJS** and the **TanStack** ecosystem. Ships with 80+ UI components, advanced data tables, form builder, authentication, RBAC permissions, i18n, theming, maps, charts, rich text editor, and more — everything you need to build admin panels, dashboards, and content management systems.

---

## Table of Contents

- [Features at a Glance](#features-at-a-glance)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Permissions (RBAC)](#permissions-rbac)
- [Routing & Navigation](#routing--navigation)
- [UI Components](#ui-components)
- [Data Table](#data-table)
- [Form System](#form-system)
- [Theming](#theming)
- [Internationalization (i18n)](#internationalization-i18n)
- [Charts](#charts)
- [Maps](#maps)
- [Rich Text Editor](#rich-text-editor)
- [Media Picker](#media-picker)
- [Export Utilities](#export-utilities)
- [Animations](#animations)
- [Realtime Features](#realtime-features)
- [PWA Support](#pwa-support)
- [API Client](#api-client)
- [Query Invalidation & Cache Management](#query-invalidation--cache-management)
- [Testing](#testing)
- [Bundle Optimization](#bundle-optimization)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [CMS Plugin System](#cms-plugin-system)
- [API Response Types](#api-response-types)
- [Customizing API Response Types](#customizing-api-response-types)
- [Contributing](#contributing)
- [License](#license)

---

## Features at a Glance

| Category             | What You Get                                                                                                                            |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **UI Components**    | 80+ components — buttons, dialogs, drawers, tabs, accordions, command palette, carousel, and more                                       |
| **Data Table**       | Sorting, filtering, pagination, inline editing, row selection, drag-and-drop, virtualization, sub-grids, bulk actions, CSV/Excel export |
| **Form Builder**     | 25+ field types, multi-step wizards, array fields, conditional logic, Valibot validation                                                |
| **Auth**             | Login flow, JWT token management, automatic refresh, route guards                                                                       |
| **Permissions**      | Role-based access control with component guards, route guards, and action filtering                                                     |
| **Theming**          | Light/dark/system mode, multiple color variants, configurable fonts, density settings, glass effects                                    |
| **i18n**             | Multi-language support (English + Bengali out of the box), easily extensible                                                            |
| **Charts**           | 7 chart types — line, area, bar, pie, radial, radar, with interactive tooltips                                                          |
| **Maps**             | Leaflet (OSM) and Google Maps providers, location search, drawing tools                                                                 |
| **Rich Text Editor** | Quill v2 with image upload, drag-resize, full formatting toolbar                                                                        |
| **Media Picker**     | Client-side file browser with drag-and-drop, categorization, search                                                                     |
| **Animations**       | GSAP directives — fadeIn, hoverLift, staggerChildren                                                                                    |
| **Realtime**         | WebSocket, Server-Sent Events (SSE), Web Push notifications                                                                             |
| **PWA**              | Service worker, offline caching, installable app manifest                                                                               |
| **Query Cache**      | Automatic query invalidation + optimistic cache updates after mutations — typed endpoint registry, zero config                          |
| **Testing**          | Vitest + SolidJS Testing Library                                                                                                        |
| **Bundle**           | Smart code-splitting with 18+ optimized chunks                                                                                          |

---

## Tech Stack

| Layer          | Technology                                                                                                  |
| -------------- | ----------------------------------------------------------------------------------------------------------- |
| Framework      | [SolidJS](https://www.solidjs.com/) 1.9                                                                     |
| Routing        | [TanStack Router](https://tanstack.com/router) (file-based, auto code-splitting)                            |
| Server State   | [TanStack Query](https://tanstack.com/query) v5                                                             |
| Tables         | [TanStack Table](https://tanstack.com/table) v8                                                             |
| Forms          | [TanStack Form](https://tanstack.com/form) + [Valibot](https://valibot.dev/)                                |
| Virtualization | [TanStack Virtual](https://tanstack.com/virtual)                                                            |
| UI Primitives  | [Kobalte](https://kobalte.dev/) + [Corvu](https://corvu.dev/)                                               |
| Styling        | [Tailwind CSS](https://tailwindcss.com/) v4 + [CVA](https://cva.style/)                                     |
| Charts         | [Chart.js](https://www.chartjs.org/) + solid-chartjs                                                        |
| Maps           | [Leaflet](https://leafletjs.com/) + [Google Maps](https://developers.google.com/maps)                       |
| Editor         | [Quill](https://quilljs.com/) v2                                                                            |
| Animations     | [GSAP](https://gsap.com/)                                                                                   |
| HTTP           | [Axios](https://axios-http.com/) with interceptors                                                          |
| i18n           | [@solid-primitives/i18n](https://github.com/solidjs-community/solid-primitives)                             |
| Validation     | [Valibot](https://valibot.dev/)                                                                             |
| Build          | [Vite](https://vite.dev/) 7 + [Bun](https://bun.sh/)                                                        |
| Testing        | [Vitest](https://vitest.dev/) + [SolidJS Testing Library](https://github.com/solidjs/solid-testing-library) |
| Linting        | [Biome](https://biomejs.dev/) + [ESLint](https://eslint.org/)                                               |

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) 1.0+ (recommended) or Node.js 18+

### Installation

```bash
# Clone the repository
git clone https://github.com/007-jadid/solid-cms-starter.git
cd solid-cms-starter

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env

# Start the dev server
bun run dev
```

The app will be available at `http://localhost:5173`.

### Demo Login

The boilerplate ships with a built-in demo mode (no backend required):

- **Email:** `admin@demo.com`
- **Password:** `demo`

---

## Project Structure

```text
src/
├── app/                        # App bootstrap, router, query client
├── features/
│   ├── context/
│   │   ├── auth/              # Authentication (login, tokens, guards)
│   │   ├── permissions/       # RBAC permission system
│   │   ├── i18n/              # Internationalization (en, bn)
│   │   ├── settings/          # Theme, density, fonts, glass presets
│   │   ├── notifications/     # Toast notification context
│   │   ├── webpush/           # Web Push notifications
│   │   ├── websocket/         # WebSocket connection
│   │   ├── sse/               # Server-Sent Events
│   │   └── pwa/               # PWA install prompt
│   ├── api/                   # Endpoint registry, cache helpers, query meta
│   │   ├── endpoints.ts       # API_ENDPOINTS grouped registry + ApiEndpointUrl type
│   │   ├── cache-helpers.ts   # cacheOps.prepend / updateItem / removeItem
│   │   └── query-meta.ts      # Typed meta module augmentation for useMutation
│   ├── hooks/                 # Query hooks (useGet, usePost, usePut, etc.)
│   ├── lib/                   # Utilities (API client, export, animations)
│   ├── navigation/            # Sidebar navigation config
│   ├── ui/
│   │   ├── components/        # 80+ reusable UI components
│   │   ├── data-table/        # Advanced DataTable system
│   │   ├── form/              # Form factory, field renderer, 25+ field types
│   │   └── layout/            # App shell (sidebar, navbar, page layout)
│   ├── demo/                  # Showcase & demo pages
│   └── users/                 # User management feature module
├── routes/                    # File-based routes (TanStack Router)
│   ├── _auth/login.tsx        # Login page
│   ├── _protected/            # Auth-guarded routes
│   │   ├── dashboard.tsx      # Dashboard with charts
│   │   ├── users.tsx          # User list
│   │   ├── settings.tsx       # System settings
│   │   └── demo.tsx           # Feature showcase
│   └── __root.tsx             # Root layout
├── main.tsx                   # Entry point (provider stack)
└── app.css                    # Global Tailwind styles
```

---

## Authentication

The auth system provides a complete login-to-protected-route flow.

### How It Works

1. **Login page** (`/auth/login`) — email + password form
2. **Token storage** — access + refresh tokens persisted to localStorage
3. **Route protection** — `beforeLoad` guard on the `/_protected` layout redirects unauthenticated users before any component renders (no spinner flash)
4. **Automatic token refresh** — Axios interceptor catches 401 responses, refreshes the token, and retries the failed request. Concurrent requests are queued during refresh.
5. **Logout** — clears tokens and redirects to login

### Auth Hook

```tsx
import { useAuth } from "~/features/context/auth/auth.context";

const MyComponent = () => {
  const auth = useAuth();

  // Access user info
  const user = () => auth.state.user;
  const isAuthenticated = () => auth.state.status === "authenticated";

  // Actions
  auth.login(email, password);
  auth.logout();
};
```

### Expected API Responses

**`POST /auth/login`** — Login:

```jsonc
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "name": "Admin User",
    },
    "menu": [], // optional — used by permission system (see below)
  },
}
```

**`GET /auth/me`** — Validate token:

```jsonc
{
  "data": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "firstName": "Admin",
    "lastName": "User",
    "avatar": null,
    "role": "admin",
    "roles": ["admin"],
    "permissions": ["*"],
  },
}
```

**`POST /auth/refresh`** — Token refresh:

```jsonc
// Request:  { "refreshToken": "..." }
// Response:
{
  "token": "new-access-token...",
  "refreshToken": "new-refresh-token...",
}
```

### AuthUser Type

```typescript
interface AuthUser {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  role: string;
  roles: string[]; // used by permission system
  permissions: string[]; // action-level permissions
}
```

### Demo Mode

Set `USE_DEMO_MODE = true` in the auth context to bypass API calls entirely. Ships with mock users for local development.

---

## Permissions (RBAC)

Fine-grained role-based access control at the route, component, and action level.

### Roles

Built-in roles: `admin`, `editor`, `viewer`. Each maps to a set of permissions. Wildcard `"*"` grants full access.

### Permission Checks

**Component guard:**

```tsx
import { PermissionGuard } from "~/features/context/permissions/permissions.context";

<PermissionGuard action="users.create" fallback={<p>Access denied</p>}>
  <CreateUserButton />
</PermissionGuard>;
```

**Hook:**

```tsx
const { can, hasPermissions } = usePermissions();

if (can("users.delete")) {
  // show delete button
}
```

**HOC:**

```tsx
const ProtectedPage = withPermission(MyPage, {
  action: "reports.view",
  FallbackComponent: AccessDenied,
});
```

**Route guard:**

```tsx
// In route definition — beforeLoad
createRoutePermissionCheck("dashboard.view");
```

**DataTable row actions** can be filtered with `usePermissionedActions()` to only show actions the user has access to.

### Permission API Response

Permissions are loaded from the login response's `menu` field. The expected structure:

```jsonc
// Inside login response → data.menu
[
  {
    "id": 1,
    "name": "customers",
    "url": "/customers",
    "icon": "users",
    "displayName": "Customers",
    "hasSubMenus": false,
    "isVisible": true,
    "subMenus": [],
    "menuActions": [
      { "id": 1, "name": "CUSTOMERS_VIEW", "displayName": "View Customers" },
      { "id": 2, "name": "CUSTOMERS_EDIT", "displayName": "Edit Customers" },
      {
        "id": 3,
        "name": "CUSTOMERS_DELETE",
        "displayName": "Delete Customers",
      },
    ],
  },
]
```

The system parses this into flat action permissions (e.g. `"CUSTOMERS_EDIT"`) and page permissions (e.g. `"/customers"`). Use `parseLoginPermissions()` from `permissions.utils` to convert the API response, then call `setPermissions(actions, pages)`.

### Permission Config

```typescript
// In PermissionsProvider or permissions.types.ts
interface PermissionConfig {
  enabled: boolean; // master toggle
  pagePermissionEnabled: boolean; // URL-based page access
  actionPermissionEnabled: boolean; // action-based access
  defaultBehavior: "deny" | "allow"; // what to do when no permission matches
  debug: boolean; // console.log permission checks (DEV only)
}
```

For full documentation, see [docs/PERMISSION_SYSTEM.md](docs/PERMISSION_SYSTEM.md).

---

## Routing & Navigation

Routes are file-based via TanStack Router. Add a file to `src/routes/` and a route is automatically generated.

### Route Layouts

- `_auth` — public layout for login/register pages
- `_protected` — authenticated layout with sidebar, navbar, and auth guard
- `__root` — root layout with error boundary and devtools

### Navigation Config

Sidebar items are defined in `src/features/navigation/navigation.config.tsx`. Each item can specify a required permission — items the user can't access are automatically hidden.

### Adding a New Page

1. Create `src/routes/_protected/my-page.tsx`
2. Export a `Route` with `createFileRoute`
3. Add a navigation entry in `navigation.config.tsx`
4. (Optional) Add a permission check

---

## UI Components

80+ components built on [Kobalte](https://kobalte.dev/) and [Corvu](https://corvu.dev/) primitives, styled with Tailwind CSS and CVA variants.

### Input & Form Controls

Button, Input, Textarea, Select (searchable), Checkbox, Switch, Radio Group, Toggle Group, Slider, Number Field, Color Picker, File Upload, OTP Input, Date Picker, Time Picker

### Layout & Containers

Card, Dialog, Drawer, Sheet, Tabs, Accordion, Collapsible, Resizable Panels, Separator

### Feedback & Overlays

Alert Dialog, Confirm Dialog, Popover, Hover Card, Tooltip, Dropdown Menu, Command Palette, Toast (Sonner)

### Navigation

Breadcrumb, Navigation Menu, Menubar, Sidebar (collapsible, with sections)

### Data Display

Table, Badge, Avatar, Skeleton, Pagination, Timeline, Activity Timeline, Carousel

### Specialized

Rich Text Editor, Media Picker, Map, Notification Center, Settings Modal, Onboarding Modal, Theme Toggle

All components are in `src/features/ui/components/` and follow a consistent pattern with CVA variants, Tailwind styling, and full TypeScript types.

---

## Data Table

A powerful, composable data table system built on TanStack Table v8.

### Features

- **Sorting** — single and multi-column
- **Filtering** — faceted filters, input filters, advanced filter builder
- **Pagination** — client-side or server-side with configurable page sizes
- **Row selection** — checkboxes with bulk action toolbar
- **Inline editing** — cell-level or row-level edit mode
- **Drag-and-drop** — row reordering
- **Column management** — visibility toggle, pinning (left/right), resizing, reordering
- **Expandable rows** — sub-components or nested sub-grids
- **Virtualization** — renders 10,000+ rows smoothly via TanStack Virtual
- **Export** — CSV and Excel with column mapping
- **Bulk actions** — toolbar with custom action handlers on selected rows
- **Server-side data** — pass a `url` or custom `fetcher` for API-driven tables
- **Density control** — compact, comfortable, spacious
- **Global search** — full-text search across columns

### Quick Example

```tsx
import { DataTable } from "~/features/ui/data-table/data-table";

<DataTable
  columns={columns}
  data={users()}
  enableRowSelection
  enableExport
  searchKey="name"
  bulkActions={[{ label: "Delete", action: (rows) => handleBulkDelete(rows) }]}
/>;
```

### Server-Side API Response Format

When using `url` or `fetcher`, the DataTable expects this response shape by default:

```jsonc
{
  "data": {
    "items": [
      { "id": 1, "name": "Alice" },
      { "id": 2, "name": "Bob" },
    ],
    "itemPerPage": 10,
    "pageNumber": 1,
    "totalItems": 42,
    "totalPage": 5,
    "hasNext": true,
    "hasPrev": false,
  },
  "status": true,
  "message": "Success",
}
```

**Query parameters** sent to your API:

```text
GET /api/users?page=1&size=10&search=alice&sort=name:asc,email:desc&status=active,inactive
```

If your API uses different field names, pass `responseKeys` to remap:

```tsx
<DataTable
  url="/api/users"
  responseKeys={{
    items: "records", // default: "items"
    totalItems: "total", // default: "totalItems"
    totalPage: "pages", // default: "totalPage"
    pageNumber: "page", // default: "pageNumber"
    itemPerPage: "perPage", // default: "itemPerPage"
  }}
/>
```

Or provide a custom `responseMapper` for complete control:

```tsx
<DataTable
  url="/api/users"
  responseMapper={(response) => ({
    items: response.data.results,
    totalItems: response.data.count,
    totalPage: Math.ceil(response.data.count / 10),
    pageNumber: 1,
    itemPerPage: 10,
  })}
/>
```

### Hooks

- `useDataTable(props)` — main orchestration hook
- `useDataTableSource(url, fetcher)` — server-side data fetching
- `useInfiniteTableSource(url, fetcher)` — infinite scroll

---

## Form System

A declarative form builder powered by TanStack Form and Valibot validation.

### 25+ Field Types

| Category  | Types                                                                     |
| --------- | ------------------------------------------------------------------------- |
| Text      | `text`, `email`, `password`, `textarea`, `url`, `phone`, `search`         |
| Number    | `number`, `slider`, `rating`                                              |
| Date/Time | `date`, `date-range`, `time`, `datetime`                                  |
| Selection | `select`, `radio-group`, `checkbox`, `switch`, `tags`                     |
| Special   | `array`, `file`, `color`, `otp`                                           |
| Rich      | `richtext` (Quill editor), `media` (file picker), `map` (location picker) |

### Form Example

```tsx
import { createForm } from "~/features/ui/form/form-factory";
import * as v from "valibot";

const { Form, Field } = createForm({
  defaultValues: { name: "", email: "", role: "viewer" },
  schema: v.object({
    name: v.pipe(v.string(), v.minLength(2, "Name is required")),
    email: v.pipe(v.string(), v.email("Invalid email")),
    role: v.picklist(["admin", "editor", "viewer"]),
  }),
  fields: [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "role", label: "Role", type: "select", options: [...] },
  ],
  onSubmit: (values) => console.log(values),
});
```

### Advanced Features

- **Multi-step wizards** — step indicators, per-step validation, jump-to-step
- **Array fields** — dynamic add/remove field groups
- **Conditional fields** — show/hide based on other field values
- **Form effects** — watch fields and trigger side effects
- **Async select** — API-driven dropdowns with search and pagination
- **Layout sections** — group fields with labels and grid layouts
- **FormDialog** — form wrapped in a modal dialog

---

## Theming

### Theme Modes

- **Light** / **Dark** / **System** (auto-detects OS preference)
- **Color variants** — `default` and `claude` palettes

### Customization

- **Fonts** — Jakarta, Inter, Geist, Spectral, system, or any Google Font (sidebar can have its own font)
- **Density** — `compact`, `comfortable`, `spacious` (affects padding, gaps, heights globally)
- **Glass presets** — `subtle`, `balanced`, `strong` (neumorphic/glassmorphism effects)

### Settings Persistence

All preferences are saved to `localStorage` and restored on reload. A settings modal (`src/features/ui/components/settings-modal.tsx`) provides a UI for all options.

### CSS Variables

Theme colors are driven by CSS custom properties (`--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, etc.) defined per theme in `app.css`. Extending the color palette is as simple as adding new variables.

---

## Internationalization (i18n)

Multi-language support via `@solid-primitives/i18n`.

### Supported Locales

- **English** (en) — default
- **Bengali** (bn)

### Adding a New Language

1. Create `src/features/context/i18n/locales/xx.ts` (copy `en.ts` structure)
2. Add the locale to the `I18nProvider`
3. The locale toggle in the navbar will pick it up automatically

### i18n Hook

```tsx
import { useI18n } from "~/features/context/i18n/i18n.context";

const MyComponent = () => {
  const { t, locale, setLocale } = useI18n();

  return (
    <div>
      <p>{t("dashboard.welcome")}</p>
      <button onClick={() => setLocale("bn")}>Switch to Bengali</button>
    </div>
  );
};
```

Template strings are supported: `t("form.errors.minLength", { min: "3" })`.

Locale preference is persisted to `localStorage` and defaults to the browser's language.

---

## Charts

7 chart types powered by Chart.js with SolidJS wrappers. All chart components are in `src/features/ui/charts/`.

### Available Components

```tsx
import {
  LineChart,
  AreaChart,
  BarChart,
  PieChart,
  DoughnutChart,
  RadialChart,
  RadarChart,
} from "~/features/ui/charts";
```

### Chart Data Format

All charts use the standard [Chart.js data format](https://www.chartjs.org/docs/latest/general/data-structures.html):

**Line / Area / Bar charts:**

```tsx
<LineChart
  data={{
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Desktop",
        data: [186, 305, 237, 73, 209],
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsl(var(--primary) / 0.2)",
      },
      {
        label: "Mobile",
        data: [80, 200, 150, 120, 190],
        borderColor: "hsl(var(--secondary))",
        backgroundColor: "hsl(var(--secondary) / 0.2)",
      },
    ],
  }}
  height={300}
/>
```

**Pie / Doughnut charts:**

```tsx
<PieChart
  data={{
    labels: ["Chrome", "Safari", "Firefox", "Edge", "Other"],
    datasets: [
      {
        data: [275, 200, 187, 173, 90],
        backgroundColor: [
          "#e76e50",
          "#2a9d90",
          "#264653",
          "#e9c46a",
          "#f4a261",
        ],
      },
    ],
  }}
  height={200}
/>
```

**Doughnut with center text:**

```tsx
<DoughnutChart
  data={doughnutData}
  centerText="1,234"
  centerSubtext="Total visitors"
  height={200}
/>
```

**Radar chart:**

```tsx
<RadarChart
  data={{
    labels: ["Speed", "Reliability", "Comfort", "Safety", "Efficiency"],
    datasets: [
      { label: "Product A", data: [65, 59, 90, 81, 56] },
      { label: "Product B", data: [28, 48, 40, 19, 96] },
    ],
  }}
  height={300}
/>
```

### Chart Props

All charts accept:

```typescript
interface BaseChartProps {
  height?: number; // pixels, default varies
  class?: string; // additional CSS classes
}

// Each chart type extends this with typed data/options:
// LineChart:    data: ChartData<"line">,     options?: ChartOptions<"line">
// BarChart:     data: ChartData<"bar">,      options?: ChartOptions<"bar">
// PieChart:     data: ChartData<"pie">,      options?: ChartOptions<"pie">
// RadarChart:   data: ChartData<"radar">,    options?: ChartOptions<"radar">
// DoughnutChart: + centerText?, centerSubtext?, showGrid?
```

### Theme Integration

Charts automatically adapt to light/dark mode via `getThemeColors()` from `~/features/ui/charts`. Colors are read from CSS custom properties so they follow your theme.

Charts are showcased in the dashboard (`/dashboard`) and the chart demo page.

---

## Maps

Plugin-based map system supporting multiple providers.

### Providers

| Provider                    | Requires API Key                    | Drawing Tools |
| --------------------------- | ----------------------------------- | ------------- |
| **Leaflet** (OpenStreetMap) | No                                  | Geoman        |
| **Google Maps**             | Yes (`VITE_APP_GOOGLE_MAP_API_KEY`) | Terra Draw    |

### Using Leaflet (OpenStreetMap)

No API key required. Works out of the box:

```tsx
import { Map } from "~/features/ui/components/map/map";

<Map
  provider={{ type: "leaflet" }}
  center={[23.8103, 90.4125]}
  zoom={13}
  draggableMarker
  onMarkerChange={(loc) => console.log(loc)}
/>;
```

You can customize the tile server and geocoding endpoint:

```tsx
<Map
  provider={{
    type: "leaflet",
    tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    tileAttribution: "&copy; OpenStreetMap contributors",
    nominatimUrl: "https://nominatim.openstreetmap.org",
  }}
/>
```

### Using Google Maps

Requires an API key with Maps JavaScript API + Places API enabled:

```tsx
<Map
  provider={{
    type: "google",
    apiKey: import.meta.env.VITE_APP_GOOGLE_MAP_API_KEY,
    mapId: "optional-custom-map-style-id",
  }}
  center={[23.8103, 90.4125]}
  zoom={13}
  draggableMarker
/>
```

### Drawing Tools

Both providers support drawing shapes on the map:

```tsx
<Map
  provider={{ type: "leaflet" }}
  drawingTools={["marker", "polyline", "polygon", "rectangle", "circle"]}
  onShapeDrawn={(shape) => console.log(shape)}
  onShapesChange={(allShapes) => saveShapes(allShapes)}
  initialShapes={savedShapes}
/>
```

Drawn shape types:

```typescript
type DrawnShapeData =
  | { type: "marker"; lat: number; lng: number }
  | { type: "polyline"; points: { lat: number; lng: number }[] }
  | { type: "polygon"; points: { lat: number; lng: number }[] }
  | {
      type: "rectangle";
      north: number;
      south: number;
      east: number;
      west: number;
    }
  | { type: "circle"; center: { lat: number; lng: number }; radius: number };
```

### Location Search

`<MapLocationSearch />` provides autocomplete search with geocoding — uses Nominatim for Leaflet and Google Places for Google Maps:

```tsx
import { MapLocationSearch } from "~/features/ui/components/map";

<MapLocationSearch
  provider={{ type: "leaflet" }}
  onLocationChange={(location) => setSelectedLocation(location)}
  value={selectedLocation()}
  searchPlaceholder="Search for a location..."
  showClear
/>;
```

### Imperative Map Control

Use `onReady` to get a ref for programmatic control:

```tsx
let mapRef: MapControlRef;

<Map
  provider={{ type: "leaflet" }}
  onReady={(ref) => {
    mapRef = ref;
  }}
/>;

// Later:
mapRef.setCenter(40.7128, -74.006, 15);
mapRef.setMarker({ lat: 40.7128, lng: -74.006, address: "NYC" });
const suggestions = await mapRef.search("Central Park");
```

### Runtime Provider Config

In `src/app/map-runtime-config.ts`, control which providers are available at runtime:

```typescript
export const MAP_RUNTIME_CONFIG: MapConfig = {
  countryCode: "BD", // restrict geocoding to this country
  enabledProviders: ["leaflet", "google"], // or ["leaflet"] or []
};
```

### Map as a Form Field

```tsx
{ name: "location", label: "Location", type: "map", mapConfig: { provider: "leaflet" } }
```

The form stores a `MapLocation | null`:

```typescript
interface MapLocation {
  lat: number;
  lng: number;
  zoom?: number;
  address?: string;
  displayName?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  placeId?: string; // Google only
}
```

### Build-Time Optimization

Control which map provider code is bundled:

```env
VITE_MAP_BUILD_MODE=both    # both | leaflet | google | none
```

Setting `none` excludes all map-related chunks from the bundle.

---

## Rich Text Editor

Full-featured rich text editing powered by Quill v2.

### Toolbar

History, text formatting (bold/italic/underline/strike/code), headings, lists, alignment, colors, blockquotes, code blocks, links, image upload with drag-resize.

### Editor Component

```tsx
import { RichTextEditor } from "~/features/ui/components/rich-text-editor";

<RichTextEditor
  value={content()}
  onChange={setContent}
  placeholder="Write something..."
/>;
```

Or as a form field: `{ name: "body", type: "richtext" }`

### Build Toggle

```env
VITE_CMS_EDITOR=quill   # quill | none
```

Set to `none` to exclude the editor from the bundle entirely.

---

## Media Picker

Client-side file browser dialog with drag-and-drop upload.

- Category tabs (images, videos, documents, other)
- Search by filename
- Single or multi-select
- Object URL cleanup on unmount (no memory leaks)

```tsx
<MediaPickerDialog
  open={open()}
  onOpenChange={setOpen}
  onSelect={(files) => handleFiles(files)}
  multiple
  accept="image/*"
/>
```

Or as a form field: `{ name: "avatar", type: "media", mediaConfig: { accept: "image/*" } }`

---

## Export Utilities

Export data table content to CSV or Excel.

```tsx
import { exportToCSV, exportToExcel } from "~/features/lib/export";

// CSV
exportToCSV(data, "users", columns);

// Excel
exportToExcel(data, "users", columns, "Sheet1");
```

The DataTable has built-in export support — just pass `enableExport`:

```tsx
<DataTable columns={columns} data={data} enableExport exportFilename="report" />
```

---

## Animations

GSAP-powered animation directives for SolidJS.

```tsx
import { fadeIn, hoverLift, staggerChildren } from "~/features/lib/motion";

<div use:fadeIn={{ duration: 0.5, delay: 0.1 }}>Fades in</div>
<div use:hoverLift>Lifts on hover</div>
<div use:staggerChildren={{ stagger: 0.1 }}>
  <div>Child 1</div>
  <div>Child 2</div>
</div>
```

---

## Realtime Features

Optional realtime communication built in. All realtime features are registered as CMS plugins (see [CMS Plugin System](#cms-plugin-system)).

| Feature            | Env Variable            | Library                             |
| ------------------ | ----------------------- | ----------------------------------- |
| WebSocket          | `VITE_WS_URL`           | socket.io-client / native WebSocket |
| Server-Sent Events | `VITE_SSE_URL`          | @microsoft/fetch-event-source       |
| Web Push           | `VITE_VAPID_PUBLIC_KEY` | Native Push API                     |

### WebSocket

Supports both native WebSocket and Socket.IO transports. Auto-connects on login, auto-disconnects on logout.

```tsx
import { useWebSocket } from "~/features/context/websocket";

const MyComponent = () => {
  const ws = useWebSocket();

  // Connection state
  // ws.state.status: "disconnected" | "connecting" | "connected" | "reconnecting" | "error"
  // ws.state.reconnectAttempts: number
  // ws.state.lastError: string | null
  // ws.state.connectedAt: string | null

  // Subscribe to events — returns unsubscribe function
  const unsub = ws.on("user:updated", (data) => {
    console.log("User updated:", data);
  });

  // Send events
  ws.send("chat:message", { text: "Hello!" });

  // Manual connect/disconnect
  ws.connect();
  ws.disconnect();
};
```

**Expected WebSocket message format** (JSON):

```jsonc
// Incoming messages should be JSON with event + data:
{ "event": "user:updated", "data": { "id": 1, "name": "Alice" } }

// Outgoing messages are sent in the same format:
{ "event": "chat:message", "data": { "text": "Hello!" } }
```

### Server-Sent Events (SSE)

One-way server-to-client event stream with automatic reconnection:

```tsx
import { useSSE } from "~/features/context/sse";

const MyComponent = () => {
  const sse = useSSE();

  // Subscribe to named events
  const unsub = sse.on("notification", (data) => {
    console.log("New notification:", data);
  });

  // Default "message" event
  sse.on("message", (data) => {
    console.log("Message:", data);
  });

  // sse.state.status: same as WebSocket states
};
```

**Expected SSE format** from server:

```text
event: notification
data: {"title":"New order","body":"Order #123 received"}

event: message
data: Hello world
```

### Web Push Notifications

Browser push notifications via service worker:

```tsx
import { useWebPush } from "~/features/context/webpush";

const MyComponent = () => {
  const push = useWebPush();

  // push.state.permission: "default" | "granted" | "denied"
  // push.state.pushSubscribed: boolean

  // Request permission + subscribe
  const subscription = await push.subscribeToPush();
  // Send `subscription` to your backend to store it

  // Show a notification directly
  push.showBrowserNotification("New message", {
    body: "You have a new message",
    icon: "/logo192.png",
  });

  // Unsubscribe
  await push.unsubscribeFromPush();
};
```

**Push payload format** (from your server via web-push):

```jsonc
{
  "title": "New Order",
  "body": "Order #123 has been placed",
  "icon": "/logo192.png",
  "image": "/order-preview.png",
  "actionUrl": "/orders/123",
  "category": "orders",
  "priority": "high", // "low" | "normal" | "high" | "urgent"
}
```

### Reconnection Config

All realtime providers share the same reconnection config:

```typescript
interface ReconnectConfig {
  enabled: boolean; // default: true
  maxAttempts: number; // default: 10
  baseDelay: number; // default: 1000ms
  maxDelay: number; // default: 30000ms (exponential backoff)
}
```

Each has its own context provider in `src/features/context/`. See [docs/realtime-features.md](docs/realtime-features.md) for details.

---

## PWA Support

The boilerplate is PWA-ready with:

- Service worker (Workbox via vite-plugin-pwa)
- Offline caching for fonts, JS, CSS, and static assets
- App manifest for installation
- Push notification support

---

## API Client

Axios instance with built-in interceptors at `src/features/lib/api-client.ts`.

- Automatically attaches the auth token to every request
- Catches 401 responses and triggers token refresh
- Queues concurrent requests during refresh
- Retries all queued requests after successful refresh
- Redirects to login on refresh failure

### Query Hooks

Pre-built hooks wrapping TanStack Query:

```tsx
import { useGet, usePost, usePut, useDelete } from "~/features/hooks/query";

// GET with reactive URL
const { data, isLoading } = useGet(() => `/api/users/${userId()}`);

// POST mutation
const { mutateAsync } = usePost({ url: "/api/users" });
await mutateAsync({ name: "Alice" });
```

Available: `useGet`, `useLazyGet`, `usePost`, `usePut`, `usePatch`, `useDelete`.

---

## Query Invalidation & Cache Management

Automatic query invalidation and optimistic cache updates after mutations — configured in one place, zero changes to mutation hooks.

Inspired by [TKDodo's automatic query invalidation pattern](https://tkdodo.eu/blog/automatic-query-invalidation-after-mutations), built on top of TanStack Query's global `MutationCache`.

### How It Works

All mutation hooks (`usePost`, `usePut`, `usePatch`, `useDelete`) accept a `meta` option. The global `MutationCache.onSuccess` handler in `src/app/query-client.ts` reads this `meta` and acts on the cache automatically — no per-hook wiring needed.

### API Endpoints Registry

Define all API endpoints once in `src/features/api/endpoints.ts`:

```ts
export const API_ENDPOINTS = {
  USER: {
    LIST: "/api/users",
    CREATE: "/api/users",
    DETAIL: (id: string) => `/api/users/${id}`,
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
  },
  // add more resource groups here
} as const satisfies EndpointRegistry;
```

The `ApiEndpointUrl` type is automatically derived — it includes only static string values (functions like `DETAIL` are excluded). TypeScript errors on unknown or mistyped URLs.

### Scenario 1 — Direct Cache Update (instant UI, no refetch)

```ts
import { usePost, API_ENDPOINTS, cacheOps } from "~/features/hooks";

const create = usePost(API_ENDPOINTS.USER.CREATE, {
  meta: {
    cacheUpdate: {
      resource: API_ENDPOINTS.USER.LIST, // typed — autocomplete ✅
      updater: (old, newUser) => cacheOps.prepend<User>(old, newUser as User),
    },
  },
});
```

The `cacheOps` helpers handle both paginated `ResponseMapperResult<T>` (DataTable) and plain arrays (`useGet`):

| Helper                                       | What it does                                                  |
| -------------------------------------------- | ------------------------------------------------------------- |
| `cacheOps.prepend<T>(old, item)`             | New item at top, maintains page size, increments `totalItems` |
| `cacheOps.updateItem<T>(matcher, old, item)` | Replaces first matching item in place                         |
| `cacheOps.removeItem<T>(matcher, old)`       | Removes first matching item, decrements `totalItems`          |

> **Note:** `prepend` is reliable on page 1 only. On page 2+ the data is returned unchanged. Pair with `invalidates` to refetch other pages in the background.

### Scenario 2 — Invalidate Queries (refetch)

```ts
const create = usePost(API_ENDPOINTS.USER.CREATE, {
  meta: {
    invalidates: [API_ENDPOINTS.USER.LIST], // typed ✅
  },
});
```

Active queries (currently mounted) refetch immediately. Inactive queries are marked stale and refetch on next access.

Cross-resource invalidation:

```ts
meta: {
  invalidates: [API_ENDPOINTS.USER.LIST, API_ENDPOINTS.DASHBOARD.STATS];
}
```

### Both Together

Optimistic update for instant UI + background resync with server:

```ts
const update = usePut(() => API_ENDPOINTS.USER.DETAIL(id()), {
  meta: {
    cacheUpdate: {
      resource: API_ENDPOINTS.USER.LIST,
      updater: (old, updated) =>
        cacheOps.updateItem<User>(
          (u) => u.id === (updated as User).id,
          old,
          updated as User,
        ),
    },
    invalidates: [API_ENDPOINTS.USER.LIST],
  },
});
```

### How Queries Are Matched

A `predicate` scans every element of a queryKey for the resource URL — works across all query key structures in the codebase:

| QueryKey                                            | Source             | Matched by `/api/users`? |
| --------------------------------------------------- | ------------------ | ------------------------ |
| `['/api/users']`                                    | `useGet`           | ✅                       |
| `['data-table', '/api/users', { page, sort, ... }]` | DataTable          | ✅                       |
| `['sub-grid', '/api/users/123/orders']`             | SubGrid            | ✅                       |
| `['/api/roles']`                                    | Different resource | ❌                       |

URL matching is segment-safe: `/api/users` matches `/api/users`, `/api/users/123`, `/api/users?page=1` — but **not** `/api/users-legacy`.

### Adding a New Resource

1. Add a group to `API_ENDPOINTS` in `src/features/api/endpoints.ts`
2. `ApiEndpointUrl` updates automatically — no other changes needed

---

## Testing

Unit tests with Vitest and SolidJS Testing Library.

```bash
bun run test              # Run all tests
bun run test:watch        # Watch mode
bun run test:coverage     # Coverage report
```

Test files live alongside features in `__tests__/` directories. The test setup (`src/test/setup.ts`) configures jsdom and jest-dom matchers.

---

## Bundle Optimization

The build is optimized with smart code-splitting:

- **18+ separate chunks** — SolidJS core, each TanStack library, Kobalte, Chart.js, Leaflet, Google Maps, GSAP, Quill, Valibot, and more
- **Conditional bundling** — map providers and the rich text editor can be excluded at build time via env variables
- **Auto code-splitting** — TanStack Router plugin splits each route into its own chunk

### Bundle Analysis

```bash
bun run analyze
```

Opens an interactive treemap of your bundle in the browser.

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Required
VITE_API_URL=http://localhost:9070             # Backend API base URL

# Optional — Realtime
VITE_WS_URL=ws://localhost:9070/ws             # WebSocket endpoint
VITE_SSE_URL=http://localhost:9070/events       # SSE endpoint
VITE_VAPID_PUBLIC_KEY=your-vapid-key            # Web Push public key

# Optional — Maps
VITE_APP_GOOGLE_MAP_API_KEY=your-key            # Google Maps API key
VITE_MAP_BUILD_MODE=both                        # both | leaflet | google | none

# Optional — Editor
VITE_CMS_EDITOR=quill                           # quill | none
```

---

## Scripts

| Command                 | Description                    |
| ----------------------- | ------------------------------ |
| `bun run dev`           | Start development server       |
| `bun run build`         | Production build + type check  |
| `bun run preview`       | Preview production build       |
| `bun run test`          | Run tests                      |
| `bun run test:watch`    | Run tests in watch mode        |
| `bun run test:coverage` | Run tests with coverage        |
| `bun run analyze`       | Build + open bundle visualizer |
| `bun run lint`          | Lint with Biome + ESLint       |
| `bun run lint:fix`      | Auto-fix lint issues           |
| `bun run format`        | Format code with Biome         |

---

## CMS Plugin System

The boilerplate uses a type-safe plugin architecture to compose optional features (realtime, notifications, PWA, etc.) into the app. Plugins provide context providers, hooks, and optional navbar UI — all registered in one place.

### Registering Plugins

```typescript
// src/features/core/index.ts
import { createCMS } from "./create-cms";
import { pwaPlugin } from "./plugins/pwa";
import { notificationsPlugin } from "./plugins/notifications";
import { wsPlugin } from "./plugins/websocket";
import { ssePlugin } from "./plugins/sse";
import { webPushPlugin } from "./plugins/webpush";

export const cms = createCMS([
  pwaPlugin({ showInstallPrompt: true, showUpdateBanner: true }),
  notificationsPlugin({ maxHistory: 100, showToast: true }),
  wsPlugin({ transport: "websocket", autoConnect: true }),
  ssePlugin({ autoConnect: true }),
  webPushPlugin({ vapidPublicKey: "BKx..." }),
] as const); // `as const` enables type-safe cms.use()
```

### Provider Stack

`cms.Provider` nests all registered plugin providers automatically. In `main.tsx`:

```tsx
function App() {
  return (
    <I18nProvider>
      <QueryClientProvider client={queryClient}>
        <SettingsProvider>
          <AuthProvider>
            <PermissionsProvider>
              <MapConfigProvider config={MAP_RUNTIME_CONFIG}>
                <cms.Provider>
                  {" "}
                  {/* <-- all plugins nested here */}
                  <RouterProvider router={router} />
                </cms.Provider>
              </MapConfigProvider>
            </PermissionsProvider>
          </AuthProvider>
        </SettingsProvider>
      </QueryClientProvider>
    </I18nProvider>
  );
}
```

### Using Plugins

```tsx
// Type-safe — only accepts names of registered plugins
const ws = cms.use("ws"); // WSContextValue
const sse = cms.use("sse"); // SSEContextValue
const push = cms.use("webpush"); // WebPushContextValue
const pwa = cms.use("pwa"); // PWAContextValue
const notif = cms.use("notifications"); // NotificationsContextValue

// Runtime check
if (cms.has("ws")) {
  cms.use("ws").send("ping", {});
}
```

### Creating a Custom Plugin

```typescript
import type { CMSPlugin } from "~/features/core";

// 1. Define your context and provider
function MyFeatureProvider(props: { children: JSXElement }) {
  // ... your context logic
  return <MyContext.Provider value={value}>{props.children}</MyContext.Provider>;
}

// 2. Create a plugin factory
export function myFeaturePlugin(config?: MyConfig): CMSPlugin<"myFeature", MyContextValue> {
  return {
    name: "myFeature",
    Provider: (props) => <MyFeatureProvider config={config}>{props.children}</MyFeatureProvider>,
    useHook: useMyFeature,
    navActions: [MyNavButton],  // optional — renders in navbar
  };
}

// 3. Register in src/features/core/index.ts
export const cms = createCMS([
  pwaPlugin(),
  myFeaturePlugin({ enabled: true }),
] as const);
```

### Available Plugins

| Plugin                  | Name              | What It Provides                                           |
| ----------------------- | ----------------- | ---------------------------------------------------------- |
| `pwaPlugin()`           | `"pwa"`           | Install prompt, update banner, service worker registration |
| `notificationsPlugin()` | `"notifications"` | In-app notification store + NotificationCenter in navbar   |
| `wsPlugin()`            | `"ws"`            | WebSocket connection + status dot in navbar                |
| `ssePlugin()`           | `"sse"`           | SSE connection + status dot in navbar                      |
| `webPushPlugin()`       | `"webpush"`       | Browser push subscription management                       |

---

## API Response Types

Quick reference for all expected backend API response shapes.

### Login Response

```typescript
interface LoginResponse {
  data: {
    token: string;
    refreshToken: string;
    user: { id: number; email: string; name: string };
    menu?: ApiMenuItem[]; // for permission system
  };
}
```

### Token Refresh Response

```typescript
interface RefreshResponse {
  token: string;
  refreshToken: string;
}
```

### DataTable Paginated Response

```typescript
interface DefaultApiResponse<TData> {
  data: {
    items: TData[];
    itemPerPage: number;
    pageNumber: number;
    totalItems: number;
    totalPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  status: boolean;
  message: string;
}
```

### Permission Menu Response

```typescript
interface ApiMenuItem {
  id: number;
  name: string;
  url: string | null;
  icon: string | null;
  displayName: string;
  hasSubMenus: boolean;
  isVisible: boolean;
  subMenus: ApiMenuItem[];
  menuActions: ApiMenuAction[];
}

interface ApiMenuAction {
  id: number;
  name: string; // permission key: "CUSTOMERS_EDIT"
  displayName: string;
}
```

### WebSocket Message Format

```typescript
// Incoming (parsed from JSON):
interface WSMessage {
  event: string; // e.g. "user:updated"
  data?: unknown; // event payload
}

// Outgoing (sent as JSON):
// Same shape — { event, data }
```

### SSE Event Format

```text
event: <event-name>
data: <JSON string or plain text>
```

### Web Push Payload

```typescript
interface PushPayload {
  title?: string;
  body?: string;
  icon?: string;
  image?: string;
  actionUrl?: string;
  category?: string;
  priority?: "low" | "normal" | "high" | "urgent";
  data?: Record<string, unknown>;
}
```

---

## Customizing API Response Types

Your backend may return data in a different shape than the defaults above. Here's how to adapt each part.

### Adapting the Login Response

If your login API returns a different structure (e.g. `accessToken` instead of `token`, or user fields differ):

**1. Update the `LoginResponse` interface** in [auth.context.tsx](src/features/context/auth/auth.context.tsx) (line ~144):

```typescript
// Change this to match YOUR backend's login response
interface LoginResponse {
  data: {
    accessToken: string; // was: token
    refreshToken: string;
    profile: {
      // was: user (Record<string, unknown>)
      userId: number;
      email: string;
      fullName: string;
    };
    menu?: unknown[];
  };
}
```

Then update the destructuring right below it (~line 153):

```typescript
const { accessToken, refreshToken, profile } = response.data;
tokenStorage.setTokens(accessToken, refreshToken);
setState({
  user: parseUser(profile),
  tokens: { accessToken, refreshToken },
  status: "authenticated",
});
```

**2. Update `parseUser()`** in [auth.utils.ts](src/features/context/auth/auth.utils.ts) (line ~43) to map your backend's user fields to `AuthUser`:

```typescript
export function parseUser(data: Record<string, unknown>): AuthUser {
  return {
    id: String(data.userId ?? data.id ?? ""),
    email: String(data.email ?? ""),
    name: String(data.fullName ?? data.name ?? ""),
    firstName: String(data.firstName ?? ""),
    lastName: String(data.lastName ?? ""),
    avatar: data.avatar ? String(data.avatar) : null,
    role: String(data.role ?? "user"),
    roles: Array.isArray(data.roles)
      ? data.roles
      : [String(data.role ?? "user")],
    permissions: Array.isArray(data.permissions) ? data.permissions : [],
  };
}
```

**3. (Optional) Update `AuthUser`** in [auth.types.ts](src/features/context/auth/auth.types.ts) if you need additional fields:

```typescript
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  role: string;
  roles: string[];
  permissions: string[];
  phone?: string; // add your custom fields
  department?: string;
}
```

### Adapting the Token Refresh Response

Update the `RefreshResponse` interface in [auth.context.tsx](src/features/context/auth/auth.context.tsx) (line ~200):

```typescript
interface RefreshResponse {
  accessToken: string; // was: token
  refreshToken: string;
}
const response = await apiClient.post<RefreshResponse>("/auth/refresh", {
  refreshToken,
});
const { accessToken, refreshToken: newRefreshToken } = response;
```

### Adapting the DataTable Response

Three ways to adapt the DataTable to your API, from simplest to most flexible:

**Option A — Remap field names with `responseKeys`** (no code changes needed):

If your API returns the same data but with different field names (e.g. `results` instead of `items`, `total` instead of `totalItems`):

```tsx
<DataTable
  endpoint="/api/users"
  columns={columns}
  responseKeys={{
    items: "results",
    totalItems: "total",
    totalPage: "totalPages",
    pageNumber: "page",
    itemPerPage: "perPage",
    hasNext: "has_next",
    hasPrev: "has_prev",
  }}
/>
```

**Option B — Custom `responseMapper`** for completely different structures:

If your API has a fundamentally different shape:

```tsx
<DataTable
  endpoint="/api/users"
  columns={columns}
  responseMapper={(response) => {
    const res = response as {
      records: User[];
      meta: { total: number; page: number; limit: number };
    };
    return {
      items: res.records,
      totalItems: res.meta.total,
      totalPage: Math.ceil(res.meta.total / res.meta.limit),
      pageNumber: res.meta.page,
      itemPerPage: res.meta.limit,
      hasNext: res.meta.page * res.meta.limit < res.meta.total,
      hasPrev: res.meta.page > 1,
    };
  }}
/>
```

**Option C — Change the global default** in [query-utils.ts](src/features/ui/data-table/utils/query-utils.ts):

Edit `defaultResponseMapper()` to match your standard API format. This affects all DataTables that don't provide their own `responseMapper`.

### Adapting the Permission Menu Response

If your backend returns permissions differently than the `ApiMenuItem[]` tree:

**1. Update types** in [permissions.types.ts](src/features/context/permissions/permissions.types.ts):

```typescript
// Change ApiMenuItem / ApiMenuAction to match your backend
export interface ApiMenuItem {
  menuId: number; // was: id
  title: string; // was: name
  path: string | null; // was: url
  // ... adapt all fields
}
```

**2. Update the parser** in [permissions.utils.ts](src/features/context/permissions/permissions.utils.ts) — `parseLoginPermissions()` (~line 26):

```typescript
export function parseLoginPermissions(menu: ApiMenuItem[]): ParsedPermissions {
  // Update field access to match your new ApiMenuItem shape
  const processMenu = (
    items: ApiMenuItem[],
    parentId: string | null = null,
    depth = 0,
  ) => {
    items.forEach((item) => {
      if (item.path) {
        // was: item.url
        const menuItem: MenuItem = {
          id: String(item.menuId), // was: item.id
          name: item.title, // was: item.name
          url: item.path, // was: item.url
          // ...
        };
        pagePermissionMap.set(normalizeUrl(item.path), menuItem);
      }
      // ...
    });
  };
}
```

### WebSocket / SSE Event Maps

To define your own typed events, extend the event map interfaces:

**WebSocket** — in [websocket.types.ts](src/features/context/websocket/websocket.types.ts):

```typescript
export interface WSEventMap {
  "user:updated": { id: number; name: string };
  "order:created": { orderId: string; total: number };
  "chat:message": { text: string; from: string };
  [key: string]: unknown; // allow arbitrary events
}
```

**SSE** — in [sse.types.ts](src/features/context/sse/sse.types.ts):

```typescript
export interface SSEEventMap {
  notification: { title: string; body: string };
  "stock:update": { symbol: string; price: number };
  [key: string]: unknown;
}
```

### Summary of Files to Change

| What to customize                   | File(s) to edit                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------------- |
| Login response shape                | `src/features/context/auth/auth.context.tsx` (LoginResponse interface + destructuring)      |
| User fields                         | `src/features/context/auth/auth.types.ts` (AuthUser) + `auth.utils.ts` (parseUser)          |
| Token refresh response              | `src/features/context/auth/auth.context.tsx` (RefreshResponse interface)                    |
| DataTable response (per-table)      | Pass `responseKeys` or `responseMapper` prop to `<DataTable>`                               |
| DataTable response (global default) | `src/features/ui/data-table/utils/query-utils.ts` (defaultResponseMapper)                   |
| Permission menu structure           | `src/features/context/permissions/permissions.types.ts` + `permissions.utils.ts`            |
| WebSocket event types               | `src/features/context/websocket/websocket.types.ts` (WSEventMap)                            |
| SSE event types                     | `src/features/context/sse/sse.types.ts` (SSEEventMap)                                       |
| Web Push payload                    | `src/features/context/webpush/webpush.context.tsx` (notification handler in service worker) |

---

## Contributing

Contributions are welcome! If you find a bug or have a feature request:

1. **Check existing issues** to avoid duplicates
2. **Open an issue** describing the bug or feature
3. If you'd like to fix it yourself, fork the repo and submit a PR

### Reporting Bugs

Please include:

- Steps to reproduce the issue
- Expected vs actual behavior
- Browser and OS information
- Screenshots if applicable

### Development

```bash
# Fork and clone
git clone https://github.com/007-jadid/solid-cms-starter.git
cd solid-cms-starter
bun install

# Create a branch
git checkout -b fix/my-bug-fix

# Make changes, then
bun run lint
bun run test
bun run build

# Submit a PR
```

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

### Third-Party License Notes

- **GSAP** (animation library) uses a [custom "no-charge" license](https://gsap.com/community/standard-license/) that permits free use in open-source projects, but is **not MIT**. If you use GSAP in a commercial product, review their licensing terms.
- All other dependencies are MIT or Apache-2.0 licensed.

---

Built with SolidJS — fine-grained reactivity for the modern web.
