/**
 * Client-safe Cloudinary helpers for unsigned uploads from the admin UI.
 *
 * Requires two public env vars (inlined at build time):
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME   — your Cloudinary cloud name
 *   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET — an *unsigned* upload preset
 *
 * Uploaded assets are delivered from Cloudinary's CDN; we store the secure URL
 * (with f_auto,q_auto) so images stay optimised and survive the ephemeral
 * server filesystem on the free hosting tier.
 */

export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
export const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";

export function cloudinaryConfigured(): boolean {
  return Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET);
}

/** Insert f_auto,q_auto into a Cloudinary delivery URL for optimised delivery. */
export function optimizeCloudinaryUrl(url: string): string {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  if (/\/upload\/[^/]*(f_auto|q_auto)/.test(url)) return url;
  return url.replace("/upload/", "/upload/f_auto,q_auto/");
}

export type CloudinaryUploadResult = { url: string; publicId: string };

/** Upload a single file via Cloudinary's unsigned upload endpoint. */
export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
  if (!cloudinaryConfigured()) throw new Error("cloudinary_not_configured");

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: form },
  );
  if (!res.ok) throw new Error("upload_failed");

  const data = (await res.json()) as { secure_url?: string; public_id?: string };
  if (!data.secure_url) throw new Error("upload_failed");
  return {
    url: optimizeCloudinaryUrl(data.secure_url),
    publicId: data.public_id ?? "",
  };
}
