"use client";

import { useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Marwen Travel emblem.
 *
 * Prefers the raster brand mark at `/public/logo.jpg` (the real circular
 * badge). If the file is missing it falls back to a vector recreation using
 * the brand tokens (`--color-sea` / `--color-gold`), so the site never renders
 * a broken image while the asset is being uploaded.
 */
export function LogoMark({ className }: { className?: string }) {
  const [rasterOk, setRasterOk] = useState(true);

  if (rasterOk) {
    return (
      <span
        className={cn(
          "relative inline-block overflow-hidden rounded-full bg-sea",
          className,
        )}
      >
        <Image
          src="/logo.jpg"
          alt={siteConfig.name}
          fill
          sizes="(min-width: 768px) 40px, 36px"
          className="object-cover"
          onError={() => setRasterOk(false)}
          priority
          unoptimized
        />
      </span>
    );
  }

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-hidden="true"
      fill="none"
    >
      <circle cx="32" cy="32" r="32" fill="var(--color-sea)" />
      <circle
        cx="32"
        cy="32"
        r="25"
        stroke="var(--color-gold)"
        strokeWidth="1.5"
        opacity="0.85"
      />
      <g
        transform="translate(32 32) rotate(-45) translate(-12 -12)"
        stroke="var(--color-gold)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      </g>
    </svg>
  );
}

/**
 * Full brand lockup: emblem + wordmark. `tone` adapts the wordmark colour to
 * the surface it sits on (light header vs. dark footer).
 */
export function Logo({
  className,
  markClassName,
  tone = "dark",
}: {
  className?: string;
  markClassName?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={cn("size-9 md:size-10 shrink-0", markClassName)} />
      <span
        className={cn(
          "font-display leading-none tracking-tight",
          tone === "light" ? "text-canvas" : "text-ink",
        )}
      >
        {siteConfig.name}
        <span className="text-gold">.</span>
      </span>
    </span>
  );
}
