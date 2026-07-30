"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, Link2, X, ArrowLeft, ArrowRight } from "lucide-react";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

async function uploadViaServer(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data?.error ?? "failed");
  return data.url as string;
}

/**
 * Gallery field: many images per record, uploaded from disk or pasted as URLs.
 * The list is submitted as a JSON array in a single hidden input named `name`,
 * so it round-trips through the same generic form action as every other field.
 * Pasted third-party URLs are pulled into Cloudinary server-side on save.
 */
export function ImageListField({
  name,
  label,
  value: initial,
  help,
}: {
  name: string;
  label: string;
  value?: string[];
  help?: string;
}) {
  const [items, setItems] = useState<string[]>(initial ?? []);
  const [uploading, setUploading] = useState(false);
  const [pending, setPending] = useState("");
  const [error, setError] = useState<string>();
  const fileRef = useRef<HTMLInputElement>(null);

  function move(from: number, to: number) {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
  }

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setError(undefined);
    setUploading(true);

    const uploaded: string[] = [];
    const failed: string[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/") || file.size > MAX_BYTES) {
        failed.push(file.name);
        continue;
      }
      try {
        uploaded.push(await uploadViaServer(file));
      } catch {
        failed.push(file.name);
      }
    }

    if (uploaded.length) setItems((prev) => [...prev, ...uploaded]);
    if (failed.length) {
      setError(
        `Could not add ${failed.length} file(s): ${failed.join(", ")}. Images must be under 8 MB.`,
      );
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function addPending() {
    const url = pending.trim();
    if (!url) return;
    setItems((prev) => [...prev, url]);
    setPending("");
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <input type="hidden" name={name} value={JSON.stringify(items)} />

      {items.length > 0 && (
        <ul className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {items.map((src, i) => (
            <li
              key={`${src}-${i}`}
              className="group relative aspect-4/3 overflow-hidden rounded-lg border border-line bg-canvas"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="size-full object-cover"
                onError={(ev) => {
                  (ev.currentTarget as HTMLImageElement).style.opacity = "0.2";
                }}
              />
              <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-ink/70 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => move(i, i - 1)}
                  disabled={i === 0}
                  aria-label="Move earlier"
                  className="rounded p-1 text-canvas disabled:opacity-30"
                >
                  <ArrowLeft className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setItems(items.filter((_, x) => x !== i))}
                  aria-label="Remove image"
                  className="rounded p-1 text-canvas hover:text-danger"
                >
                  <X className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  disabled={i === items.length - 1}
                  aria-label="Move later"
                  className="rounded p-1 text-canvas disabled:opacity-30"
                >
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex h-9 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors hover:border-gold/60 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Upload className="size-4" />
          )}
          {uploading ? "Uploading…" : "Upload images"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onFiles}
          className="hidden"
        />
        <span className="text-xs text-faint">{items.length} image(s)</span>
      </div>

      <label className="mt-2 flex items-center gap-2 rounded-lg border border-line bg-surface px-3">
        <Link2 className="size-4 shrink-0 text-faint" />
        <input
          type="text"
          value={pending}
          onChange={(e) => setPending(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addPending();
            }
          }}
          placeholder="…or paste an image URL and press Enter"
          className="h-10 w-full bg-transparent text-sm outline-none"
        />
        {pending.trim() && (
          <button
            type="button"
            onClick={addPending}
            className="shrink-0 text-xs font-medium text-gold-deep"
          >
            Add
          </button>
        )}
      </label>

      <p className="mt-1.5 text-xs text-faint">
        Stored on Cloudinary. Pasted links are copied there automatically when you
        save, so images keep working even if the original site goes down.
      </p>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      {help && <span className="mt-1 block text-xs text-faint">{help}</span>}
    </div>
  );
}
