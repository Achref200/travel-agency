import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

// Inlined as a data URI: satori cannot read from the filesystem, and a relative
// URL would need the server to fetch itself while rendering this very route.
const logo = `data:image/jpeg;base64,${readFileSync(
  join(process.cwd(), "public", "logo.jpg"),
).toString("base64")}`;

/** Browser-tab icon — the real brand mark, rasterised to PNG. */
export default function Icon() {
  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
      <img
        src={logo}
        width={size.width}
        height={size.height}
        style={{ objectFit: "cover" }}
      />
    ),
    { ...size },
  );
}
