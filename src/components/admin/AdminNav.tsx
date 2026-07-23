"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MapPinned,
  Route as RouteIcon,
  Car,
  HelpCircle,
  Images,
  Users,
  Flag,
  Hotel,
  Quote,
  CalendarCheck,
  Mail,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { resources } from "@/lib/admin/resources";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ElementType> = {
  tours: MapPinned,
  routes: RouteIcon,
  vehicles: Car,
  faq: HelpCircle,
  gallery: Images,
  team: Users,
  milestones: Flag,
  hotels: Hotel,
  testimonials: Quote,
};

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync drawer state to route change
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const brand = (
    <Link href="/admin" className="text-lg font-semibold">
      {siteConfig.name}
      <span className="text-gold">.</span>
      <span className="ms-1 text-xs font-normal text-faint">admin</span>
    </Link>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-surface px-4 md:hidden">
        {brand}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="inline-flex size-10 items-center justify-center rounded-lg text-ink hover:bg-ink/5"
        >
          <Menu className="size-5" />
        </button>
      </div>

      {/* Backdrop (mobile only) */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      {/* Sidebar (desktop) / slide-in drawer (mobile) */}
      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-50 flex w-64 shrink-0 flex-col border-e border-line bg-surface transition-transform duration-300 ease-out",
          "md:static md:z-auto md:w-60 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-line p-5">
          {brand}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted hover:bg-ink/5 hover:text-ink md:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          <NavLink href="/admin" label="Dashboard" Icon={LayoutDashboard} active={isActive("/admin") && pathname === "/admin"} />
          <p className="px-3 pb-1 pt-4 text-[0.65rem] font-medium uppercase tracking-wider text-faint">
            Content
          </p>
          {resources.map((r) => (
            <NavLink
              key={r.key}
              href={`/admin/${r.key}`}
              label={r.label}
              Icon={ICONS[r.key] ?? LayoutDashboard}
              active={isActive(`/admin/${r.key}`)}
            />
          ))}
          <p className="px-3 pb-1 pt-4 text-[0.65rem] font-medium uppercase tracking-wider text-faint">
            Operations
          </p>
          <NavLink href="/admin/bookings" label="Bookings" Icon={CalendarCheck} active={isActive("/admin/bookings")} />
          <NavLink href="/admin/messages" label="Messages" Icon={Mail} active={isActive("/admin/messages")} />
        </nav>

        <div className="space-y-1 border-t border-line p-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-ink/5 hover:text-ink"
          >
            <ExternalLink className="size-4" />
            View site
          </a>
          <div className="truncate px-3 pt-1 text-xs text-faint">{email}</div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-danger/10 hover:text-danger"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

function NavLink({
  href,
  label,
  Icon,
  active,
}: {
  href: string;
  label: string;
  Icon: React.ElementType;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
        active ? "bg-ink text-canvas" : "text-muted hover:bg-ink/5 hover:text-ink",
      )}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
}
