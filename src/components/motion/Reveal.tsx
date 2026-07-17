"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Vertical travel distance in px. */
  y?: number;
  /** Delay in seconds (stagger helper). */
  delay?: number;
  /** Animation duration in seconds. */
  duration?: number;
};

/**
 * Subtle fade + rise as the element enters the viewport. Animates once.
 * Falls back to a static element when the user prefers reduced motion.
 */
export function Reveal({
  children,
  className,
  y = 18,
  delay = 0,
  duration = 0.7,
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Staggered container: children using <Reveal> can share an increasing delay. */
export function RevealGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(className)}>{children}</div>;
}
