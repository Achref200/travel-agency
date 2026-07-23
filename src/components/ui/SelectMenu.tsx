"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectOption = { value: string; label: string };

/**
 * A fully design-system-styled dropdown (trigger + option list). The option
 * list is rendered in a portal on `document.body` so no parent's
 * `overflow-hidden`, `transform`, `filter`, or z-index stacking context can
 * clip or cover it. Position + open direction are recalculated on scroll and
 * resize while open.
 */
export function SelectMenu({
  label,
  icon,
  value,
  onChange,
  options,
  className,
  menuPlacement = "auto",
}: {
  label?: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
  menuPlacement?: "auto" | "up" | "down";
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{
    top: number;
    bottom: number;
    left: number;
    width: number;
    drop: "up" | "down";
  }>({ top: 0, bottom: 0, left: 0, width: 0, drop: "down" });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-mount guard for the portalled menu
    setMounted(true);
  }, []);

  // Close on outside click / Escape (the portalled menu is outside the wrapper
  // in the DOM, so we check it explicitly).
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (wrapperRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Compute + track menu position while open (fixed to viewport).
  useLayoutEffect(() => {
    if (!open) return;
    const recompute = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const menuEstimate = Math.min(224, options.length * 36 + 8);
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const drop: "up" | "down" =
        menuPlacement === "up"
          ? "up"
          : menuPlacement === "down"
            ? "down"
            : spaceBelow < menuEstimate && spaceAbove > spaceBelow
              ? "up"
              : "down";
      setPos({
        top: rect.bottom + 6,
        bottom: window.innerHeight - rect.top + 6,
        left: rect.left,
        width: rect.width,
        drop,
      });
    };
    recompute();
    window.addEventListener("scroll", recompute, true);
    window.addEventListener("resize", recompute);
    return () => {
      window.removeEventListener("scroll", recompute, true);
      window.removeEventListener("resize", recompute);
    };
  }, [open, menuPlacement, options.length]);

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      {label && (
        <span className="mb-1.5 block text-[0.7rem] uppercase tracking-wide text-faint">
          {label}
        </span>
      )}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex h-11 w-full items-center gap-2 rounded-lg border bg-canvas/60 px-3 text-start transition-colors",
          open ? "border-ink" : "border-line hover:border-ink/40",
        )}
      >
        {icon && (
          <span className="shrink-0 text-gold-deep" aria-hidden>
            {icon}
          </span>
        )}
        <span className="flex-1 truncate text-sm text-ink">
          {current?.label ?? value}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-faint transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {mounted && open &&
        createPortal(
          <ul
            ref={menuRef}
            role="listbox"
            style={{
              position: "fixed",
              top: pos.drop === "down" ? pos.top : undefined,
              bottom: pos.drop === "up" ? pos.bottom : undefined,
              left: pos.left,
              width: pos.width,
              zIndex: 1000,
            }}
            className="max-h-56 overflow-auto rounded-lg border border-line bg-surface py-1 shadow-lg shadow-ink/20"
          >
            {options.map((o) => {
              const active = o.value === value;
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 px-3 py-2 text-start text-sm transition-colors hover:bg-canvas",
                      active ? "font-medium text-ink" : "text-muted",
                    )}
                  >
                    {o.label}
                    {active && <Check className="size-4 text-gold-deep" />}
                  </button>
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </div>
  );
}
