"use client";

import { useLocale, useTranslations } from "next-intl";
import { MessageCircle, BadgeCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { siteConfig, whatsappLink, whatsappLinkTo } from "@/config/site";
import { buildVoucherText, type VoucherData } from "@/lib/voucher";

function toDate(v?: string | Date | null): Date | null {
  if (!v) return null;
  const d = typeof v === "string" ? new Date(v) : v;
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * A clean, branded booking voucher / receipt that follows the design system.
 * Shown on the booking success screen and reusable elsewhere. The
 * "Send to WhatsApp" button opens a chat with a pre-filled, humanised message.
 */
export function BookingVoucher({
  data,
  whatsappTo,
  className,
}: {
  data: VoucherData;
  /** Send to this number (digits) instead of the business line, e.g. the customer. */
  whatsappTo?: string;
  className?: string;
}) {
  const t = useTranslations("Voucher");
  const tRooms = useTranslations("Hotels");
  const locale = useLocale();

  const text = buildVoucherText({ ...data, locale: data.locale ?? locale });
  const href = whatsappTo ? whatsappLinkTo(whatsappTo, text) : whatsappLink(text);

  const dt = (v?: string | Date | null) => {
    const d = toDate(v);
    return d
      ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(d)
      : "";
  };
  const day = (v?: string | Date | null) => {
    const d = toDate(v);
    return d ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(d) : "";
  };

  const isHotel = data.serviceType === "hotel";
  const isTour = data.serviceType === "tour";

  return (
    <div
      className={
        "mx-auto max-w-md overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_24px_60px_-40px_rgba(26,26,23,0.5)] " +
        (className ?? "")
      }
    >
      {/* Header */}
      <div className="relative bg-sea px-6 py-5 text-canvas">
        <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-display text-xl leading-none">{siteConfig.name}</div>
            <div className="mt-1.5 text-[0.65rem] uppercase tracking-[0.22em] text-gold-soft/80">
              {t("title")}
            </div>
          </div>
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-canvas/15 backdrop-blur">
            <BadgeCheck className="size-4 text-gold" />
          </span>
        </div>
        <div className="mt-4 flex items-baseline justify-between border-t border-canvas/15 pt-3">
          <span className="text-xs uppercase tracking-wide text-canvas/60">
            {t("reference")}
          </span>
          <span className="font-medium tracking-[0.2em] text-gold-soft">
            {data.reference}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        <Row label={t("service")} value={t(`services.${data.serviceType}` as never)} />

        {isHotel ? (
          <>
            {data.hotelName && <Row label={t("hotel")} value={data.hotelName} />}
            {data.roomType && (
              <Row
                label={t("room")}
                value={`${tRooms(`rooms.${data.roomType}` as never)}${
                  data.rooms && data.rooms > 1 ? ` × ${data.rooms}` : ""
                }`}
              />
            )}
            {data.checkIn && <Row label={t("checkIn")} value={day(data.checkIn)} />}
            {data.checkOut && <Row label={t("checkOut")} value={day(data.checkOut)} />}
            {data.nights ? <Row label={t("nights")} value={String(data.nights)} /> : null}
            {data.passengers ? (
              <Row label={t("guests")} value={String(data.passengers)} />
            ) : null}
          </>
        ) : isTour ? (
          <>
            {data.fromLocation && (
              <Row label={t("experience")} value={data.fromLocation} />
            )}
            {data.pickupAt && <Row label={t("date")} value={dt(data.pickupAt)} />}
            {data.passengers ? (
              <Row label={t("guests")} value={String(data.passengers)} />
            ) : null}
          </>
        ) : (
          <>
            {data.fromLocation && <Row label={t("from")} value={data.fromLocation} />}
            {data.toLocation && <Row label={t("to")} value={data.toLocation} />}
            {data.pickupAt && <Row label={t("date")} value={dt(data.pickupAt)} />}
            {data.roundTrip && data.returnAt && (
              <Row label={t("return")} value={dt(data.returnAt)} />
            )}
            {data.passengers ? (
              <Row label={t("guests")} value={String(data.passengers)} />
            ) : null}
            {data.luggage != null && (
              <Row label={t("luggage")} value={String(data.luggage)} />
            )}
            {data.flightNumber && <Row label={t("flight")} value={data.flightNumber} />}
          </>
        )}

        {data.notes && <Row label={t("notes")} value={data.notes} />}

        {data.estimatedPrice != null && (
          <div className="mt-4 flex items-baseline justify-between border-t border-dashed border-line pt-4">
            <span className="text-sm text-muted">{t("total")}</span>
            <span className="font-display text-2xl text-ink">
              {formatPrice(data.estimatedPrice, locale, siteConfig.currency)}
            </span>
          </div>
        )}
        {data.estimatedPrice != null && (
          <p className="mt-1 text-end text-xs text-faint">{t("totalNote")}</p>
        )}

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-medium text-white transition-transform hover:scale-[1.01]"
        >
          <MessageCircle className="size-4" />
          {t("sendWhatsapp")}
        </a>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line/70 py-2.5 last:border-0">
      <span className="shrink-0 text-sm text-muted">{label}</span>
      <span className="text-end text-sm font-medium text-ink">{value}</span>
    </div>
  );
}
