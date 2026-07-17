"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { AdminResource, AdminField } from "@/lib/admin/resources";
import { LOCALES } from "@/lib/admin/resources";
import { cn } from "@/lib/utils";

type FormState = { error?: string } | undefined;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Record = { [k: string]: any };

const LOCALE_LABEL: globalThis.Record<string, string> = {
  en: "English",
  tr: "Türkçe",
  ar: "العربية",
};

export function ResourceForm({
  resource,
  record,
  action,
}: {
  resource: AdminResource;
  record: Record;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form action={formAction} className="max-w-2xl space-y-7">
      {resource.fields.map((field) => (
        <FieldInput key={field.name} field={field} value={record[field.name]} />
      ))}

      {state?.error && (
        <p className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3 border-t border-line pt-6">
        <SubmitButton />
        <Link
          href={`/admin/${resource.key}`}
          className="inline-flex h-11 items-center rounded-full px-5 text-sm text-muted hover:text-ink"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-canvas transition-colors hover:bg-gold hover:text-ink disabled:opacity-60"
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      Save
    </button>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-sm font-medium text-ink">{children}</span>
  );
}

function Help({ children }: { children?: string }) {
  if (!children) return null;
  return <span className="mt-1 block text-xs text-faint">{children}</span>;
}

function FieldInput({ field, value }: { field: AdminField; value: unknown }) {
  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name={field.name}
          defaultChecked={Boolean(value)}
          className="size-4 accent-[var(--color-gold)]"
        />
        <span className="text-sm font-medium text-ink">{field.label}</span>
      </label>
    );
  }

  if (field.type === "localized") {
    const v = (value ?? {}) as globalThis.Record<string, string>;
    return (
      <div>
        <Label>{field.label}</Label>
        <div className="space-y-2">
          {LOCALES.map((loc) => (
            <div key={loc} className="flex items-center gap-2">
              <span className="w-16 shrink-0 text-xs uppercase text-faint">
                {LOCALE_LABEL[loc]}
              </span>
              <input
                name={`${field.name}.${loc}`}
                defaultValue={v[loc] ?? ""}
                dir={loc === "ar" ? "rtl" : "ltr"}
                className="input"
              />
            </div>
          ))}
        </div>
        <Help>{field.help}</Help>
      </div>
    );
  }

  if (field.type === "localizedList") {
    const arr = (Array.isArray(value) ? value : []) as globalThis.Record<
      string,
      string
    >[];
    return (
      <div>
        <Label>{field.label}</Label>
        <div className="grid gap-2 sm:grid-cols-3">
          {LOCALES.map((loc) => (
            <div key={loc}>
              <span className="mb-1 block text-xs uppercase text-faint">
                {LOCALE_LABEL[loc]}
              </span>
              <textarea
                name={`${field.name}.${loc}`}
                defaultValue={arr.map((x) => x[loc] ?? "").join("\n")}
                dir={loc === "ar" ? "rtl" : "ltr"}
                rows={4}
                className="input min-h-24 py-2"
              />
            </div>
          ))}
        </div>
        <Help>{field.help}</Help>
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div>
        <Label>{field.label}</Label>
        <select
          name={field.name}
          defaultValue={(value as string) ?? field.options?.[0]}
          className="input"
        >
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <Help>{field.help}</Help>
      </div>
    );
  }

  const isNumber = field.type === "number";
  const isArea = field.type === "textarea";

  return (
    <div>
      <Label>{field.label}</Label>
      {isArea ? (
        <textarea
          name={field.name}
          defaultValue={(value as string) ?? ""}
          rows={4}
          className={cn("input min-h-24 py-2")}
        />
      ) : (
        <input
          type={isNumber ? "number" : "text"}
          step={isNumber ? "any" : undefined}
          name={field.name}
          defaultValue={(value as string | number) ?? ""}
          className="input"
        />
      )}
      <Help>{field.help}</Help>
    </div>
  );
}
