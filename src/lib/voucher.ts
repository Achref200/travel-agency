import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";

/**
 * A booking voucher — the shared shape used to render the on-screen receipt
 * card and to build the WhatsApp text message. Kept framework-agnostic so it
 * works from both client forms and server (admin) code.
 */
export type VoucherData = {
  reference: string;
  serviceType: string; // transfer | hourly | tour | hotel
  fullName: string;
  phone?: string | null;
  email?: string | null;
  fromLocation?: string | null;
  toLocation?: string | null;
  pickupAt?: string | Date | null;
  returnAt?: string | Date | null;
  passengers?: number | null;
  luggage?: number | null;
  flightNumber?: string | null;
  roundTrip?: boolean | null;
  notes?: string | null;
  estimatedPrice?: number | null;
  locale?: string;
  // Hotel bookings
  hotelName?: string | null;
  roomType?: string | null;
  checkIn?: string | Date | null;
  checkOut?: string | Date | null;
  nights?: number | null;
  rooms?: number | null;
};

const ROOM_LABEL: Record<string, string> = {
  single: "Single",
  couple: "Couple",
  triple: "Triple",
  quadruple: "Quadruple",
};

const SERVICE_LABEL: Record<string, string> = {
  transfer: "Private Transfer",
  hourly: "Chauffeur by the Hour",
  tour: "Guided Tour",
  hotel: "Hotel Reservation",
};

const SERVICE_EMOJI: Record<string, string> = {
  transfer: "🚗",
  hourly: "🕐",
  tour: "🗺️",
  hotel: "🏨",
};

/** A slim divider that renders consistently across WhatsApp clients. */
const DIVIDER = "━━━━━━━━━━━━━━━";

function toDate(v?: string | Date | null): Date | null {
  if (!v) return null;
  const d = typeof v === "string" ? new Date(v) : v;
  return Number.isNaN(d.getTime()) ? null : d;
}

function fmtDateTime(v: string | Date | null | undefined, locale: string): string {
  const d = toDate(v);
  if (!d) return "";
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

function fmtDate(v: string | Date | null | undefined, locale: string): string {
  const d = toDate(v);
  if (!d) return "";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(d);
}

/**
 * Build a polished, professional WhatsApp voucher message. Uses WhatsApp
 * formatting (*bold*, _italic_) with clean labelled rows and restrained emoji
 * for a premium, easy-to-scan receipt.
 */
export function buildVoucherText(data: VoucherData): string {
  const locale = data.locale ?? "en";
  const brand = siteConfig.name;
  const price =
    data.estimatedPrice != null
      ? formatPrice(data.estimatedPrice, locale, siteConfig.currency)
      : null;

  const svc = SERVICE_LABEL[data.serviceType] ?? "Booking";
  const emoji = SERVICE_EMOJI[data.serviceType] ?? "✦";

  /** Labelled detail row; returns null when the value is empty (skipped). */
  const row = (label: string, value?: string | number | null): string | null =>
    value !== undefined && value !== null && value !== ""
      ? `• *${label}:*  ${value}`
      : null;

  const lines: (string | null)[] = [];

  // Header
  lines.push(`✦  *${brand.toUpperCase()}*  ✦`);
  lines.push(DIVIDER);
  lines.push(`*BOOKING VOUCHER*`);
  lines.push(`Reference:  *${data.reference}*`);
  lines.push("");

  // Greeting
  lines.push(`Dear ${data.fullName},`);
  lines.push(`Thank you for choosing ${brand}. Here is your reservation summary:`);
  lines.push("");

  // Details
  lines.push(`${emoji}  *${svc}*`);
  if (data.serviceType === "hotel") {
    lines.push(row("Hotel", data.hotelName));
    if (data.roomType) {
      const room = ROOM_LABEL[data.roomType] ?? data.roomType;
      lines.push(
        row("Room", `${room}${data.rooms && data.rooms > 1 ? ` × ${data.rooms}` : ""}`),
      );
    }
    lines.push(row("Check-in", fmtDate(data.checkIn, locale) || null));
    lines.push(row("Check-out", fmtDate(data.checkOut, locale) || null));
    lines.push(row("Nights", data.nights ?? null));
    lines.push(row("Guests", data.passengers ?? null));
  } else if (data.serviceType === "tour") {
    lines.push(row("Experience", data.fromLocation));
    lines.push(row("Date", fmtDateTime(data.pickupAt, locale) || null));
    lines.push(row("Guests", data.passengers ?? null));
  } else {
    lines.push(row("From", data.fromLocation));
    lines.push(row("To", data.toLocation));
    lines.push(row("Pick-up", fmtDateTime(data.pickupAt, locale) || null));
    if (data.roundTrip && data.returnAt) {
      lines.push(row("Return", fmtDateTime(data.returnAt, locale) || null));
    }
    lines.push(row("Guests", data.passengers ?? null));
    if (data.luggage != null) lines.push(row("Luggage", data.luggage));
    lines.push(row("Flight", data.flightNumber));
  }

  if (data.notes) {
    lines.push("");
    lines.push(`*Notes:*  ${data.notes}`);
  }

  // Total
  if (price) {
    lines.push("");
    lines.push(`💰  *Estimated total:  ${price}*`);
    lines.push(`_Final price is confirmed before any payment._`);
  }

  // Footer
  lines.push(DIVIDER);
  lines.push(
    `Need to change anything? Just reply to this message — our concierge is here for you ${siteConfig.hours}.`,
  );
  lines.push("");
  lines.push(`📞  ${siteConfig.contact.phone}`);
  lines.push(`Warm regards,`);
  lines.push(`*The ${brand} Team*`);

  return lines.filter((l): l is string => l !== null).join("\n");
}
