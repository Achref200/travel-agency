import { createHash } from "node:crypto";

/**
 * Cloudinary uploads for the authenticated admin endpoint. Server-side only:
 * the node:crypto import fails the build if this is pulled into a client
 * component, and the credentials below are never NEXT_PUBLIC_ prefixed. It is
 * deliberately not marked `server-only` so the migration script can reuse it.
 *
 * Preferred: SIGNED uploads via CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET.
 * These stay server-side and need no upload preset, so nothing about the
 * account is exposed to the browser.
 *
 * Fallback: an unsigned preset via NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET, kept
 * only for accounts already set up that way. Anyone who learns the cloud name
 * can upload against an unsigned preset, so prefer signed credentials.
 */

export const CLOUD_NAME =
  process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  "";

const API_KEY = process.env.CLOUDINARY_API_KEY ?? "";
const API_SECRET = process.env.CLOUDINARY_API_SECRET ?? "";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";

/** Folder every uploaded asset lands in, so the media library stays tidy. */
export const UPLOAD_FOLDER = "marwen-travel";

export function cloudinaryConfigured(): boolean {
  if (!CLOUD_NAME) return false;
  return Boolean((API_KEY && API_SECRET) || UPLOAD_PRESET);
}

/** Insert f_auto,q_auto into a Cloudinary delivery URL for optimised delivery. */
export function optimizeCloudinaryUrl(url: string): string {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  if (/\/upload\/[^/]*(f_auto|q_auto)/.test(url)) return url;
  return url.replace("/upload/", "/upload/f_auto,q_auto/");
}

/** Cloudinary signs the sorted `key=value` param string with the API secret. */
function sign(params: Record<string, string>): string {
  const canonical = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1").update(canonical + API_SECRET).digest("hex");
}

export type CloudinaryUploadResult = { url: string; publicId: string };

/**
 * Upload a file or a remote image URL. Cloudinary fetches `http(s)` sources
 * itself, which is what the migration script uses to pull hotlinked images in.
 */
export async function uploadToCloudinary(
  file: File | string,
): Promise<CloudinaryUploadResult> {
  if (!cloudinaryConfigured()) throw new Error("cloudinary_not_configured");

  const form = new FormData();
  form.append("file", file);

  if (API_KEY && API_SECRET) {
    const signed = {
      folder: UPLOAD_FOLDER,
      timestamp: String(Math.floor(Date.now() / 1000)),
    };
    for (const [key, value] of Object.entries(signed)) form.append(key, value);
    form.append("api_key", API_KEY);
    form.append("signature", sign(signed));
  } else {
    form.append("upload_preset", UPLOAD_PRESET);
  }

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: form, signal: AbortSignal.timeout(60_000) },
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`upload_failed: HTTP ${res.status} ${detail.slice(0, 300)}`);
  }

  const data = (await res.json()) as { secure_url?: string; public_id?: string };
  if (!data.secure_url) throw new Error("upload_failed: no secure_url returned");
  return {
    url: optimizeCloudinaryUrl(data.secure_url),
    publicId: data.public_id ?? "",
  };
}
