import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import type { GalleryImage } from "@/data/gallery";
import { localize, cn } from "@/lib/utils";
import { BLUR_DATA_URL } from "@/lib/images";

export function GallerySection({ images }: { images: GalleryImage[] }) {
  const t = useTranslations("Gallery");
  const locale = useLocale();

  return (
    <Section tone="canvas">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <Reveal className="mt-12">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 auto-rows-[160px] md:auto-rows-[220px]">
          {images.map((img, i) => (
            <div
              key={i}
              className={cn(
                "group relative overflow-hidden rounded-2xl",
                img.wide && "col-span-2",
                img.tall && "row-span-2",
              )}
            >
              <Image
                src={img.src}
                alt={localize(img.alt, locale)}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/10" />
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
