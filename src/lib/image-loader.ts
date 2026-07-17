/**
 * Custom Next.js image loader backed by Cloudinary.
 *
 * Configured globally via `next.config.ts` (`images.loaderFile`), so every
 * `<Image />` in the app is automatically optimised.
 *
 * Behaviour:
 *  - Local assets (`/foo.jpg`) are returned untouched.
 *  - When `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set, remote URLs are proxied
 *    through Cloudinary's `fetch` delivery and bare public IDs through
 *    `upload` delivery — both with `f_auto` (AVIF/WebP) + `q_auto`.
 *  - Without a cloud name, the original URL is returned so the site still
 *    works in local dev / before Cloudinary is provisioned.
 */
type LoaderArgs = {
  src: string;
  width: number;
  quality?: number;
};

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

export default function cloudinaryLoader({
  src,
  width,
  quality,
}: LoaderArgs): string {
  // Local/static assets: serve as-is.
  if (src.startsWith("/") || src.startsWith("data:") || src.startsWith("blob:")) {
    return src;
  }

  const q = quality ?? "auto";
  const transforms = `f_auto,q_${q},w_${width},c_limit,dpr_auto`;

  // No Cloudinary configured yet → return the source URL unchanged.
  if (!CLOUD_NAME) {
    return src;
  }

  const base = `https://res.cloudinary.com/${CLOUD_NAME}/image`;

  // Already a Cloudinary URL → leave it (avoid double-wrapping).
  if (src.includes("res.cloudinary.com")) {
    return src;
  }

  // Remote http(s) asset → fetch delivery.
  if (/^https?:\/\//.test(src)) {
    return `${base}/fetch/${transforms}/${encodeURIComponent(src)}`;
  }

  // Otherwise treat it as an uploaded public ID.
  const publicId = src.replace(/^\/+/, "");
  return `${base}/upload/${transforms}/${publicId}`;
}
