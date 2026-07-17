import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PlaneLanding, UserCheck, Sofa, Plane } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";

const steps = [
  { key: "land", Icon: PlaneLanding },
  { key: "meet", Icon: UserCheck },
  { key: "relax", Icon: Sofa },
] as const;

const airports = [
  { code: "IST", name: "Istanbul Airport" },
  { code: "SAW", name: "Sabiha Gökçen" },
  { code: "AYT", name: "Antalya" },
  { code: "BJV", name: "Bodrum" },
  { code: "ADB", name: "Izmir" },
  { code: "DLM", name: "Dalaman" },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return pageMetadata({
    locale,
    path: "/meeting-points",
    title: t("meetingPoints.title"),
    description: t("meetingPoints.description"),
  });
}

export default async function MeetingPointsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "MeetingPoints" });

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <Section tone="canvas">
        <h2 className="text-center font-display text-3xl md:text-4xl">
          {t("steps.title")}
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.key} delay={i * 0.1}>
              <div className="relative h-full rounded-2xl border border-line bg-surface p-8">
                <span className="absolute end-6 top-6 font-display text-5xl text-line">
                  {i + 1}
                </span>
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-gold/10 text-gold-deep">
                  <s.Icon className="size-6" />
                </span>
                <h3 className="mt-5 text-xl">{t(`steps.${s.key}.title`)}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">
                  {t(`steps.${s.key}.desc`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {airports.map((a, i) => (
            <Reveal key={a.code} delay={(i % 3) * 0.06}>
              <div className="flex items-center gap-4 rounded-xl border border-line bg-canvas p-5">
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-gold/10 text-gold-deep">
                  <Plane className="size-5" />
                </span>
                <span>
                  <span className="block font-medium text-ink">{a.name}</span>
                  <span className="text-sm tracking-wider text-faint">
                    {a.code}
                  </span>
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
