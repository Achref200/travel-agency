import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description:
      "Private airport transfers, chauffeured travel and curated tours across Türkiye.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f4ef",
    theme_color: "#0b1d3a",
    lang: "en",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
