import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "canvas" | "surface" | "sea" | "shell";

const tones: Record<Tone, string> = {
  canvas: "bg-canvas text-ink",
  surface: "bg-surface text-ink",
  sea: "bg-sea text-canvas",
  shell: "bg-shell text-ink",
};

export function Section({
  id,
  children,
  className,
  container = true,
  tone = "canvas",
  as: Tag = "section",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  container?: boolean;
  tone?: Tone;
  as?: "section" | "div";
}) {
  return (
    <Tag id={id} className={cn("py-20 md:py-28", tones[tone], className)}>
      {container ? <div className="shell">{children}</div> : children}
    </Tag>
  );
}
