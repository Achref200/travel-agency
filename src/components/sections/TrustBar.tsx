import { useTranslations } from "next-intl";
import { ShieldCheck, Hand, CalendarCheck, Headset } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { siteConfig } from "@/config/site";

const items = [
  { key: "fixedPrice", Icon: ShieldCheck },
  { key: "meetGreet", Icon: Hand },
  { key: "freeCancellation", Icon: CalendarCheck },
  { key: "support", Icon: Headset },
] as const;

export function TrustBar() {
  const t = useTranslations("Trust");

  return (
    <Section tone="canvas" className="pt-36 md:pt-32">
      <SectionHeading
        eyebrow={t("eyebrow", { siteName: siteConfig.name })}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <Reveal key={item.key} delay={i * 0.08}>
            <div className="group h-full rounded-2xl border border-line bg-surface p-7 transition-colors hover:border-gold/50">
              <span className="inline-flex items-center justify-center size-12 rounded-full bg-gold/10 text-gold-deep transition-colors group-hover:bg-gold group-hover:text-ink">
                <item.Icon className="size-[1.375rem]" />
              </span>
              <h3 className="mt-5 text-xl">{t(`items.${item.key}.title`)}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                {t(`items.${item.key}.desc`)}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
