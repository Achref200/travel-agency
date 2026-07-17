import { useTranslations } from "next-intl";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <section className="grid min-h-[70vh] place-items-center bg-canvas">
      <div className="shell text-center">
        <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-gold/10 text-gold-deep">
          <Compass className="size-8" />
        </span>
        <p className="mt-6 font-display text-7xl text-line">404</p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl">{t("title")}</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">{t("subtitle")}</p>
        <div className="mt-8">
          <Button href="/">{t("cta")}</Button>
        </div>
      </div>
    </section>
  );
}
