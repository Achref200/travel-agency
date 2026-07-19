"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, CalendarClock, Users, Clock, ArrowRight, ArrowLeftRight, Repeat } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { SelectMenu } from "@/components/ui/SelectMenu";

type Tab = "transfer" | "hourly" | "tours";

export function BookingWidget({ className }: { className?: string }) {
  const t = useTranslations("Booking");
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("transfer");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [when, setWhen] = useState("");
  const [duration, setDuration] = useState(4);
  const [pax, setPax] = useState(2);
  const [roundTrip, setRoundTrip] = useState(false);

  function swap() {
    setFrom(to);
    setTo(from);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (tab === "tours") {
      router.push("/tours");
      return;
    }
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (tab === "transfer" && to) params.set("to", to);
    if (when) params.set("date", when);
    params.set("pax", String(pax));
    if (tab === "hourly") {
      params.set("mode", "hourly");
      params.set("hours", String(duration));
    }
    if (roundTrip) params.set("return", "1");
    router.push(`/booking?${params.toString()}`);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "transfer", label: t("tabTransfer") },
    { id: "hourly", label: t("tabHourly") },
    { id: "tours", label: t("tabTours") },
  ];

  return (
    <div
      className={cn(
        "w-full rounded-2xl bg-surface/95 backdrop-blur-md border border-line shadow-[0_20px_60px_-24px_rgba(26,26,23,0.35)]",
        className,
      )}
    >
      {/* Tabs */}
      <div role="tablist" aria-label="Booking type" className="flex gap-1 p-2 border-b border-line">
        {tabs.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={cn(
              "flex-1 sm:flex-none whitespace-nowrap rounded-full px-3 sm:px-5 py-2 text-sm font-medium transition-colors",
              tab === item.id
                ? "bg-ink text-canvas"
                : "text-muted hover:text-ink hover:bg-ink/[0.05]",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="p-4 sm:p-5">
        {tab === "tours" ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <p className="text-muted text-sm max-w-md">{t("toursNote")}</p>
            <SubmitButton label={t("tabTours")} />
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-12 md:items-end">
            {/* From */}
            <Field className="md:col-span-3" label={t("from")} icon={<MapPin className="size-4" />}>
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder={t("fromPlaceholder")}
                className="field-input"
                required
              />
            </Field>

            {tab === "transfer" && (
              <>
                {/* Swap */}
                <div className="hidden md:flex md:col-span-1 items-end justify-center pb-2.5">
                  <button
                    type="button"
                    onClick={swap}
                    aria-label={t("swap")}
                    className="inline-flex items-center justify-center size-9 rounded-full border border-line text-muted hover:text-ink hover:border-ink transition-colors"
                  >
                    <ArrowLeftRight className="size-4" />
                  </button>
                </div>

                {/* To */}
                <Field className="md:col-span-3" label={t("to")} icon={<MapPin className="size-4" />}>
                  <input
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder={t("toPlaceholder")}
                    className="field-input"
                    required
                  />
                </Field>
              </>
            )}

            {tab === "hourly" && (
              <SelectMenu
                className="md:col-span-2"
                label={t("hours")}
                icon={<Clock className="size-4" />}
                value={String(duration)}
                onChange={(v) => setDuration(Number(v))}
                menuPlacement="up"
                options={Array.from({ length: 11 }, (_, i) => i + 2).map((h) => ({
                  value: String(h),
                  label: t("hoursValue", { count: h }),
                }))}
              />
            )}

            {/* When */}
            <Field
              className={tab === "transfer" ? "md:col-span-3" : "md:col-span-4"}
              label={t("when")}
              icon={<CalendarClock className="size-4" />}
            >
              <input
                type="datetime-local"
                value={when}
                onChange={(e) => setWhen(e.target.value)}
                className="field-input"
                required
              />
            </Field>

            {/* Passengers */}
            <SelectMenu
              className={tab === "transfer" ? "md:col-span-2" : "md:col-span-3"}
              label={t("passengers")}
              icon={<Users className="size-4" />}
              value={String(pax)}
              onChange={(v) => setPax(Number(v))}
              menuPlacement="up"
              options={Array.from({ length: 12 }, (_, i) => i + 1).map((n) => ({
                value: String(n),
                label: t("passenger", { count: n }),
              }))}
            />

            {/* Submit row */}
            <div className="md:col-span-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              {tab === "transfer" ? (
                <label className="inline-flex items-center gap-2.5 text-sm text-muted cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={roundTrip}
                    onChange={(e) => setRoundTrip(e.target.checked)}
                    className="peer sr-only"
                  />
                  <span className="inline-flex items-center justify-center size-5 rounded-md border border-line peer-checked:bg-gold peer-checked:border-gold peer-checked:[&>svg]:opacity-100 transition-colors">
                    <Repeat className="size-3 text-ink opacity-0 transition-opacity" />
                  </span>
                  <span className="text-ink">{t("roundTrip")}</span>
                  <span className="rounded-full bg-gold/15 text-gold-deep px-2 py-0.5 text-xs font-medium">
                    {t("roundTripHint")}
                  </span>
                </label>
              ) : (
                <p className="text-sm text-muted">{t("hourlyNote")}</p>
              )}
              <SubmitButton label={t("search")} />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
  className,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="block text-[0.7rem] uppercase tracking-wide text-faint mb-1.5">
        {label}
      </span>
      <span className="flex items-center gap-2 rounded-lg border border-line bg-canvas/60 px-3 h-11 focus-within:border-ink transition-colors">
        <span className="text-gold-deep shrink-0" aria-hidden>
          {icon}
        </span>
        {children}
      </span>
    </label>
  );
}

function SubmitButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink text-canvas px-7 h-12 text-sm font-medium hover:bg-gold hover:text-ink transition-colors whitespace-nowrap"
    >
      {label}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180" />
    </button>
  );
}
