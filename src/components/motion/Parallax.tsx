"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Deliberately gentle parallax. The inner layer drifts a few pixels as the
 * container crosses the viewport — enough to feel alive, never distracting.
 * Disabled entirely under prefers-reduced-motion.
 *
 * Wrap a full-bleed image (with `fill`) or any decorative layer. The wrapper
 * must be given a height via `className`.
 */
export function Parallax({
  children,
  className,
  distance = 40,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const raw = useTransform(
    scrollYProgress,
    [0, 1],
    [-distance / 2, distance / 2],
  );
  const y = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={reduce ? undefined : { y, scale: 1.12 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
