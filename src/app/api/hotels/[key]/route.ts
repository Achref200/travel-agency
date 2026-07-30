import { NextResponse } from "next/server";
import { getHotelByIdOrSlug } from "@/lib/content";

export const runtime = "nodejs";

/**
 * Public read-only hotel lookup by id or slug.
 *
 * The detail pages do NOT call this — they are server components and read the
 * cached data layer directly, which avoids an extra HTTP hop per render. This
 * exists for client-side and external consumers.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;

  try {
    const hotel = await getHotelByIdOrSlug(key);
    if (!hotel) {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }
    return NextResponse.json(
      { ok: true, hotel },
      // Same window as the data-layer cache; lets the CDN absorb repeat hits.
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
    );
  } catch (error) {
    console.error("hotel_lookup_failed", { key, error });
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}
