"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

/**
 * Route-level fallback. Without this a failed DB read renders a blank page;
 * visitors now get a branded message and a retry that re-runs the render.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Error");

  useEffect(() => {
    console.error("route_error", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <main className="shell flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <h1 className="font-display text-4xl text-ink md:text-5xl">{t("title")}</h1>
      <p className="mt-4 max-w-md text-muted">{t("body")}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex h-12 items-center rounded-full bg-ink px-7 text-sm font-medium text-canvas transition-colors hover:bg-gold hover:text-ink"
      >
        {t("retry")}
      </button>
    </main>
  );
}
