import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/config/site";

/** Legal slug → translation key inside the `Footer.links` namespace. */
const LEGAL: Record<string, string> = {
  privacy: "privacy",
  terms: "terms",
  "passenger-agreement": "passengerContract",
  "purchase-agreement": "purchaseContract",
  "data-protection": "dataProtection",
};

export function generateStaticParams() {
  return Object.keys(LEGAL).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const key = LEGAL[slug];
  if (!key) return {};
  const t = await getTranslations({ locale, namespace: "Footer" });
  const title = t(`links.${key}`);
  return pageMetadata({
    locale,
    path: `/legal/${slug}`,
    title,
    description: title,
    noIndex: true,
  });
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const key = LEGAL[slug];
  if (!key) notFound();

  const tFooter = await getTranslations({ locale, namespace: "Footer" });
  const t = await getTranslations({ locale, namespace: "Legal" });
  const title = tFooter(`links.${key}`);

  return (
    <>
      <PageHeader title={title} />
      <Section tone="canvas">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm text-faint">
            {t("lastUpdated")}: {siteConfig.foundedYear}
          </p>
          <p className="mt-6 leading-relaxed text-muted">
            {t("intro", { title })}
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            {t("contact", { email: siteConfig.contact.email })}
          </p>
        </div>
      </Section>
    </>
  );
}
