import { createEffect, createSignal, createUniqueId, For, on, onCleanup, Show } from "solid-js";
import { cn } from "~/features/lib/utils";
import { MapView } from "./map";
import type { MapControlRef, MapLocation, MapLocationSearchProps, SearchSuggestion } from "./types";

// =====================================================================
// Debounce helper
// =====================================================================

function useDebounce<T>(value: () => T, delay: number) {
  const [debounced, setDebounced] = createSignal(value());

  createEffect(
    on(value, (v) => {
      const timer = setTimeout(() => setDebounced(() => v), delay);
      onCleanup(() => clearTimeout(timer));
    }),
  );

  return debounced;
}

// =====================================================================
// MapLocationSearch Component
// =====================================================================

/**
 * MapLocationSearch = Search autocomplete input + interactive Map.
 *
 * - Autocomplete uses Nominatim (Leaflet) or Google Places (Google provider)
 * - Selecting a suggestion pans the map and places a marker
 * - Clicking the map reverse-geocodes the position and updates the search input
 * - Controlled via `value` / `onLocationChange`
 *
 * @example
 * const [location, setLocation] = createSignal<MapLocation | null>(null)
 *
 * <MapLocationSearch
 *   provider={{ type: "leaflet" }}
 *   value={location()}
 *   onLocationChange={setLocation}
 *   height="400px"
 *   searchPlaceholder="Search for a place…"
 * />
 */
