import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "start";
  /** "light" = on a light background (dark text); "dark" = on a dark section. */
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-start",
        className,
      )}
    >
      {eyebrow && (
        <p className={cn("eyebrow", tone === "dark" && "text-gold-soft")}>
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "mt-3 text-4xl md:text-5xl",
          tone === "dark" ? "text-canvas" : "text-ink",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed text-pretty",
            tone === "dark" ? "text-canvas/70" : "text-muted",
          )}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
