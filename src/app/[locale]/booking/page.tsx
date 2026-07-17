import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import {
  BookingForm,
  type BookingDefaults,
} from "@/components/sections/BookingForm";

type SP = Record<string, string | string[] | undefined>;

function str(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return pageMetadata({
    locale,
    path: "/booking",
    title: t("booking.title"),
    description: t("booking.description"),
  });
}

export default async function BookingPageRoute({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SP>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "BookingPage" });

  const defaults: BookingDefaults = {
    from: str(sp.from),
    to: str(sp.to),
    date: str(sp.date),
    pax: str(sp.pax),
    mode: str(sp.mode),
    hours: str(sp.hours),
    return: str(sp.return),
  };

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <Section tone="canvas">
        <BookingForm defaults={defaults} />
      </Section>
    </>
  );
}
