import { siteConfig, absoluteUrl } from "@/config/site";
import { localize } from "@/lib/utils";
import type { FaqItem } from "@/data/faq";
import type { Tour } from "@/data/tours";

/**
 * Renders a JSON-LD <script>. Data comes only from our own config/content
 * (never user input); `<` is escaped defensively to avoid breaking out of the
 * script tag.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

const ORG_ID = `${siteConfig.url}/#organization`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

export function organizationSchema() {
  const socials = Object.values(siteConfig.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": ORG_ID,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    image: absoluteUrl("/opengraph-image"),
    logo: absoluteUrl("/logo.jpg"),
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    priceRange: "€€",
    sameAs: socials,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address.line1,
      addressLocality: siteConfig.contact.address.city,
      addressRegion: siteConfig.contact.address.district,
      postalCode: siteConfig.contact.address.postalCode,
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.contact.geo.lat,
      longitude: siteConfig.contact.geo.lng,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    areaServed: [
      { "@type": "City", name: "Istanbul" },
      { "@type": "Country", name: "Türkiye" },
    ],
  };
}

export function websiteSchema(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    inLanguage: locale,
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/booking?from={from}`,
      },
      "query-input": "required name=from",
    },
  };
}

export function faqSchema(items: FaqItem[], locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: localize(item.question, locale),
      acceptedAnswer: {
        "@type": "Answer",
        text: localize(item.answer, locale),
      },
    })),
  };
}

export function tourSchema(tour: Tour, locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: localize(tour.title, locale),
    description: localize(tour.summary, locale),
    image: tour.image,
    brand: { "@type": "Brand", name: siteConfig.name },
    category: localize(tour.category, locale),
    offers: {
      "@type": "Offer",
      price: tour.price,
      priceCurrency: siteConfig.currency,
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/tours/${tour.slug}`),
    },
  };
}

export function breadcrumbSchema(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
