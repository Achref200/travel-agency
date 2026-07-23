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

  async headers() {
    return [
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
