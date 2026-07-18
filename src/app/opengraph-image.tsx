import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = siteConfig.name;

/** Default social share image, generated from the configurable brand. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0b1d3a 0%, #07152a 100%)",
          color: "#f7f4ef",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", width: 64, height: 3, background: "#c8a24c" }} />
        <div
          style={{
            marginTop: 32,
            fontSize: 104,
            fontWeight: 600,
            letterSpacing: -2,
            display: "flex",
            alignItems: "baseline",
          }}
        >
          {siteConfig.name}
          <span style={{ color: "#c8a24c" }}>.</span>
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 40,
            color: "rgba(247,244,239,0.8)",
            maxWidth: 900,
          }}
        >
          Private Istanbul Airport Transfers &amp; Tours
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 26,
            color: "rgba(247,244,239,0.6)",
            display: "flex",
            gap: 24,
          }}
        >
          <span>Fixed price</span>
          <span>·</span>
          <span>Meet &amp; greet</span>
          <span>·</span>
          <span>24/7 support</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
