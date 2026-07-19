"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  BedDouble,
  CalendarClock,
  Users,
  Home,
  User,
  Mail,
  Phone,
  ArrowRight,
  Loader2,
  PartyPopper,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { ROOM_TYPES, type RoomType } from "@/data/hotels";
import { Button } from "@/components/ui/Button";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { BookingVoucher } from "@/components/sections/BookingVoucher";

type Prices = Record<RoomType, number>;
type Status = "idle" | "submitting" | "success" | "error";

const DAY = 24 * 60 * 60 * 1000;

export function HotelBookingForm({
  slug,
  hotelName,
  prices,
}: {
  slug: string;
  hotelName: string;
  prices: Prices;
}) {
  const t = useTranslations("Hotels");
  const locale = useLocale();

  const available = ROOM_TYPES.filter((r) => prices[r] > 0);
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    roomType: (available[0] ?? "couple") as RoomType,
    checkIn: "",
    checkOut: "",
    guests: 2,
    rooms: 1,
    fullName: "",
    email: "",
    phone: "",
    notes: "",
    company: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState("");

  const nights = useMemo(() => {
    if (!form.checkIn || !form.checkOut) return 0;
    const d = Math.round(
      (new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / DAY,
    );
    return d > 0 ? d : 0;
  }, [form.checkIn, form.checkOut]);

  const unit = prices[form.roomType] ?? 0;
  const estimate = unit * Math.max(1, nights) * form.rooms;

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (nights < 1) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType: "hotel",
          hotelSlug: slug,
          hotelName,
          roomType: form.roomType,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          rooms: form.rooms,
          passengers: form.guests,
          fromLocation: hotelName,
          pickupAt: form.checkIn,
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          notes: form.notes,
          company: form.company,
          locale,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error("failed");
      setReference(data.reference ?? "");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center">
        <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
          <PartyPopper className="size-8" />
        </span>
        <h2 className="mt-6 text-3xl">{t("success.title")}</h2>
        <p className="mt-3 text-muted">{t("success.body", { name: form.fullName })}</p>
        <div className="mt-8">
          <BookingVoucher
            data={{
              reference,
              serviceType: "hotel",
              fullName: form.fullName,
              phone: form.phone,
              email: form.email,
              hotelName,
              roomType: form.roomType,
              checkIn: form.checkIn,
              checkOut: form.checkOut,
              nights,
              rooms: form.rooms,
              passengers: form.guests,
              notes: form.notes,
              estimatedPrice: estimate,
              locale,
            }}
          />
        </div>
        <div className="mt-8">
          <Button href="/hotels" variant="secondary">
            {t("eyebrow")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <h2 className="text-2xl">{t("book.title")}</h2>

      {/* Room type */}
      <div>
        <span className="mb-1.5 block text-[0.7rem] uppercase tracking-wide text-faint">
          {t("book.roomType")}
        </span>
        <div className="grid grid-cols-1 gap-2 min-[560px]:grid-cols-2 lg:grid-cols-1">
          {available.map((r) => {
            const active = form.roomType === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => update("roomType", r)}
                aria-pressed={active}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-start transition-colors",
                  active
                    ? "border-ink bg-ink/[0.04] ring-1 ring-ink/10"
                    : "border-line bg-canvas/60 hover:border-ink/40",
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <BedDouble
                    className={cn(
                      "size-4 shrink-0",
                      active ? "text-gold-deep" : "text-faint",
                    )}
                    aria-hidden
                  />
                  <span className="text-sm font-medium text-ink">
                    {t(`rooms.${r}`)}
                  </span>
                </span>
                <span className="shrink-0 whitespace-nowrap text-sm text-muted">
                  {formatPrice(prices[r], locale, siteConfig.currency)}
                  <span className="text-faint">{t("book.perNight")}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field icon={<CalendarClock className="size-4" />} label={t("book.checkIn")}>
          <input
            type="date"
            min={today}
            value={form.checkIn}
            onChange={(e) => {
              const v = e.target.value;
              update("checkIn", v);
              if (form.checkOut && form.checkOut <= v) update("checkOut", "");
            }}
            required
            className="field-input"
          />
        </Field>
        <Field icon={<CalendarClock className="size-4" />} label={t("book.checkOut")}>
          <input
            type="date"
            min={form.checkIn || today}
            value={form.checkOut}
            onChange={(e) => update("checkOut", e.target.value)}
            required
            className="field-input"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectMenu
          icon={<Users className="size-4" />}
          label={t("book.guests")}
          value={String(form.guests)}
          onChange={(v) => update("guests", Number(v))}
          options={Array.from({ length: 12 }, (_, i) => ({
            value: String(i + 1),
            label: String(i + 1),
          }))}
        />
        <SelectMenu
          icon={<Home className="size-4" />}
          label={t("book.rooms")}
          value={String(form.rooms)}
          onChange={(v) => update("rooms", Number(v))}
          options={Array.from({ length: 6 }, (_, i) => ({
            value: String(i + 1),
            label: String(i + 1),
          }))}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field icon={<User className="size-4" />} label={t("book.name")}>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            required
            className="field-input"
          />
        </Field>
        <Field icon={<Mail className="size-4" />} label={t("book.email")}>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
            className="field-input"
          />
        </Field>
      </div>

      <Field icon={<Phone className="size-4" />} label={t("book.phone")}>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          required
          className="field-input"
        />
      </Field>

      <label className="block">
        <span className="mb-1.5 block text-[0.7rem] uppercase tracking-wide text-faint">
          {t("book.notes")}
        </span>
        <textarea
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-line bg-canvas/60 px-3 py-2.5 text-sm outline-none transition-colors focus:border-ink"
        />
      </label>

      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        value={form.company}
        onChange={(e) => update("company", e.target.value)}
        className="hidden"
      />

      {/* Summary */}
      <div className="rounded-xl border border-line bg-canvas/50 p-4">
        {nights > 0 ? (
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted">
              {t("book.nights", { count: nights })}
              {form.rooms > 1 ? ` · ${form.rooms}×` : ""}
            </span>
            <span className="text-2xl font-medium text-ink">
              {formatPrice(estimate, locale, siteConfig.currency)}
            </span>
          </div>
        ) : (
          <p className="text-sm text-muted">{t("book.selectDates")}</p>
        )}
        <p className="mt-1 text-xs text-faint">{t("book.totalNote")}</p>
      </div>

      <button
        type="submit"
        disabled={status === "submitting" || nights < 1}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-canvas transition-colors hover:bg-gold hover:text-ink disabled:opacity-60"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {t("book.submitting")}
          </>
        ) : (
          <>
            {t("book.submit")}
            <ArrowRight className="size-4 rtl:rotate-180" />
          </>
        )}
      </button>

      {status === "error" && (
        <p className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
          {t("error")}
        </p>
      )}
    </form>
  );
}

function Field({
  icon,
  label,
  children,
  trailing,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.7rem] uppercase tracking-wide text-faint">
        {label}
      </span>
      <span className="flex h-11 items-center gap-2 rounded-lg border border-line bg-canvas/60 px-3 transition-colors focus-within:border-ink">
        <span className="shrink-0 text-gold-deep" aria-hidden>
          {icon}
        </span>
        {children}
        {trailing && (
          <span className="pointer-events-none shrink-0 text-faint" aria-hidden>
            {trailing}
          </span>
        )}
      </span>
    </label>
  );
}
