"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, ImageOff, Link2 } from "lucide-react";
import { UPLOAD_ERRORS } from "@/components/admin/ImageListField";
import { cn } from "@/lib/utils";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

/** Upload through the authenticated server endpoint. */
async function uploadViaServer(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) throw new Error(data?.error ?? `http_${res.status}`);
  return data.url as string;
}

/**
 * Admin image field: upload from desktop or paste a URL.
 * The current value is held in a text input named `name`, so it submits with
 * the surrounding form exactly like the previous plain URL field did.
 */
export function ImageUploadField({
  name,
  label,
  value: initial,
  help,
}: {
  name: string;
  label: string;
  value?: string;
  help?: string;
}) {
  const [value, setValue] = useState(initial ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>();
  const fileRef = useRef<HTMLInputElement>(null);
  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(undefined);

    if (!file.type.startsWith("image/")) {
      setError("That is not an image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(
        `That image is ${(file.size / 1024 / 1024).toFixed(1)} MB — the limit is ${
          MAX_BYTES / 1024 / 1024
        } MB. Resize it, or paste a URL below and it will be copied to Cloudinary on save.`,
      );
      return;
    }

    setUploading(true);
    try {
      const url = await uploadViaServer(file);
      setValue(url);
    } catch (error) {
      // Surface the server's actual reason — a blanket "upload failed" gave
      // admins nothing to act on and hid misconfiguration entirely.
      const code = error instanceof Error ? error.message : "";
      setError(
        `Upload failed: ${UPLOAD_ERRORS[code] ?? code ?? "unknown error"}. You can paste an image URL below instead.`,
      );
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>

      <div className="flex items-start gap-4">
        {/* Preview */}
        <div className="relative size-24 shrink-0 overflow-hidden rounded-lg border border-line bg-canvas">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className="size-full object-cover"
              onError={(ev) => {
                (ev.currentTarget as HTMLImageElement).style.opacity = "0.2";
              }}
            />
          ) : (
            <span className="flex size-full items-center justify-center text-faint">
              <ImageOff className="size-6" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          {/* Upload button */}
          <div className="flex items-center gap-2">
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
              {uploading ? "Uploading…" : "Upload image"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onFile}
              className="hidden"
            />
            {value && (
              <button
                type="button"
                onClick={() => setValue("")}
                className="text-xs text-muted hover:text-danger"
              >
                Remove
              </button>
            )}
          </div>

          {/* URL input (also holds the submitted value) */}
          <label className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3">
            <Link2 className="size-4 shrink-0 text-faint" />
            <input
              type="text"
              name={name}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="…or paste an image URL"
              className="h-10 w-full bg-transparent text-sm outline-none"
            />
          </label>

          <p className="text-xs text-faint">
            New uploads are stored in Cloudinary and remain available after redeploys.
          </p>
          {error && <p className="text-xs text-danger">{error}</p>}
          {help && <span className={cn("block text-xs text-faint")}>{help}</span>}
        </div>
      </div>
    </div>
  );
}
