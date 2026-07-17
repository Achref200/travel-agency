import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { formatPrice, cn } from "@/lib/utils";
import { setBookingStatus, deleteBooking } from "./actions";
import { Check, X, RotateCcw, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-gold/15 text-gold-deep",
  confirmed: "bg-success/15 text-success",
  cancelled: "bg-danger/10 text-danger",
};

export default async function BookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-semibold">Bookings</h1>
      <p className="mt-1 text-sm text-muted">{bookings.length} total</p>

      <div className="mt-6 space-y-3">
        {bookings.length === 0 && (
          <p className="rounded-xl border border-line bg-surface p-6 text-muted">
            No bookings yet.
          </p>
        )}
        {bookings.map((b) => (
          <div
            key={b.id}
            className="rounded-xl border border-line bg-surface p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-line px-2 py-0.5 text-xs tracking-wide">
                    {b.reference}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs capitalize",
                      STATUS_STYLES[b.status] ?? "bg-ink/5 text-muted",
                    )}
                  >
                    {b.status}
                  </span>
                  <span className="text-xs text-faint">
                    {new Date(b.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 font-medium">
                  {b.fromLocation}
                  {b.toLocation ? ` → ${b.toLocation}` : ""}
                </div>
                <div className="mt-1 text-sm text-muted">
                  {b.fullName} · {b.email} · {b.phone}
                </div>
                <div className="mt-1 text-sm text-muted">
                  {new Date(b.pickupAt).toLocaleString()} · {b.passengers} pax
                  {b.roundTrip ? " · round trip" : ""}
                  {b.flightNumber ? ` · flight ${b.flightNumber}` : ""}
                </div>
                {b.notes && (
                  <p className="mt-2 text-sm text-ink/80">“{b.notes}”</p>
                )}
              </div>

              <div className="text-end">
                {b.estimatedPrice != null && (
                  <div className="text-lg font-semibold">
                    {formatPrice(b.estimatedPrice, "en", siteConfig.currency)}
                  </div>
                )}
                <div className="mt-3 flex items-center justify-end gap-1">
                  <form action={setBookingStatus.bind(null, b.id, "confirmed")}>
                    <IconBtn label="Confirm" tone="success">
                      <Check className="size-4" />
                    </IconBtn>
                  </form>
                  <form action={setBookingStatus.bind(null, b.id, "cancelled")}>
                    <IconBtn label="Cancel" tone="danger">
                      <X className="size-4" />
                    </IconBtn>
                  </form>
                  <form action={setBookingStatus.bind(null, b.id, "pending")}>
                    <IconBtn label="Reset to pending">
                      <RotateCcw className="size-4" />
                    </IconBtn>
                  </form>
                  <form action={deleteBooking.bind(null, b.id)}>
                    <IconBtn label="Delete" tone="danger">
                      <Trash2 className="size-4" />
                    </IconBtn>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IconBtn({
  label,
  tone,
  children,
}: {
  label: string;
  tone?: "success" | "danger";
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-lg text-muted transition-colors",
        tone === "success" && "hover:bg-success/10 hover:text-success",
        tone === "danger" && "hover:bg-danger/10 hover:text-danger",
        !tone && "hover:bg-ink/5 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
