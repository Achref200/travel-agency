"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Loader2, Send, CheckCircle2 } from "lucide-react";

export function ContactForm({ presetSubject }: { presetSubject?: string }) {
  const t = useTranslations("Contact.form");
  const locale = useLocale();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: presetSubject ?? "",
    message: "",
    company: "",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error("failed");
      setStatus("success");
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: presetSubject ?? "",
        message: "",
        company: "",
      });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-line bg-surface p-8 text-center">
        <CheckCircle2 className="size-12 text-success" />
        <p className="mt-4 text-lg text-ink">{t("success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("name")}>
          <input
            className="input"
            placeholder={t("namePlaceholder")}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />
        </Field>
        <Field label={t("email")}>
          <input
            type="email"
            className="input"
            placeholder={t("emailPlaceholder")}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />
        </Field>
        <Field label={t("phone")}>
          <input
            type="tel"
            className="input"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </Field>
        <Field label={t("subject")}>
          <input
            className="input"
            value={form.subject}
            onChange={(e) => update("subject", e.target.value)}
          />
        </Field>
      </div>

      <Field label={t("message")}>
        <textarea
          className="input min-h-32 py-2.5"
          placeholder={t("messagePlaceholder")}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          required
        />
      </Field>

      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
        value={form.company}
        onChange={(e) => update("company", e.target.value)}
      />

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-7 text-sm font-medium text-canvas transition-colors hover:bg-gold hover:text-ink disabled:opacity-60"
      >
        {status === "submitting" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
        {t("send")}
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
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.7rem] uppercase tracking-wide text-faint">
        {label}
      </span>
      {children}
    </label>
  );
}
