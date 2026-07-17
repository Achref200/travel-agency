"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  MapPin,
  CalendarClock,
  Users,
  Briefcase,
  Plane,
  User,
  Mail,
  Phone,
  Check,
  ArrowRight,
  Loader2,
  PartyPopper,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { estimatePrice } from "@/lib/booking";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";

export type BookingDefaults = {
  from?: string;
  to?: string;
  date?: string;
  pax?: string;
  mode?: string;
  hours?: string;
  return?: string;
};

type Status = "idle" | "submitting" | "success" | "error";

export function BookingForm({ defaults }: { defaults: BookingDefaults }) {
  const t = useTranslations("BookingPage");
  const tCommon = useTranslations("Common");
  const locale = useLocale();

  const serviceType = defaults.mode === "hourly" ? "hourly" : "transfer";

  const [form, setForm] = useState({
    fromLocation: defaults.from ?? "",
    toLocation: defaults.to ?? "",
    pickupAt: defaults.date ?? "",
    returnAt: "",
    passengers: Number(defaults.pax ?? 2),
    luggage: 2,
    flightNumber: "",
    fullName: "",
    email: "",
    phone: "",
    notes: "",
    roundTrip: defaults.return === "1",
    company: "", // honeypot
  });
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState<string>("");

  const estimate = useMemo(
    () =>
      estimatePrice({
        serviceType,
        hours: defaults.hours ? Number(defaults.hours) : undefined,
        passengers: form.passengers,
        roundTrip: form.roundTrip,
      }),
    [serviceType, defaults.hours, form.passengers, form.roundTrip],
  );

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          serviceType,
          hours: defaults.hours ? Number(defaults.hours) : undefined,
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
      <div className="mx-auto max-w-xl rounded-2xl border border-line bg-surface p-8 text-center md:p-12">
        <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
          <PartyPopper className="size-8" />
        </span>
        <h2 className="mt-6 text-3xl">{t("success.title")}</h2>
        <p className="mt-3 text-muted">
          {t("success.body", { name: form.fullName })}
        </p>
        {reference && (
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5">
            <span className="text-sm text-muted">{t("success.reference")}</span>
            <span className="font-medium tracking-wider text-ink">{reference}</span>
          </p>
        )}
        <div className="mt-8">
          <Button href="/" variant="secondary">
            {tCommon("backHome")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-10 lg:col-span-2">
        {/* Trip details */}
        <fieldset className="space-y-4">
          <legend className="mb-4 text-sm font-medium uppercase tracking-wide text-gold-deep">
            {t("steps.trip")}
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label={t("fields.from")}
              icon={<MapPin className="size-4" />}
              value={form.fromLocation}
              onChange={(v) => update("fromLocation", v)}
              required
            />
            {serviceType === "transfer" && (
              <Input
                label={t("fields.to")}
                icon={<MapPin className="size-4" />}
                value={form.toLocation}
                onChange={(v) => update("toLocation", v)}
                required
              />
            )}
            <Input
              type="datetime-local"
              label={t("fields.date")}
              icon={<CalendarClock className="size-4" />}
              value={form.pickupAt}
              onChange={(v) => update("pickupAt", v)}
              required
            />
            {form.roundTrip && (
              <Input
                type="datetime-local"
                label={t("fields.return")}
                icon={<CalendarClock className="size-4" />}
                value={form.returnAt}
                onChange={(v) => update("returnAt", v)}
              />
            )}
            <Select
              label={t("fields.passengers")}
              icon={<Users className="size-4" />}
              value={form.passengers}
              onChange={(v) => update("passengers", Number(v))}
              options={Array.from({ length: 12 }, (_, i) => i + 1)}
            />
            <Select
              label={t("fields.luggage")}
              icon={<Briefcase className="size-4" />}
              value={form.luggage}
              onChange={(v) => update("luggage", Number(v))}
              options={Array.from({ length: 13 }, (_, i) => i)}
            />
            <Input
              label={t("fields.flight")}
              icon={<Plane className="size-4" />}
              value={form.flightNumber}
              onChange={(v) => update("flightNumber", v)}
            />
          </div>

          <label className="inline-flex cursor-pointer select-none items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={form.roundTrip}
              onChange={(e) => update("roundTrip", e.target.checked)}
              className="peer sr-only"
            />
            <span className="inline-flex size-5 items-center justify-center rounded-md border border-line transition-colors peer-checked:border-gold peer-checked:bg-gold peer-checked:[&>svg]:opacity-100">
              <Check className="size-3 text-ink opacity-0 transition-opacity" />
            </span>
            <span className="text-ink">{t("roundTrip")}</span>
          </label>
        </fieldset>

        {/* Contact details */}
        <fieldset className="space-y-4">
          <legend className="mb-4 text-sm font-medium uppercase tracking-wide text-gold-deep">
            {t("steps.contact")}
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label={t("fields.name")}
              icon={<User className="size-4" />}
              value={form.fullName}
              onChange={(v) => update("fullName", v)}
              required
            />
            <Input
              type="email"
              label={t("fields.email")}
              icon={<Mail className="size-4" />}
              value={form.email}
              onChange={(v) => update("email", v)}
              required
            />
            <Input
              type="tel"
              label={t("fields.phone")}
              icon={<Phone className="size-4" />}
              value={form.phone}
              onChange={(v) => update("phone", v)}
              required
            />
          </div>
          <Textarea
            label={t("fields.notes")}
            value={form.notes}
            onChange={(v) => update("notes", v)}
          />

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
        </fieldset>
      </div>

      {/* Summary */}
      <aside className="lg:col-span-1">
        <div className="sticky top-24 rounded-2xl border border-line bg-surface p-6">
          <h2 className="text-xl">{t("summaryTitle")}</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <SummaryRow label={t("fields.from")} value={form.fromLocation || "—"} />
            {serviceType === "transfer" && (
              <SummaryRow label={t("fields.to")} value={form.toLocation || "—"} />
            )}
            <SummaryRow
              label={t("fields.passengers")}
              value={String(form.passengers)}
            />
          </dl>

          <div className="mt-6 flex items-baseline justify-between border-t border-line pt-5">
            <span className="text-sm text-muted">{t("estTotal")}</span>
            <span className="text-2xl font-medium text-ink">
              {formatPrice(estimate, locale, siteConfig.currency)}
            </span>
          </div>
          <p className="mt-2 text-xs text-faint">{t("estNote")}</p>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 h-12 text-sm font-medium text-canvas transition-colors hover:bg-gold hover:text-ink disabled:opacity-60"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t("submitting")}
              </>
            ) : (
              <>
                {t("submit")}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </>
            )}
          </button>

          {status === "error" && (
            <p className="mt-4 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
              {t("error")}
            </p>
          )}
        </div>
      </aside>
    </form>
  );
}

function fieldShell(icon: React.ReactNode, children: React.ReactNode, label: string) {
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
      </span>
    </label>
  );
}

function Input({
  label,
  icon,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return fieldShell(
    icon,
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="field-input"
    />,
    label,
  );
}

function Select({
  label,
  icon,
  value,
  onChange,
  options,
}: {
  label: string;
  icon: React.ReactNode;
  value: number;
  onChange: (v: string) => void;
  options: number[];
}) {
  return fieldShell(
    icon,
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="field-input"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>,
    label,
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.7rem] uppercase tracking-wide text-faint">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-line bg-canvas/60 px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink"
      />
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-end text-ink">{value}</dd>
    </div>
  );
}
