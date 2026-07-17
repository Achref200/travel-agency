import { useTranslations } from "next-intl";
import { Star, Quote } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

const keys = ["one", "two", "three"] as const;

export function Testimonials() {
  const t = useTranslations("Testimonials");

  return (
    <Section tone="surface">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {keys.map((key, i) => (
          <Reveal key={key} delay={i * 0.08}>
            <figure className="flex h-full flex-col rounded-2xl border border-line bg-canvas p-8">
              <Quote className="size-8 text-gold/40" aria-hidden />
              <div className="mt-4 flex items-center gap-1" aria-hidden>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="size-4 fill-gold text-gold" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-[0.975rem] leading-relaxed text-ink/90">
                “{t(`items.${key}.quote`)}”
              </blockquote>
              <figcaption className="mt-6 border-t border-line pt-4">
                <span className="block font-medium text-ink">
                  {t(`items.${key}.author`)}
                </span>
                <span className="text-sm text-muted">
                  {t(`items.${key}.origin`)}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
