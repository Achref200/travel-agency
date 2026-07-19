import { defineRouting } from "next-intl/routing";

/**
 * i18n routing configuration.
 *
 * - `en` (English) is the native/default language and is served at the root
 *   (`/`, `/tours`, ...) for the cleanest primary-market URLs.
 * - `tr` (Turkish) and `ar` (Arabic, RTL) are served under a locale prefix
 *   (`/tr/...`, `/ar/...`).
 *
 * To add a language: add its code here, drop a `messages/<code>.json` file,
 * and (if RTL) list it in `RTL_LOCALES` below.
 */
export const routing = defineRouting({
  locales: ["en", "tr", "ar", "fr"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

/** Locales that render right-to-left. */
export const RTL_LOCALES: readonly string[] = ["ar"];

/** Human-readable language names for the language switcher. */
export const LOCALE_LABELS: Record<string, { label: string; flag: string }> = {
  en: { label: "English", flag: "🇬🇧" },
  tr: { label: "Türkçe", flag: "🇹🇷" },
  ar: { label: "العربية", flag: "🇸🇦" },
  fr: { label: "Français", flag: "🇫🇷" },
};

export function isRtl(locale: string): boolean {
  return RTL_LOCALES.includes(locale);
}

export function textDirection(locale: string): "rtl" | "ltr" {
  return isRtl(locale) ? "rtl" : "ltr";
}
