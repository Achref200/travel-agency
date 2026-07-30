import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // All <Image /> requests are routed through the Cloudinary loader so that
    // remote assets are automatically resized, compressed (q_auto) and served
    // in modern formats (f_auto: AVIF/WebP) from Cloudinary's global CDN.
    // Falls back to the original URL when no cloud name is configured.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },

  // Strip the `X-Powered-By: Next.js` header.
  poweredByHeader: false,

  // Trailing slashes off for canonical consistency.
  trailingSlash: false,

  experimental: {
    // Only ship the icons that are actually imported.
    optimizePackageImports: ["lucide-react", "motion"],
  },

  async redirects() {
    /**
     * English used to live at bare paths (/tours) before locales were always
     * prefixed. Redirect the old URLs permanently so existing links and search
     * rankings follow to /en/…. Only content routes are listed — /admin, /api
     * and the metadata routes must never be rewritten.
     */
    const contentRoutes = [
      "tours", "hotels", "vehicles", "about", "business",
      "meeting-points", "faq", "contact", "booking", "legal",
    ];

    return contentRoutes.map((route) => ({
      source: `/${route}/:path*`,
      destination: `/en/${route}/:path*`,
      permanent: true,
    }));
  },

  async headers() {
    /**
     * Public pages are identical for every visitor, so let the CDN serve them
     * and only fall through to Node once a minute. Without this Hostinger marks
     * every request DYNAMIC and each visitor costs a render plus a DB trip —
     * the reason traffic spikes turned into 504s. `stale-while-revalidate`
     * means the edge keeps serving instantly while it refreshes in the
     * background, so visitors never wait on a cold render.
     *
     * Trade-off: admin edits can take up to `s-maxage` to appear publicly.
     */
    const publicPageCache = {
      key: "Cache-Control",
      value: "public, s-maxage=60, stale-while-revalidate=600",
    };
    /** Anything user-specific or mutating must never be stored anywhere. */
    const noStore = {
      key: "Cache-Control",
      value: "private, no-store, max-age=0, must-revalidate",
    };

    return [
      // Order matters: the first matching source wins per header key.
      // Only authenticated and liveness endpoints are forced no-store; public
      // read-only routes set their own policy. Everything else here is POST,
      // which is never cached anyway.
      { source: "/api/admin/:path*", headers: [noStore] },
      { source: "/api/health", headers: [noStore] },
      { source: "/admin/:path*", headers: [noStore] },
      { source: "/:locale(en|tr|ar|fr)", headers: [publicPageCache] },
      { source: "/:locale(en|tr|ar|fr)/:path*", headers: [publicPageCache] },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
