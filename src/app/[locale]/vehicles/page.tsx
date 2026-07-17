import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Users, Briefcase, ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { CtaBand } from "@/components/sections/CtaBand";
import { getVehicles } from "@/lib/content";
import { localize } from "@/lib/utils";
import { BLUR_DATA_URL } from "@/lib/images";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return pageMetadata({
    locale,
    path: "/vehicles",
    title: t("vehicles.title"),
    description: t("vehicles.description"),
  });
}

export default async function VehiclesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Vehicles" });
  const vehicles = await getVehicles();

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <Section tone="canvas">
        <div className="grid gap-6 md:grid-cols-2">
          {vehicles.map((v, i) => (
            <Reveal key={v.slug} delay={(i % 2) * 0.08}>
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={v.image}
                    alt={v.name}
                    fill
                    sizes="(min-width: 768px) 40rem, 90vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover"
                  />
                  <span className="absolute top-3 start-3 rounded-full bg-canvas/90 px-3 py-1 text-xs font-medium text-ink backdrop-blur">
                    {localize(v.className, locale)}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-xl">{v.name}</h2>

                  <div className="mt-4 flex gap-5 text-sm text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="size-4 text-gold-deep" />
                      {t("specs.passengers")}: {v.passengers}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Briefcase className="size-4 text-gold-deep" />
                      {t("specs.luggage")}: {v.luggage}
                    </span>
                  </div>

                  <ul className="mt-5 space-y-1.5 text-sm text-muted">
                    {v.features.map((f, fi) => (
                      <li key={fi}>· {localize(f, locale)}</li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-2">
                    <Button href="/booking" variant="secondary" size="sm">
                      {t("bookThis")}
                      <ArrowRight className="size-4 rtl:rotate-180" />
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
