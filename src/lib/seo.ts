import type { Metadata } from "next";
import { siteConfig, absoluteUrl } from "@/config/site";
import { routing } from "@/i18n/routing";

/** OpenGraph locale codes per app locale. */
const OG_LOCALE: Record<string, string> = {
  en: "en_US",
  tr: "tr_TR",
  ar: "ar_SA",
  fr: "fr_FR",
};

/**
 * Build a locale-aware URL path.
 * With `localePrefix: "as-needed"`, the default locale (en) lives at the root
 * while other locales are prefixed (`/tr`, `/ar`).
 */
export function localizedPath(locale: string, path = "/"): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  if (locale === routing.defaultLocale) return clean || "/";
  return `/${locale}${clean}`;
}

/** hreflang alternates map for a given path across every locale + x-default. */
export function buildAlternates(path = "/"): {
  canonical: string;
  languages: Record<string, string>;
} {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = absoluteUrl(localizedPath(locale, path));
  }
  languages["x-default"] = absoluteUrl(localizedPath(routing.defaultLocale, path));
  return {
    canonical: languages["x-default"],
    languages,
  };
}

type PageMetaArgs = {
  locale: string;
  path?: string;
  title: string;
  description: string;
  /** Absolute title (skip the "%s · Brand" template), e.g. the home page. */
  absoluteTitle?: boolean;
  image?: string;
  noIndex?: boolean;
};

/** Compose a complete, SEO-friendly Metadata object for a page. */
export function pageMetadata({
  locale,
  path = "/",
  title,
  description,
  absoluteTitle,
  image,
  noIndex,
}: PageMetaArgs): Metadata {
  const alternates = buildAlternates(path);
  const url = absoluteUrl(localizedPath(locale, path));

  // When no explicit image is supplied, the app-level `opengraph-image`
  // file convention provides a branded default for every page.
  const images = image
    ? [{ url: image, width: 1200, height: 630, alt: siteConfig.name }]
    : undefined;

  return {
    metadataBase: new URL(siteConfig.url),
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: alternates.languages,
    },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.name,
      title,
      description,
      locale: OG_LOCALE[locale] ?? "en_US",
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large" },
        },
  };
}
