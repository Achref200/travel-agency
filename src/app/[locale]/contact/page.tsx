import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Phone, MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/sections/ContactForm";
import { siteConfig, whatsappLink, telLink } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return pageMetadata({
    locale,
    path: "/contact",
    title: t("contact.title"),
    description: t("contact.description"),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Contact" });
  const tc = await getTranslations({ locale, namespace: "Common" });

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <Section tone="canvas">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
          <aside>
            <h2 className="text-2xl">{t("infoTitle")}</h2>
            <ul className="mt-6 space-y-5">
              <InfoRow
                icon={<Phone className="size-5" />}
                label={tc("callUs")}
                value={siteConfig.contact.phone}
                href={telLink()}
              />
              <InfoRow
                icon={<MessageCircle className="size-5" />}
                label={tc("whatsapp")}
                value={siteConfig.contact.phone}
                href={whatsappLink()}
                external
              />
              <InfoRow
                icon={<Mail className="size-5" />}
                label={tc("email")}
                value={siteConfig.contact.email}
                href={`mailto:${siteConfig.contact.email}`}
              />
              <InfoRow
                icon={<MapPin className="size-5" />}
                label={siteConfig.contact.address.city}
                value={`${siteConfig.contact.address.line1}, ${siteConfig.contact.address.district}`}
                href={siteConfig.contact.mapUrl}
                external
              />
              <InfoRow
                icon={<Clock className="size-5" />}
                label={t("hoursLabel")}
                value={t("hoursValue")}
              />
            </ul>
          </aside>

          <div className="rounded-3xl border border-line bg-surface p-6 md:p-8">
            <h2 className="text-2xl">{t("formTitle")}</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

function InfoRow({
  icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <>
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold-deep">
        {icon}
      </span>
      <span>
        <span className="block text-xs uppercase tracking-wide text-faint">
          {label}
        </span>
        <span className="text-ink">{value}</span>
      </span>
    </>
  );

  return (
    <li>
      {href ? (
        <a
          href={href}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className="flex items-center gap-4 transition-opacity hover:opacity-80"
        >
          {content}
        </a>
      ) : (
        <div className="flex items-center gap-4">{content}</div>
      )}
    </li>
  );
}
