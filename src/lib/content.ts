import "server-only";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Localized } from "@/lib/utils";
import type { Tour, PriceType } from "@/data/tours";
import type { Route, RouteCategory } from "@/data/locations";
import type { Vehicle } from "@/data/vehicles";
import type { FaqItem } from "@/data/faq";
import type { GalleryImage } from "@/data/gallery";
import type { Member, Milestone } from "@/data/about";
import type { Hotel, HotelAddress } from "@/data/hotels";
import type { Testimonial } from "@/data/testimonials";

/**
 * Content reads are cached under a single tag. Public pages render dynamically
 * (the build has no DATABASE_URL), so without this every visit would re-query
 * MySQL — the cause of the connection exhaustion behind the 504s. Admin writes
 * call `revalidateTag(CONTENT_TAG)` so edits still appear immediately.
 */
export const CONTENT_TAG = "content";

/**
 * Hard ceiling on a single content query. A saturated MySQL pool otherwise
 * leaves the request hanging until the proxy gives up at 504; failing fast lets
 * the page render its error boundary in a predictable time instead.
 */
const QUERY_TIMEOUT_MS = 8_000;

function withTimeout<T>(key: string, read: () => Promise<T>): Promise<T> {
  return Promise.race([
    read(),
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`content_query_timeout: ${key}`)),
        QUERY_TIMEOUT_MS,
      ).unref?.(),
    ),
  ]);
}

/** Wrap a DB read so repeat requests are served from the data cache. */
function cached<T>(key: string, read: () => Promise<T>): () => Promise<T> {
  return unstable_cache(() => withTimeout(key, read), ["content", key], {
    tags: [CONTENT_TAG],
    revalidate: 300,
  });
}

const loc = (v: unknown) => v as Localized;
const locArr = (v: unknown) => v as Localized[];

/** Gallery JSON is admin-authored, so tolerate null/legacy shapes. */
function imageList(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((item): item is string => typeof item === "string" && item.trim() !== "");
}

function hotelAddress(v: unknown): HotelAddress | null {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as HotelAddress) : null;
}

export const getTours = cached("tours", async (): Promise<Tour[]> => {
  const rows = await prisma.tour.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
  return rows.map((r) => ({
    slug: r.slug,
    title: loc(r.title),
    summary: loc(r.summary),
    description: loc(r.description),
    category: loc(r.category),
    highlights: locArr(r.highlights),
    price: r.price,
    priceType: r.priceType as PriceType,
    durationHours: r.durationHours,
    image: r.image,
    bestSeller: r.bestSeller,
  }));
});

export async function getTour(slug: string): Promise<Tour | undefined> {
  const tours = await getTours();
  return tours.find((t) => t.slug === slug);
}

export const getTourSlugs = cached("tour-slugs", async (): Promise<string[]> => {
  const rows = await prisma.tour.findMany({
    where: { published: true },
    select: { slug: true },
    orderBy: { order: "asc" },
  });
  return rows.map((r) => r.slug);
});

export const getRoutes = cached("routes", async (): Promise<Route[]> => {
  const rows = await prisma.route.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
  return rows.map((r) => ({
    from: r.fromLabel,
    to: r.toLabel,
    price: r.price,
    category: r.category as RouteCategory,
  }));
});

export const getVehicles = cached("vehicles", async (): Promise<Vehicle[]> => {
  const rows = await prisma.vehicle.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
  return rows.map((r) => ({
    slug: r.slug,
    name: r.name,
    className: loc(r.className),
    passengers: r.passengers,
    luggage: r.luggage,
    image: r.image,
    features: locArr(r.features),
  }));
});

export const getFaqItems = cached("faq", async (): Promise<FaqItem[]> => {
  const rows = await prisma.faqItem.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
  return rows.map((r) => ({
    question: loc(r.question),
    answer: loc(r.answer),
  }));
});

export const getGalleryImages = cached("gallery", async (): Promise<GalleryImage[]> => {
  const rows = await prisma.galleryImage.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
  return rows.map((r) => ({
    src: r.src,
    alt: loc(r.alt),
    wide: r.wide,
    tall: r.tall,
  }));
});

export const getTeam = cached("team", async (): Promise<Member[]> => {
  const rows = await prisma.teamMember.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
  return rows.map((r) => ({
    name: r.name,
    role: loc(r.role),
    image: r.image,
  }));
});

export const getMilestones = cached("milestones", async (): Promise<Milestone[]> => {
  const rows = await prisma.milestone.findMany({ orderBy: { order: "asc" } });
  return rows.map((r) => ({
    year: r.year,
    title: loc(r.title),
    text: loc(r.text),
  }));
});

export const getHotels = cached("hotels", async (): Promise<Hotel[]> => {
  const rows = await prisma.hotel.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
  return rows.map((r) => ({
    slug: r.slug,
    name: loc(r.name),
    location: r.location,
    description: loc(r.description),
    image: r.image,
    images: imageList(r.images),
    address: hotelAddress(r.address),
    amenities: locArr(r.amenities),
    priceSingle: r.priceSingle,
    priceCouple: r.priceCouple,
    priceTriple: r.priceTriple,
    priceQuadruple: r.priceQuadruple,
    stars: r.stars,
  }));
});

export async function getHotel(slug: string): Promise<Hotel | undefined> {
  const hotels = await getHotels();
  return hotels.find((h) => h.slug === slug);
}

/**
 * Resolve a hotel by database id or slug. Both are unique, and detail links in
 * the wild use either, so accept whichever the caller has.
 */
export async function getHotelByIdOrSlug(key: string): Promise<Hotel | undefined> {
  const hotels = await getHotels();
  const bySlug = hotels.find((h) => h.slug === key);
  if (bySlug) return bySlug;

  const row = await prisma.hotel.findUnique({ where: { id: key }, select: { slug: true } });
  return row ? hotels.find((h) => h.slug === row.slug) : undefined;
}

export const getHotelSlugs = cached("hotel-slugs", async (): Promise<string[]> => {
  const rows = await prisma.hotel.findMany({
    where: { published: true },
    select: { slug: true },
    orderBy: { order: "asc" },
  });
  return rows.map((r) => r.slug);
});

export const getTestimonials = cached("testimonials", async (): Promise<Testimonial[]> => {
  const rows = await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
  return rows.map((r) => ({
    quote: loc(r.quote),
    author: r.author,
    origin: r.origin,
    rating: r.rating,
  }));
});