export function MapLocationSearch(props: MapLocationSearchProps) {
  // ── Internal state ──────────────────────────────────────────────────
  const [query, setQuery] = createSignal("");
  const [suggestions, setSuggestions] = createSignal<SearchSuggestion[]>([]);
  const [isSearching, setIsSearching] = createSignal(false);
  const [isOpen, setIsOpen] = createSignal(false);
  const [activeIdx, setActiveIdx] = createSignal(-1);
  const [selectedLabel, setSelectedLabel] = createSignal("");

  let controlRef: MapControlRef | undefined;

  const debouncedQuery = useDebounce(query, props.debounceMs ?? 300);

  // ── Trigger search when debounced query changes ──────────────────────
  createEffect(
    on(debouncedQuery, async (q) => {
      if (!q || q.length < 2 || q === selectedLabel()) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }
      setIsSearching(true);
      try {
        const results = await controlRef?.search(q);
        setSuggestions(results ?? []);
        setIsOpen((results?.length ?? 0) > 0);
        setActiveIdx(-1);
      } catch {
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setIsSearching(false);
      }
    }),
  );

  // ── Sync external `value` prop → update search label ────────────────
  createEffect(
    on(
      () => props.value,
      (loc) => {
        if (loc?.displayName && loc.displayName !== selectedLabel()) {
          setSelectedLabel(loc.displayName);
          setQuery(loc.displayName);
        }
      },
    ),
  );

  // ── Select a suggestion ──────────────────────────────────────────────
  const selectSuggestion = async (suggestion: SearchSuggestion) => {
    if (!controlRef) return;
    setSuggestions([]);
    setIsOpen(false);
    setIsSearching(true);
    try {
      const location = await controlRef.geocodeSelection(suggestion);
      if (!location) return;
      const label = suggestion.sublabel
        ? `${suggestion.label}, ${suggestion.sublabel}`
        : suggestion.label;
      setSelectedLabel(label);
      setQuery(label);
      controlRef.setCenter(location.lat, location.lng, 15);
      controlRef.setMarker(location);
      props.onLocationChange?.(location);
    } finally {
      setIsSearching(false);
    }
  };

  // ── Clear selection ──────────────────────────────────────────────────
  const clearSelection = () => {
    setQuery("");
    setSelectedLabel("");
    setSuggestions([]);
    setIsOpen(false);
    controlRef?.setMarker(null);
    props.onLocationChange?.(null);
  };

  // ── Keyboard navigation on the input ────────────────────────────────
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen()) return;
    const list = suggestions();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, list.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const idx = activeIdx();
      if (idx >= 0 && list[idx]) void selectSuggestion(list[idx]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIdx(-1);
    }
  };

  // ── Map marker change (map click / drag) ────────────────────────────
  const handleMapMarkerChange = (location: MapLocation) => {
    const label = location.displayName ?? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`;
    setSelectedLabel(label);
    setQuery(label);
    setSuggestions([]);
    setIsOpen(false);
    props.onLocationChange?.(location);
  };

  // ── Close dropdown when clicking outside ─────────────────────────────
  let wrapperRef!: HTMLDivElement;
  const handleDocClick = (e: MouseEvent) => {
    if (!wrapperRef.contains(e.target as Node)) setIsOpen(false);
  };
  document.addEventListener("click", handleDocClick);
  onCleanup(() => document.removeEventListener("click", handleDocClick));

  const hasValue = () => Boolean(props.value?.lat);
  const fallbackInputId = `map-search-input-${createUniqueId()}`;
  const inputId = () => props.inputId ?? fallbackInputId;
  const listboxId = "map-suggestions-listbox";

  return (
    <div class={cn("flex flex-col", props.class)}>
      {/* ── Search input ────────────────────────────────────────────── */}
      <div ref={wrapperRef} class="relative z-10">
        <div class="relative flex items-center">
          {/* Search / spinner icon */}
          <div class="pointer-events-none absolute left-3 flex h-full items-center text-muted-foreground">
            <Show
              when={!isSearching()}
              fallback={
                <svg
                  class="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </Show>
          </div>

          {/* Combobox input — ARIA combobox pattern */}
          <input
            id={inputId()}
            type="text"
            role="combobox"
            value={query()}
            onInput={(e) => {
              setQuery(e.currentTarget.value);
              if (!e.currentTarget.value) clearSelection();
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions().length > 0) setIsOpen(true);
            }}
            placeholder={props.searchPlaceholder ?? "Search for a location…"}
            autocomplete="off"
            aria-expanded={isOpen()}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-activedescendant={activeIdx() >= 0 ? `map-suggestion-${activeIdx()}` : undefined}
            class={cn(
              "flex h-10 w-full rounded-t-md border border-input bg-background",
              "pl-9 pr-9 text-sm transition-colors",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50",
              isOpen() ? "rounded-b-none border-b-0" : "rounded-b-md",
            )}
          />

          {/* Clear button */}
          <Show when={props.showClear !== false && hasValue()}>
            <button
              type="button"
              onClick={clearSelection}
              class="absolute right-3 flex h-full items-center text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear location"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </Show>
        </div>

        {/* ── Suggestions dropdown ───────────────────────────────────── */}
        <Show when={isOpen() && suggestions().length > 0}>
          {/* Plain div with listbox role — avoids non-interactive ul issue */}
          <div
            id={listboxId}
            role="listbox"
            aria-label="Location suggestions"
            class={cn(
              "absolute left-0 right-0 top-full z-50",
              "max-h-60 overflow-y-auto",
              "border border-t-0 border-input bg-popover",
              "rounded-b-md shadow-md py-1",
            )}
          >
            <For each={suggestions()}>
              {(suggestion, i) => (
                /* button is naturally interactive & focusable — no role needed */
                <button
                  id={`map-suggestion-${i()}`}
                  type="button"
                  role="option"
                  aria-selected={activeIdx() === i()}
                  class={cn(
                    "flex w-full cursor-pointer flex-col gap-0.5 px-3 py-2 text-left text-sm",
                    "select-none transition-colors",
                    activeIdx() === i() ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
                  )}
                  onClick={() => void selectSuggestion(suggestion)}
                  onMouseEnter={() => setActiveIdx(i())}
                >
                  <div class="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="shrink-0 text-muted-foreground"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span class="font-medium">{suggestion.label}</span>
                  </div>
                  <Show when={suggestion.sublabel}>
                    <span class="truncate pl-5 text-xs text-muted-foreground">
                      {suggestion.sublabel}
                    </span>
                  </Show>
                </button>
              )}
            </For>
          </div>
        </Show>
      </div>

      {/* ── Selected location info strip ──────────────────────────────── */}
      <Show when={hasValue() && props.value?.displayName}>
        <div class="flex items-center gap-2 border border-t-0 border-input bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="shrink-0"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span class="truncate">{props.value!.displayName}</span>
          <span class="ml-auto shrink-0 font-mono text-[10px]">
            {props.value!.lat.toFixed(5)}, {props.value!.lng.toFixed(5)}
          </span>
        </div>
      </Show>

      {/* ── Map ─────────────────────────────────────────────────────── */}
      {/* `isolate` creates a new stacking context, keeping Leaflet's internal
          z-indices (200–900) scoped inside so they don't bleed over the dropdown */}
      <div class="isolate overflow-hidden rounded-b-md border border-t-0 border-input">
        <MapView
          provider={props.provider}
          height={props.height ?? "380px"}
          center={props.center}
          zoom={props.zoom}
          marker={props.value ?? props.marker}
          draggableMarker={props.draggableMarker ?? true}
          interactive={props.interactive !== false}
          showZoomControl={props.showZoomControl}
          showScaleControl={props.showScaleControl}
          onMarkerChange={handleMapMarkerChange}
          onReady={(ref) => {
            controlRef = ref;
            if (props.value?.lat) {
              ref.setCenter(props.value.lat, props.value.lng, props.zoom ?? 14);
            }
          }}
        />
      </div>
    </div>
  );
}
