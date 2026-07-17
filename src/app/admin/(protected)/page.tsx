import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { resources } from "@/lib/admin/resources";
import { CalendarCheck, Mail, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
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
    ]),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "pending" } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { handled: false } }),
    prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const countByKey: Record<string, number> = {
    tours: counts[0],
    routes: counts[1],
    vehicles: counts[2],
    faq: counts[3],
    gallery: counts[4],
    team: counts[5],
    milestones: counts[6],
  };

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-muted">Manage your content and review new leads.</p>

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
