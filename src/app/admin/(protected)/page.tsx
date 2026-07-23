import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { resources } from "@/lib/admin/resources";
import { siteConfig } from "@/config/site";
import { cn, formatPrice } from "@/lib/utils";
import { CalendarCheck, Mail, ArrowRight, CalendarRange } from "lucide-react";

export const dynamic = "force-dynamic";

const RANGE_PRESETS = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "all", label: "All time" },
] as const;

const DAY = 24 * 60 * 60 * 1000;

/** Resolve a preset key or explicit from/to into a date window + label. */
function computeRange(
  range: string,
  from?: string,
  to?: string,
): { gte?: Date; lte?: Date; label: string } {
  if (from || to) {
    return {
      gte: from ? new Date(`${from}T00:00:00`) : undefined,
      lte: to ? new Date(`${to}T23:59:59.999`) : undefined,
      label: "Custom range",
    };
  }
  const now = new Date();
  switch (range) {
    case "today": {
      const gte = new Date(now);
      gte.setHours(0, 0, 0, 0);
      return { gte, lte: now, label: "Today" };
    }
    case "7d":
      return { gte: new Date(now.getTime() - 7 * DAY), lte: now, label: "Last 7 days" };
    case "30d":
      return { gte: new Date(now.getTime() - 30 * DAY), lte: now, label: "Last 30 days" };
    default:
      return { label: "All time" };
  }
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; from?: string; to?: string }>;
}) {
  const sp = await searchParams;
  const range = computeRange(sp.range ?? "all", sp.from, sp.to);
  const dateWhere =
    range.gte || range.lte
      ? {
          createdAt: {
            ...(range.gte && { gte: range.gte }),
            ...(range.lte && { lte: range.lte }),
          },
        }
      : {};

  const [
    counts,
    bookingsTotal,
    pendingBookings,
    messagesTotal,
    unreadMessages,
    recentBookings,
    recentMessages,
  ] = await Promise.all([
    Promise.all([
      prisma.tour.count(),
      prisma.route.count(),
      prisma.vehicle.count(),
      prisma.faqItem.count(),
      prisma.galleryImage.count(),
      prisma.teamMember.count(),
      prisma.milestone.count(),
      prisma.hotel.count(),
      prisma.testimonial.count(),
    ]),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "pending" } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { handled: false } }),
    prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const [
    rangeBookings,
    rangePending,
    rangeConfirmed,
    rangeRevenue,
    rangeMessages,
  ] = await Promise.all([
    prisma.booking.count({ where: dateWhere }),
    prisma.booking.count({ where: { ...dateWhere, status: "pending" } }),
    prisma.booking.count({ where: { ...dateWhere, status: "confirmed" } }),
    prisma.booking.aggregate({
      _sum: { estimatedPrice: true },
      where: { ...dateWhere, status: "confirmed" },
    }),
    prisma.contactMessage.count({ where: dateWhere }),
  ]);
  const rangeRevenueTotal = rangeRevenue._sum.estimatedPrice ?? 0;

  const countByKey: Record<string, number> = {
    tours: counts[0],
    routes: counts[1],
    vehicles: counts[2],
    faq: counts[3],
    gallery: counts[4],
    team: counts[5],
    milestones: counts[6],
    hotels: counts[7],
    testimonials: counts[8],
  };

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-muted">Manage your content and review new leads.</p>

      {/* Performance — date-filtered stats */}
      <section className="mt-8 rounded-xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CalendarRange className="size-5 text-gold-deep" />
            <h2 className="font-semibold">Performance</h2>
            <span className="text-sm text-muted">· {range.label}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {RANGE_PRESETS.map((p) => {
              const active =
                (sp.range ?? "all") === p.key && !sp.from && !sp.to;
              return (
                <Link
                  key={p.key}
                  href={p.key === "all" ? "/admin" : `/admin?range=${p.key}`}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs transition-colors",
                    active
                      ? "border-gold bg-gold/10 text-gold-deep"
                      : "border-line text-muted hover:text-ink",
                  )}
                >
                  {p.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Custom range */}
        <form method="get" className="mt-4 flex flex-wrap items-end gap-3">
          <label className="text-xs text-muted">
            <span className="mb-1 block">From</span>
            <input
              type="date"
              name="from"
              defaultValue={sp.from ?? ""}
              className="input h-9"
            />
          </label>
          <label className="text-xs text-muted">
            <span className="mb-1 block">To</span>
            <input
              type="date"
              name="to"
              defaultValue={sp.to ?? ""}
              className="input h-9"
            />
          </label>
          <button
            type="submit"
            className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-sm font-medium text-canvas transition-colors hover:bg-gold hover:text-ink"
          >
            Apply
          </button>
        </form>

        {/* Metrics */}
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <MetricCard label="Bookings" value={rangeBookings} />
          <MetricCard label="Pending" value={rangePending} tone="gold" />
          <MetricCard label="Confirmed" value={rangeConfirmed} tone="success" />
          <MetricCard
            label="Est. revenue"
            value={formatPrice(rangeRevenueTotal, "en", siteConfig.currency)}
          />
          <MetricCard label="Messages" value={rangeMessages} />
        </div>
      </section>

      {/* Content counts */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {resources.map((r) => (
          <Link
            key={r.key}
            href={`/admin/${r.key}`}
            className="rounded-xl border border-line bg-surface p-5 transition-colors hover:border-gold/50"
          >
            <div className="text-3xl font-semibold">{countByKey[r.key] ?? 0}</div>
            <div className="mt-1 text-sm text-muted">{r.label}</div>
          </Link>
        ))}
      </div>

      {/* Ops summary */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Link href="/admin/bookings" className="flex items-center justify-between rounded-xl border border-line bg-surface p-5 hover:border-gold/50">
          <div className="flex items-center gap-3">
            <CalendarCheck className="size-5 text-gold-deep" />
            <div>
              <div className="font-medium">Bookings</div>
              <div className="text-sm text-muted">{pendingBookings} pending · {bookingsTotal} total</div>
            </div>
          </div>
          <ArrowRight className="size-4 text-faint" />
        </Link>
        <Link href="/admin/messages" className="flex items-center justify-between rounded-xl border border-line bg-surface p-5 hover:border-gold/50">
          <div className="flex items-center gap-3">
            <Mail className="size-5 text-gold-deep" />
            <div>
              <div className="font-medium">Messages</div>
              <div className="text-sm text-muted">{unreadMessages} unread · {messagesTotal} total</div>
            </div>
          </div>
          <ArrowRight className="size-4 text-faint" />
        </Link>
      </div>

      {/* Recent */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface p-5">
          <h2 className="font-semibold">Recent bookings</h2>
          <ul className="mt-3 divide-y divide-line text-sm">
            {recentBookings.length === 0 && <li className="py-3 text-muted">No bookings yet.</li>}
            {recentBookings.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <div className="truncate font-medium">{b.fullName}</div>
                  <div className="truncate text-muted">
                    {b.fromLocation}
                    {b.toLocation ? ` → ${b.toLocation}` : ""}
                  </div>
                </div>
                <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-xs tracking-wide">
                  {b.reference}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-line bg-surface p-5">
          <h2 className="font-semibold">Recent messages</h2>
          <ul className="mt-3 divide-y divide-line text-sm">
            {recentMessages.length === 0 && <li className="py-3 text-muted">No messages yet.</li>}
            {recentMessages.map((m) => (
              <li key={m.id} className="py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate font-medium">{m.name}</span>
                  {!m.handled && (
                    <span className="shrink-0 rounded-full bg-gold/15 px-2 py-0.5 text-xs text-gold-deep">
                      new
                    </span>
                  )}
                </div>
                <p className="mt-0.5 line-clamp-1 text-muted">{m.message}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone?: "gold" | "success";
}) {
  return (
    <div className="rounded-lg border border-line bg-canvas p-4">
      <div
        className={cn(
          "text-2xl font-semibold",
          tone === "gold" && "text-gold-deep",
          tone === "success" && "text-success",
        )}
      >
        {value}
      </div>
      <div className="mt-0.5 text-xs text-muted">{label}</div>
    </div>
  );
}
