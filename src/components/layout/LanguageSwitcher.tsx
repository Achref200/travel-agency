"use client";

import { useLocale } from "next-intl";
import { useState, useRef, useEffect, useTransition } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, LOCALE_LABELS } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function switchTo(next: string) {
    setOpen(false);
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        disabled={isPending}
        className="inline-flex items-center gap-1.5 rounded-full px-3 h-9 text-sm text-ink/80 hover:text-ink hover:bg-ink/[0.05] transition-colors"
      >
        <Globe className="size-4" aria-hidden />
        <span className="uppercase tracking-wide">{locale}</span>
        <ChevronDown
          className={cn("size-3.5 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute end-0 mt-2 w-44 rounded-md border border-line bg-surface py-1.5 shadow-lg shadow-ink/5 z-50"
        >
          {routing.locales.map((code) => {
            const meta = LOCALE_LABELS[code];
            const active = code === locale;
            return (
              <li key={code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => switchTo(code)}
                  className={cn(
                    "flex w-full items-center gap-3 px-3.5 py-2 text-sm text-start hover:bg-canvas transition-colors",
                    active ? "text-ink" : "text-muted",
                  )}
                >
                  <span className="text-base leading-none" aria-hidden>
                    {meta.flag}
                  </span>
                  <span className="flex-1">{meta.label}</span>
                  {active && <Check className="size-4 text-gold" aria-hidden />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
