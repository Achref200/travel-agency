import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock, Check, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { localize, formatPrice } from "@/lib/utils";
import { stockImage, BLUR_DATA_URL } from "@/lib/images";
import { siteConfig, whatsappLink } from "@/config/site";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { Button } from "@/components/ui/Button";
import {
  JsonLd,
  tourSchema,
  breadcrumbSchema,
} from "@/components/seo/JsonLd";
import { getTour, getTourSlugs } from "@/lib/content";

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getTourSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const tour = await getTour(slug);
  if (!tour) return {};
  return pageMetadata({
    locale,
    path: `/tours/${slug}`,
    title: localize(tour.title, locale),
    description: localize(tour.summary, locale),
    image: tour.image,
  });
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tour = await getTour(slug);
  if (!tour) notFound();

  const t = await getTranslations("Tours");
  const tc = await getTranslations("Common");
  const tNav = await getTranslations("Nav");

  const priceNote = tour.priceType === "group" ? tc("perGroup") : tc("perPerson");
  const durationText =
    tour.durationHours >= 24
      ? `${Math.round(tour.durationHours / 24)}d`
      : `${tour.durationHours}h`;

  return (
    <article>
      {/* Banner */}
      <section className="relative isolate flex min-h-[420px] items-end overflow-hidden bg-sea md:h-[62vh]">
        <Parallax className="absolute inset-0 -z-10" distance={48}>
          <Image
            src={stockImage(`${slug}-banner`, 2000, 1200)}
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
                <Link href="/tours" className="hover:text-canvas">
                  {tNav("tours")}
                </Link>
              </li>
            </ol>
          </nav>

          <span className="mt-4 inline-block rounded-full bg-canvas/15 px-3 py-1 text-xs font-medium backdrop-blur">
            {localize(tour.category, locale)}
          </span>
          <h1 className="mt-4 max-w-3xl font-display text-4xl md:text-6xl text-balance">
            {localize(tour.title, locale)}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-canvas/85">
            <span className="inline-flex items-center gap-2">
              <Clock className="size-[1.125rem] text-gold" />
              {durationText}
            </span>
            <span className="inline-flex items-baseline gap-1.5">
              <span className="text-sm text-canvas/70">{tc("from")}</span>
              <span className="text-xl font-medium text-canvas">
                {formatPrice(tour.price, locale, siteConfig.currency)}
              </span>
              <span className="text-sm text-canvas/70">· {priceNote}</span>
            </span>
          </div>
        </div>
      </section>

      {/* Body */}
      <Section tone="canvas">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Reveal>
              <p className="text-xl leading-relaxed text-ink text-pretty">
                {localize(tour.summary, locale)}
              </p>
              <p className="mt-5 leading-relaxed text-muted">
                {localize(tour.description, locale)}
              </p>

              <h2 className="mt-10 text-2xl">{t("guide")}</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {tour.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-gold/12 text-gold-deep">
                      <Check className="size-3.5" />
                    </span>
                    <span className="text-ink">{localize(h, locale)}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Booking card */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-line bg-surface p-6 shadow-[0_20px_60px_-40px_rgba(26,26,23,0.5)]">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted">{tc("from")}</span>
                <span className="text-3xl font-medium text-ink">
                  {formatPrice(tour.price, locale, siteConfig.currency)}
                </span>
              </div>
              <p className="mt-1 text-end text-xs text-muted">{priceNote}</p>

              <div className="mt-6 flex flex-col gap-3">
                <Button
                  href={whatsappLink(
                    `${tc("bookNow")}: ${localize(tour.title, locale)}`,
                  )}
                  external
                  size="lg"
                  className="w-full"
                >
                  <MessageCircle className="size-4" />
                  {tc("bookNow")}
                </Button>
                <Button href="/contact" variant="secondary" size="lg" className="w-full">
                  {tc("getQuote")}
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </Button>
              </div>

              <ul className="mt-6 space-y-2 border-t border-line pt-5 text-sm text-muted">
                {tour.highlights.slice(0, 3).map((h, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="size-4 text-gold-deep" />
                    {localize(h, locale)}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>

      <JsonLd
        data={[
          tourSchema(tour, locale),
          breadcrumbSchema([
            { name: tNav("home"), path: "/" },
            { name: tNav("tours"), path: "/tours" },
            { name: localize(tour.title, locale), path: `/tours/${slug}` },
          ]),
        ]}
      />
    </article>
  );
}
