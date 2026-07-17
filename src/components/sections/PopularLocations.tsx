import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import type { Route } from "@/data/locations";
import { LocationTabs } from "./LocationTabs";

export function PopularLocations({ routes }: { routes: Route[] }) {
  const t = useTranslations("Locations");

  return (
    <Section tone="surface">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <Reveal className="mt-12">
        <LocationTabs routes={routes} />
        <p className="mt-6 text-center text-xs text-faint max-w-2xl mx-auto">
          {t("note")}
        </p>
      </Reveal>
    </Section>
  );
}
