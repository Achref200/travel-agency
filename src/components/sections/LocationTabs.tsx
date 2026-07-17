"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routeCategories, type RouteCategory, type Route } from "@/data/locations";
import { formatPrice, cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export function LocationTabs({ routes }: { routes: Route[] }) {
  const t = useTranslations("Locations");
  const tc = useTranslations("Common");
  const locale = useLocale();
  const [cat, setCat] = useState<RouteCategory>("airport");
  const list = routes.filter((r) => r.category === cat);

  return (
    <div>
      <div
        role="tablist"
        aria-label={t("title")}
        className="flex flex-wrap gap-2"
      >
        {routeCategories.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={cat === c}
            onClick={() => setCat(c)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition-colors",
              cat === c
                ? "bg-ink text-canvas"
                : "border border-line text-muted hover:text-ink hover:border-ink",
            )}
          >
            {t(`tabs.${c}`)}
          </button>
        ))}
      </div>

      <ul className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface divide-y divide-line">
        {list.map((r, i) => (
          <li key={`${r.from}-${r.to}-${i}`}>
            <Link
              href={`/booking?from=${encodeURIComponent(r.from)}&to=${encodeURIComponent(r.to)}`}
              className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-canvas"
            >
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm md:text-base">
                <span className="text-ink">{r.from}</span>
                <ArrowRight className="size-4 shrink-0 text-gold-deep rtl:rotate-180" />
                <span className="text-ink">{r.to}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <span className="hidden text-xs text-faint sm:inline">
                  {tc("from")}
                </span>
                <span className="font-medium text-ink tabular-nums">
                  {formatPrice(r.price, locale, siteConfig.currency)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
