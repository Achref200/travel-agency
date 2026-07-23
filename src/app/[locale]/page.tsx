import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import {
  getTours,
  getHotels,
  getRoutes,
  getFaqItems,
  getGalleryImages,
  getTestimonials,
} from "@/lib/content";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { ToursSection } from "@/components/sections/ToursSection";
import { HotelsSection } from "@/components/sections/HotelsSection";
import { PopularLocations } from "@/components/sections/PopularLocations";
import { VipServices } from "@/components/sections/VipServices";
import { Testimonials } from "@/components/sections/Testimonials";
import { GallerySection } from "@/components/sections/GallerySection";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd, faqSchema } from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return pageMetadata({
    locale,
    path: "/",
    title: t("home.title"),
    description: t("home.description"),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [tours, hotels, routes, faqItems, gallery, testimonials] =
    await Promise.all([
      getTours(),
      getHotels(),
      getRoutes(),
      getFaqItems(),
      getGalleryImages(),
      getTestimonials(),
    ]);

  return (
    <>
      <Hero />
      <TrustBar />
      <ToursSection tours={tours} limit={6} />
      <HotelsSection hotels={hotels} limit={3} />
      <PopularLocations routes={routes} />
      <VipServices />
      <Testimonials testimonials={testimonials} />
      <GallerySection images={gallery} />
      <FaqSection items={faqItems} />
      <CtaBand />
      <JsonLd data={faqSchema(faqItems, locale)} />
    </>
  );
}
