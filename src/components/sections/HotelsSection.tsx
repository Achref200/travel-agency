import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import type { Hotel } from "@/data/hotels";
import { HotelCard } from "./HotelCard";

export function HotelsSection({ hotels, limit }: { hotels: Hotel[]; limit?: number }) {
  const t = useTranslations("Hotels");
  const list = limit ? hotels.slice(0, limit) : hotels;

  // Hide the section entirely when there are no published hotel partners.
  if (list.length === 0) return null;

  return (
    <Section id="hotels" tone="surface">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          align="start"
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <Reveal>
          <Button href="/hotels" variant="secondary">
            {t("viewAll")}
            <ArrowRight className="size-4 rtl:rotate-180" />
          </Button>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((hotel, i) => (
          <Reveal key={hotel.slug} delay={(i % 3) * 0.08}>
            <HotelCard hotel={hotel} priority={i < 3} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
