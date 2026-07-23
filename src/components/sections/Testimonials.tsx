import { useLocale, useTranslations } from "next-intl";
import { Star, Quote } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import type { Testimonial } from "@/data/testimonials";
import { localize } from "@/lib/utils";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const t = useTranslations("Testimonials");
  const locale = useLocale();

  // Fully admin-driven — hide the section when there are no published reviews.
  if (testimonials.length === 0) return null;

  return (
    <Section tone="surface">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="mt-10 sm:mt-12 grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item, i) => {
          const stars = Math.max(0, Math.min(5, Math.round(item.rating)));
          return (
            <Reveal key={`${item.author}-${i}`} delay={(i % 3) * 0.08}>
              <figure className="flex h-full flex-col rounded-2xl border border-line bg-canvas p-6 sm:p-8">
                <Quote className="size-7 sm:size-8 text-gold/40" aria-hidden />
                {stars > 0 && (
                  <div
                    className="mt-4 flex items-center gap-1"
                    aria-label={`${stars} out of 5 stars`}
                  >
                    {Array.from({ length: stars }).map((_, s) => (
                      <Star key={s} className="size-4 fill-gold text-gold" />
                    ))}
                  </div>
                )}
                <blockquote className="mt-4 flex-1 text-[0.95rem] sm:text-[0.975rem] leading-relaxed text-ink/90 text-pretty">
                  “{localize(item.quote, locale)}”
                </blockquote>
                <figcaption className="mt-6 border-t border-line pt-4">
                  <span className="block font-medium text-ink">{item.author}</span>
                  {item.origin && (
                    <span className="text-sm text-muted">{item.origin}</span>
                  )}
                </figcaption>
              </figure>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
