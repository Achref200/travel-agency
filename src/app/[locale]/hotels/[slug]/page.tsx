import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapPin, Star, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { localize } from "@/lib/utils";
import { BLUR_DATA_URL } from "@/lib/images";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { HotelBookingForm } from "@/components/sections/HotelBookingForm";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";
import { getHotel, getHotelSlugs } from "@/lib/content";

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getHotelSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const hotel = await getHotel(slug);
  if (!hotel) return {};
  return pageMetadata({
    locale,
    path: `/hotels/${slug}`,
    title: localize(hotel.name, locale),
    description: localize(hotel.description, locale),
    image: hotel.image,
  });
}

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const hotel = await getHotel(slug);
  if (!hotel) notFound();

  const t = await getTranslations("Hotels");
  const tNav = await getTranslations("Nav");

  return (
    <article>
      {/* Banner */}
      <section className="relative isolate flex min-h-[380px] items-end overflow-hidden bg-sea md:h-[54vh]">
        <Parallax className="absolute inset-0 -z-10" distance={48}>
          <Image
            src={hotel.image}
            alt=""
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover"
          />
        </Parallax>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-sea via-sea/60 to-sea/20" />

        <div className="shell pb-12 pt-24 text-canvas">
          <nav aria-label="Breadcrumb" className="text-sm text-canvas/70">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-canvas">
                  {tNav("home")}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/hotels" className="hover:text-canvas">
                  {tNav("hotels")}
                </Link>
              </li>
            </ol>
          </nav>

          {hotel.stars > 0 && (
            <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-canvas/15 px-3 py-1 text-xs font-medium backdrop-blur">
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <Star key={i} className="size-3 fill-gold text-gold" />
              ))}
            </span>
          )}
          <h1 className="mt-4 max-w-3xl font-display text-4xl md:text-6xl text-balance">
            {localize(hotel.name, locale)}
          </h1>
          <p className="mt-4 inline-flex items-center gap-2 text-canvas/85">
            <MapPin className="size-[1.125rem] text-gold" />
            {hotel.location}
          </p>
        </div>
      </section>

      {/* Body */}
      <Section tone="canvas">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Reveal>
              <p className="text-xl leading-relaxed text-ink text-pretty">
                {localize(hotel.description, locale)}
              </p>

              {hotel.amenities.length > 0 && (
                <>
                  <h2 className="mt-10 text-2xl">{t("amenities")}</h2>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {hotel.amenities.map((a, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-gold/12 text-gold-deep">
                          <Check className="size-3.5" />
                        </span>
                        <span className="text-ink">{localize(a, locale)}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </Reveal>
          </div>

          {/* Booking card */}
          <aside className="lg:col-span-2">
            <div className="sticky top-24 rounded-2xl border border-line bg-surface p-6 shadow-[0_20px_60px_-40px_rgba(26,26,23,0.5)] md:p-8">
              <HotelBookingForm
                slug={hotel.slug}
                hotelName={localize(hotel.name, locale)}
                prices={{
                  single: hotel.priceSingle,
                  couple: hotel.priceCouple,
                  triple: hotel.priceTriple,
                  quadruple: hotel.priceQuadruple,
                }}
              />
            </div>
          </aside>
        </div>
      </Section>

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: tNav("home"), path: "/" },
            { name: tNav("hotels"), path: "/hotels" },
            { name: localize(hotel.name, locale), path: `/hotels/${slug}` },
          ]),
        ]}
      />
    </article>
  );
}
