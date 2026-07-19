"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, ImageOff, Link2 } from "lucide-react";
import { cloudinaryConfigured, uploadToCloudinary } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

/** Upload via the built-in server endpoint (fallback when Cloudinary is off). */
async function uploadViaServer(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data?.error ?? "failed");
  return data.url as string;
}

/**
 * Admin image field: upload from desktop (Cloudinary) or paste a URL.
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
  const configured = cloudinaryConfigured();

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(undefined);

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image must be under 8 MB.");
      return;
    }

    setUploading(true);
    try {
      const url = configured
        ? (await uploadToCloudinary(file)).url
        : await uploadViaServer(file);
      setValue(url);
    } catch {
      setError("Upload failed. Please try again or paste an image URL below.");
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

          {!configured && (
            <p className="text-xs text-faint">
              Uploads are saved on the server. For CDN delivery that survives
              redeploys, set <code>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> and{" "}
              <code>NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code>.
            </p>
          )}
          {error && <p className="text-xs text-danger">{error}</p>}
          {help && <span className={cn("block text-xs text-faint")}>{help}</span>}
        </div>
      </div>
    </div>
  );
}
