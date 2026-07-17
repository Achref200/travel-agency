/**
 * Image helpers.
 *
 * Content images use seeded placeholder photography so the site renders
 * perfectly out of the box. To go live, either:
 *   1) set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME (these URLs get proxied &
 *      optimised automatically), or
 *   2) replace the values in the data files with your Cloudinary public IDs.
 */

/** A deterministic, always-available placeholder photo. */
export function stockImage(seed: string, width = 1280, height = 854): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}

/** Tiny blurred data URI used as a graceful loading placeholder. */
export const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iNjciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNjciIGZpbGw9IiNlN2UxZDgiLz48L3N2Zz4=";
