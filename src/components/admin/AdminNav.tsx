"use client";

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
  CalendarCheck,
  Mail,
  LogOut,
  ExternalLink,
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
};

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <aside className="flex w-60 shrink-0 flex-col border-e border-line bg-surface">
      <div className="border-b border-line p-5">
        <Link href="/admin" className="text-lg font-semibold">
          {siteConfig.name}
          <span className="text-gold">.</span>
          <span className="ms-1 text-xs font-normal text-faint">admin</span>
        </Link>
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
