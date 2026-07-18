import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** Brand favicon/app icon, generated from the configurable SITE_NAME initial. */
export default function Icon() {
  const initial = siteConfig.name.trim().charAt(0).toUpperCase() || "T";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b1d3a",
          color: "#c8a24c",
          fontSize: 320,
          fontWeight: 600,
          fontFamily: "serif",
        }}
      >
        {initial}
      </div>
    ),
    { ...size },
  );
}
