import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes conditionally, resolving conflicts. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** A string translated into every supported locale (used for CMS-style data). */
export type Localized = {
  en: string;
  tr: string;
  ar: string;
};

/** Pick the correct translation for `locale`, falling back to English. */
export function localize(value: Localized, locale: string): string {
  return value[locale as keyof Localized] ?? value.en;
}

/** Format a price using the visitor's locale and the configured currency. */
export function formatPrice(
  amount: number,
  locale: string,
  currency = "EUR",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** URL-friendly slug from arbitrary text. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
