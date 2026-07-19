import { useTranslations } from "next-intl";
import Image from "next/image";
import { Star, ArrowRight, MessageCircle } from "lucide-react";
import { Parallax } from "@/components/motion/Parallax";
import { Button } from "@/components/ui/Button";
import { BookingWidget } from "./BookingWidget";
import { stockImage, BLUR_DATA_URL } from "@/lib/images";
import { whatsappLink } from "@/config/site";

export function Hero() {
  const t = useTranslations("Hero");
  const tc = useTranslations("Common");

  return (
    <section className="relative isolate bg-sea">
      {/* Background image with gentle parallax */}
      <Parallax className="absolute inset-0 -z-10 overflow-hidden" distance={50}>
        <Image
          src={stockImage("istanbul-bosphorus-hero", 2200, 1400)}
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover"
        />
      </Parallax>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-sea via-sea/70 to-sea/40" />
      {/* <div className="absolute inset-0 -z-10 bg-gradient-to-r from-sea/80 to-transparent" /> */}

      <div className="shell pt-12 md:pt-8 pb-16 md:pb-16">
        <div className="max-w-2xl text-canvas">
          <p className="eyebrow text-gold-soft">{t("eyebrow")}</p>
          <h1 className="mt-5 font-display text-5xl sm:text-6xl md:text-7xl leading-[1.02] text-balance">
            {t("title")}
          </h1>
          <p className="mt-4 md:mt-6 text-lg text-canvas/85 max-w-xl leading-relaxed text-pretty">
            {t("subtitle")}
          </p>

          <div className="mt-6 md:mt-8 flex flex-wrap items-center gap-3">
            <Button href="/booking" size="lg" variant="onDark">
              {tc("bookNow")}
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Button>
            <Button href={whatsappLink()} external size="lg" variant="outlineDark">
              <MessageCircle className="size-4" />
              {tc("whatsapp")}
            </Button>
          </div>

          <div className="mt-6 md:mt-9 flex items-center gap-4">
            <div className="flex items-center gap-1" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-sm text-canvas/80">
              <strong className="text-canvas font-medium">4.9</strong> · {t("ratingLabel")}
            </span>
          </div>
        </div>
      </div>

      {/* Booking widget — overlaps into the next section */}
      <div className="shell relative z-10">
        <div className="-mb-24 md:-mb-16">
          <BookingWidget />
        </div>
      </div>
    </section>
  );
}
