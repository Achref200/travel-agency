import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { stockImage, BLUR_DATA_URL } from "@/lib/images";
import { whatsappLink } from "@/config/site";

export function CtaBand() {
  const t = useTranslations("Cta");

  return (
    <section className="relative isolate overflow-hidden bg-sea-deep">
      <Parallax className="absolute inset-0 -z-10" distance={60}>
        <Image
          src={stockImage("bosphorus-evening-cta", 2000, 1100)}
          alt=""
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover opacity-40"
        />
      </Parallax>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-sea-deep via-sea-deep/80 to-sea-deep/60" />

      <div className="shell py-24 md:py-32">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl md:text-6xl text-canvas text-balance">
            {t("title")}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-canvas/75 text-pretty">
            {t("subtitle")}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button href="/booking" size="lg" variant="onDark">
              {t("primary")}
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Button>
            <Button href={whatsappLink()} external size="lg" variant="outlineDark">
              <MessageCircle className="size-4" />
              {t("secondary")}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
