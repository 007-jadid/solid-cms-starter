import { flatten, resolveTemplate, translator } from "@solid-primitives/i18n";
import { createContext, createMemo, createSignal, type JSX, useContext } from "solid-js";
import { bn } from "./locales/bn";
import { en } from "./locales/en";

export type LocaleKey = "en" | "bn";

const LOCALE_STORAGE_KEY = "cms.locale";

function loadLocale(): LocaleKey {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored === "en" || stored === "bn") return stored;
  return "en";
}

// Pre-flatten both dictionaries (module-level — computed once)
const flatDicts: Record<LocaleKey, Record<string, string>> = {
  en: flatten(en) as unknown as Record<string, string>,
  bn: flatten(bn) as unknown as Record<string, string>,
};

export interface I18nContextValue {
  /** Translate a dot-notation key, e.g. t("common.save") or t("table.selected", { count: 5 }) */
  t: (key: string, params?: Record<string, string | number>) => string;
  locale: () => LocaleKey;
  setLocale: (locale: LocaleKey) => void;
}

const I18nContext = createContext<I18nContextValue>();

const fallbackTranslate = (key: string, params?: Record<string, string | number>) => {
  const template = flatDicts.en[key] ?? key;
  if (!params) return template;
  return resolveTemplate(template, params);
};

const fallbackI18nContext: I18nContextValue = {
  t: fallbackTranslate,
  locale: () => "en",
  setLocale: () => {
    // no-op fallback when provider is missing
  },
};

export function I18nProvider(props: { children: JSX.Element }) {
  const [locale, setLocaleRaw] = createSignal<LocaleKey>(loadLocale());

  const setLocale = (loc: LocaleKey) => {
    setLocaleRaw(loc);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCALE_STORAGE_KEY, loc);
    }
  };

  // Reactive memo — updates whenever locale() changes
  const dict = createMemo(() => flatDicts[locale()]);

  // translator() accepts an accessor — each t(key) call reads dict() reactively
  const t = translator(() => dict(), resolveTemplate) as I18nContextValue["t"];

  return (
    <I18nContext.Provider value={{ t, locale, setLocale }}>{props.children}</I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    if (import.meta.env.DEV) {
      console.warn("useI18n called outside <I18nProvider>; falling back to English locale.");
    }
    return fallbackI18nContext;
  }
  return ctx;
}
