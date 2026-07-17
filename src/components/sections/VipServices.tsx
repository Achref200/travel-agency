import Image from "next/image";
import { useTranslations } from "next-intl";
import { Sparkles, Car, UserRound, Plane } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { stockImage, BLUR_DATA_URL } from "@/lib/images";

const items = [
  { key: "meetGreet", Icon: Sparkles },
  { key: "fleet", Icon: Car },
  { key: "chauffeur", Icon: UserRound },
  { key: "security", Icon: Plane },
] as const;

export function VipServices() {
  const t = useTranslations("Vip");

  return (
    <Section tone="sea">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="order-last lg:order-first">
          <Parallax className="aspect-[4/5] rounded-3xl" distance={44}>
            <Image
              src={stockImage("vip-chauffeur-luxury", 1100, 1375)}
              alt=""
              fill
              sizes="(min-width: 1024px) 40rem, 90vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="object-cover"
            />
          </Parallax>
        </Reveal>

        <div>
          <SectionHeading
            align="start"
            tone="dark"
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
          />

          <div className="mt-10 space-y-8">
            {items.map((item, i) => (
              <Reveal key={item.key} delay={i * 0.08}>
                <div className="flex gap-5">
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-canvas/20 text-gold">
                    <item.Icon className="size-[1.375rem]" />
                  </span>
                  <div>
                    <h3 className="text-xl text-canvas">
                      {t(`items.${item.key}.title`)}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-canvas/70">
                      {t(`items.${item.key}.desc`)}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
