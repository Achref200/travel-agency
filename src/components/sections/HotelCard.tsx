import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { MapPin, Star, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Hotel } from "@/data/hotels";
import { localize, formatPrice } from "@/lib/utils";
import { BLUR_DATA_URL } from "@/lib/images";
import { siteConfig } from "@/config/site";

function fromPrice(hotel: Hotel): number | null {
  const prices = [
    hotel.priceSingle,
    hotel.priceCouple,
    hotel.priceTriple,
    hotel.priceQuadruple,
  ].filter((p) => p > 0);
  return prices.length ? Math.min(...prices) : null;
}

export function HotelCard({ hotel, priority }: { hotel: Hotel; priority?: boolean }) {
  const locale = useLocale();
  const t = useTranslations("Hotels");
  const tc = useTranslations("Common");
  const price = fromPrice(hotel);

  return (
    <Link
      href={`/hotels/${hotel.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-500 hover:border-gold/40 hover:shadow-[0_24px_60px_-32px_rgba(26,26,23,0.4)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={hotel.image}
          alt={localize(hotel.name, locale)}
          fill
          sizes="(min-width: 1024px) 32rem, (min-width: 640px) 45vw, 90vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          priority={priority}
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent opacity-60" />
        {hotel.stars > 0 && (
          <span className="absolute top-3 end-3 inline-flex items-center gap-1 rounded-full bg-canvas/90 px-2.5 py-1 text-xs font-medium text-ink backdrop-blur">
            <Star className="size-3 fill-gold text-gold" />
            {hotel.stars}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl leading-snug text-balance transition-colors group-hover:text-gold-deep">
          {localize(hotel.name, locale)}
        </h3>
        <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="size-4 text-gold-deep" />
          {hotel.location}
        </p>

        <div className="mt-6 flex items-end justify-between border-t border-line pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors group-hover:text-gold-deep">
            {t("viewHotel")}
            <ArrowUpRight className="size-4 rtl:rotate-[-90deg]" />
          </span>
          {price != null && (
            <span className="text-end">
              <span className="block text-[0.7rem] uppercase tracking-wide text-faint">
                {tc("from")}
              </span>
              <span className="text-lg font-medium text-ink">
                {formatPrice(price, locale, siteConfig.currency)}
              </span>
              <span className="ms-1 text-xs text-muted">{t("perNight")}</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
