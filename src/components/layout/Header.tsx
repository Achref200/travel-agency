"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X, MessageCircle } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { mainNav } from "@/config/nav";
import { siteConfig, whatsappLink } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

export function Header() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled || menuOpen
            ? "bg-canvas/85 backdrop-blur-md border-b border-line shadow-[0_1px_20px_rgba(26,26,23,0.04)]"
            : "bg-canvas/40 backdrop-blur-sm border-b border-transparent",
        )}
      >
      <div className="shell flex h-16 md:h-20 items-center justify-between gap-6">
        {/* Brand */}
        <Link href="/" aria-label={siteConfig.name}>
          <Logo className="text-2xl md:text-[1.7rem]" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          {mainNav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "px-3.5 py-2 text-[0.9rem] rounded-full transition-colors",
                isActive(item.href)
                  ? "text-ink"
                  : "text-muted hover:text-ink hover:bg-ink/[0.04]",
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-2">
          <LanguageSwitcher />
          <Button href="/booking" size="sm">
            {t("bookNow")}
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center size-10 -me-2 text-ink"
          aria-label={menuOpen ? t("close") : t("menu")}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
        </div>
      </header>

      {/* Mobile overlay menu — rendered as a SIBLING of <header> on purpose:
          the header's backdrop-blur establishes a containing block for fixed
          descendants, which would trap this panel inside the ~64px bar and
          strip its background. Keeping it outside anchors it to the viewport. */}
      <div
        className={cn(
          "lg:hidden fixed inset-x-0 top-16 md:top-20 bottom-0 z-40 bg-canvas transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          menuOpen
            ? "opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 -translate-y-2",
        )}
      >
        <div className="shell flex flex-col h-full py-8">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {mainNav.map((item, i) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "font-display text-2xl py-3 border-b border-line/70 transition-colors",
                  isActive(item.href) ? "text-gold" : "text-ink",
                )}
                style={{ transitionDelay: `${i * 20}ms` }}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-4 pt-8">
            <LanguageSwitcher />
            <Button href="/booking" size="lg" onClick={() => setMenuOpen(false)}>
              {t("bookNow")}
            </Button>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-muted hover:text-ink"
            >
              <MessageCircle className="size-4" />
              {siteConfig.contact.phone}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
