import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { routing } from "@/i18n/routing";
import { localizedPath } from "@/lib/seo";
import { getTourSlugs, getHotelSlugs } from "@/lib/content";

const staticPaths = [
  "/",
  "/tours",
  "/hotels",
  "/about",
  "/business",
  "/vehicles",
  "/meeting-points",
  "/faq",
  "/contact",
  "/booking",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [slugs, hotelSlugs] = await Promise.all([getTourSlugs(), getHotelSlugs()]);
  const paths = [
    ...staticPaths,
    ...slugs.map((s) => `/tours/${s}`),
    ...hotelSlugs.map((s) => `/hotels/${s}`),
  ];

  return paths.map((path) => {
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      languages[locale] = absoluteUrl(localizedPath(locale, path));
    }
    return {
      url: absoluteUrl(localizedPath(routing.defaultLocale, path)),
      lastModified: now,
      changeFrequency: path === "/" ? "daily" : "weekly",
      priority:
        path === "/"
          ? 1
          : path.startsWith("/tours/") || path.startsWith("/hotels/")
            ? 0.7
            : 0.8,
      alternates: { languages },
    };
  });
}
