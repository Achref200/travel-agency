import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Marwen Travel emblem — a vector recreation of the brand badge:
 * a deep-navy disc, a gold ring and a gold airplane.
 *
 * Uses the brand design tokens (`--color-sea` / `--color-gold`) so it stays
 * in sync with the palette. The navy disc reads as a solid badge on light
 * surfaces (header) and dissolves into navy backgrounds (footer), where the
 * gold ring + plane still define the mark.
 *
 * To use the real raster/vector artwork instead, drop it in `/public`
 * (e.g. `logo.svg`) and swap this component for a `next/image`.
 */
export function LogoMark({ className }: { className?: string }) {
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
