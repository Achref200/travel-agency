import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Receipt, UserRound, Zap, Code2 } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/sections/ContactForm";

const benefits = [
  { key: "billing", Icon: Receipt },
  { key: "manager", Icon: UserRound },
  { key: "priority", Icon: Zap },
  { key: "api", Icon: Code2 },
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
    path: "/business",
    title: t("business.title"),
    description: t("business.description"),
  });
}

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Business" });

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <Section tone="canvas">
        <div className="grid gap-6 sm:grid-cols-2">
          {benefits.map((b, i) => (
            <Reveal key={b.key} delay={i * 0.08}>
              <div className="flex h-full gap-5 rounded-2xl border border-line bg-surface p-7">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold-deep">
                  <b.Icon className="size-[1.375rem]" />
                </span>
                <div>
                  <h3 className="text-lg">{t(`benefits.${b.key}.title`)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {t(`benefits.${b.key}.desc`)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <h2 className="text-center text-3xl md:text-4xl">{t("formTitle")}</h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-muted">
              {t("formSubtitle")}
            </p>
          </Reveal>
          <Reveal className="mt-10">
            <ContactForm presetSubject={t("formTitle")} />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
