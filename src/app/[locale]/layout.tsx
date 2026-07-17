import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Inter, Cormorant_Garamond, Noto_Kufi_Arabic } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, textDirection } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { buildAlternates } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsappFab } from "@/components/layout/WhatsappFab";
import {
  JsonLd,
  organizationSchema,
  websiteSchema,
} from "@/components/seo/JsonLd";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-heading",
  display: "swap",
});

const arabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  const alternates = buildAlternates("/");

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t("defaultTitle", { siteName: siteConfig.name }),
      template: t("titleTemplate", { siteName: siteConfig.name }),
    },
    description: t("description"),
    applicationName: siteConfig.name,
    manifest: "/manifest.webmanifest",
    alternates,
    formatDetection: { telephone: true, email: true, address: true },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering for this locale.
  setRequestLocale(locale);

  const messages = await getMessages();
  const tc = await getTranslations({ locale, namespace: "Common" });
  const dir = textDirection(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      className={cn(inter.variable, cormorant.variable, arabic.variable)}
      style={
        locale === "ar"
          ? ({
              "--font-body": "var(--font-arabic)",
              "--font-heading": "var(--font-arabic)",
            } as CSSProperties)
          : undefined
      }
      suppressHydrationWarning
    >
      <body className="min-h-dvh flex flex-col antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-3 focus:start-3 focus:rounded-full focus:bg-ink focus:text-canvas focus:px-4 focus:py-2 focus:text-sm"
        >
          {tc("skipToContent")}
        </a>

        <NextIntlClientProvider locale={locale} messages={messages}>
          <JsonLd data={[organizationSchema(), websiteSchema(locale)]} />
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <WhatsappFab label={tc("whatsapp")} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
