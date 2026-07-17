import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Clock, ArrowUpRight, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Tour } from "@/data/tours";
import { localize, formatPrice } from "@/lib/utils";
import { BLUR_DATA_URL } from "@/lib/images";
import { siteConfig } from "@/config/site";

function durationLabel(hours: number): string {
  if (hours >= 24) {
    const days = Math.round(hours / 24);
    return `${days}d`;
  }
  return `${hours}h`;
}

export function TourCard({ tour, priority }: { tour: Tour; priority?: boolean }) {
  const locale = useLocale();
  const t = useTranslations("Tours");
  const tc = useTranslations("Common");
  const priceNote = tour.priceType === "group" ? tc("perGroup") : tc("perPerson");

  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-500 hover:border-gold/40 hover:shadow-[0_24px_60px_-32px_rgba(26,26,23,0.4)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={tour.image}
          alt={localize(tour.title, locale)}
          fill
          sizes="(min-width: 1024px) 32rem, (min-width: 640px) 45vw, 90vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          priority={priority}
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent opacity-60" />

        <span className="absolute top-3 start-3 rounded-full bg-canvas/90 backdrop-blur px-3 py-1 text-xs font-medium text-ink">
          {localize(tour.category, locale)}
        </span>
        {tour.bestSeller && (
          <span className="absolute top-3 end-3 inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-medium text-ink">
            <Star className="size-3 fill-ink" />
            {t("bestSeller")}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl leading-snug text-balance transition-colors group-hover:text-gold-deep">
          {localize(tour.title, locale)}
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-muted line-clamp-2">
          {localize(tour.summary, locale)}
        </p>

        <div className="mt-6 flex items-end justify-between pt-4 border-t border-line">
          <span className="inline-flex items-center gap-1.5 text-sm text-muted">
            <Clock className="size-4 text-gold-deep" />
            {durationLabel(tour.durationHours)}
          </span>
          <span className="text-end">
            <span className="block text-[0.7rem] uppercase tracking-wide text-faint">
              {tc("from")}
            </span>
            <span className="text-lg font-medium text-ink">
              {formatPrice(tour.price, locale, siteConfig.currency)}
            </span>
            <span className="ms-1 text-xs text-muted">· {priceNote}</span>
          </span>
        </div>
      </div>

      <span className="sr-only">{t("book")}</span>
      <ArrowUpRight className="sr-only" aria-hidden />
    </Link>
  );
}
