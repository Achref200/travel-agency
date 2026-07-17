import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import type { Tour } from "@/data/tours";
import { TourCard } from "./TourCard";

export function ToursSection({ tours, limit }: { tours: Tour[]; limit?: number }) {
  const t = useTranslations("Tours");
  const list = limit ? tours.slice(0, limit) : tours;

  return (
    <Section id="tours" tone="canvas">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          align="start"
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <Reveal>
          <Button href="/tours" variant="secondary">
            {t("viewAll")}
            <ArrowRight className="size-4 rtl:rotate-180" />
          </Button>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((tour, i) => (
          <Reveal key={tour.slug} delay={(i % 3) * 0.08}>
            <TourCard tour={tour} priority={i < 3} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
