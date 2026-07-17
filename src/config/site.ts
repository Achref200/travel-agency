/**
 * ============================================================================
 *  SITE CONFIGURATION — SINGLE SOURCE OF TRUTH
 * ============================================================================
 *
 *  👉  To rename the whole platform, change ONLY the `SITE_NAME` value below.
 *      It propagates to the header, footer, page titles, SEO metadata,
 *      structured data (JSON-LD), emails and every translated string that
 *      references the brand.
 *
 *  Everything a non-developer might need to tweak (brand, contact details,
 *  social links, pricing currency, deployment domain) lives in this file.
 * ============================================================================
 */

/** The one variable to change when the brand name is decided. */
export const SITE_NAME = "Azura";

/** Production domain (no trailing slash). Used for canonical URLs & sitemaps. */
export const SITE_DOMAIN = "https://www.azura-travel.com";

export type Locale = "en" | "tr" | "ar";

export const siteConfig = {
  /** Short brand name shown in the UI. */
  name: SITE_NAME,
  /** Full legal / registered company name (footer, contracts, invoices). */
  legalName: `${SITE_NAME} Travel`,
  /** Canonical production URL. */
  url: SITE_DOMAIN,
  /** Default social share / OG image (served from /public or Cloudinary). */
  ogImage: "/og-image.jpg",
  /** ISO founding year — used in the footer copyright. */
  foundedYear: 2024,
  /** Currency used across pricing. */
  currency: "EUR",
  currencySymbol: "€",

  /** Contact details — used in header CTA, footer, contact page & JSON-LD. */
  contact: {
    phone: "+90 542 000 00 00",
    /** Digits only, international format — used to build wa.me links. */
    whatsapp: "905420000000",
    email: `info@azura-travel.com`,
    address: {
      line1: "Istanbul Airport (IST), Arrivals",
      district: "Tayakadın, Arnavutköy",
      city: "Istanbul",
      country: "Türkiye",
      postalCode: "34283",
    },
    /** Google Maps embed / directions link. */
    mapUrl: "https://maps.google.com/?q=Istanbul+Airport",
    /** Latitude / longitude for LocalBusiness structured data. */
    geo: { lat: 41.2753, lng: 28.7519 },
  },

  /** Public social profiles. Empty string = hidden. */
  social: {
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    tripadvisor: "https://www.tripadvisor.com/",
    x: "",
    youtube: "",
  },

  /** Operating hours (shown on contact page & used for JSON-LD). */
  hours: "24/7",
} as const;

/** Pre-built WhatsApp deep link with an optional greeting message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${siteConfig.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Pre-built tel: link (strips spaces). */
export function telLink(): string {
  return `tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`;
}

/** Absolute URL helper for canonical / OG tags. */
export function absoluteUrl(path = ""): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
