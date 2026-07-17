"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import type { FaqItem } from "@/data/faq";
import { localize, cn } from "@/lib/utils";

export function FaqSection({
  items,
  showHeading = true,
  limit,
}: {
  items: FaqItem[];
  showHeading?: boolean;
  limit?: number;
}) {
  const t = useTranslations("Faq");
  const locale = useLocale();
  const [open, setOpen] = useState<number | null>(0);
  const list = limit ? items.slice(0, limit) : items;

  return (
    <Section tone="canvas">
      {showHeading && (
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
      )}

      <div className="mx-auto mt-12 max-w-3xl">
        <ul className="divide-y divide-line border-y border-line">
          {list.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={i}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 py-5 text-start"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-display text-base text-terracotta tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "text-lg transition-colors",
                          isOpen ? "text-gold-deep" : "text-ink",
                        )}
                      >
                        {localize(item.question, locale)}
                      </span>
                    </span>
                    <Plus
                      className={cn(
                        "size-5 shrink-0 text-gold-deep transition-transform duration-300",
                        isOpen && "rotate-45",
                      )}
                    />
                  </button>
                </h3>
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 ps-9 pe-8 text-[0.95rem] leading-relaxed text-muted">
                      {localize(item.answer, locale)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <p className="text-muted">{t("more")}</p>
          <Button href="/contact" variant="secondary">
            {t("contactCta")}
          </Button>
        </div>
      </div>
    </Section>
  );
}
