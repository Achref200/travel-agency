import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { HotelCard } from "@/components/sections/HotelCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { getHotels } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Hotels" });
  return pageMetadata({
    locale,
    path: "/hotels",
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

export default async function HotelsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Hotels" });
  const hotels = await getHotels();

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <Section tone="canvas">
        {hotels.length === 0 ? (
          <p className="text-muted">—</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hotels.map((hotel, i) => (
              <Reveal key={hotel.slug} delay={(i % 3) * 0.08}>
                <HotelCard hotel={hotel} priority={i < 3} />
              </Reveal>
            ))}
          </div>
        )}
      </Section>
      <CtaBand />
    </>
  );
}
