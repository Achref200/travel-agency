import "server-only";
import { prisma } from "@/lib/prisma";
import type { Localized } from "@/lib/utils";
import type { Tour, PriceType } from "@/data/tours";
import type { Route, RouteCategory } from "@/data/locations";
import type { Vehicle } from "@/data/vehicles";
import type { FaqItem } from "@/data/faq";
import type { GalleryImage } from "@/data/gallery";
import type { Member, Milestone } from "@/data/about";
import type { Hotel } from "@/data/hotels";
import type { Testimonial } from "@/data/testimonials";

/**
 * Content is read straight from the database. Public pages are statically
 * generated; the admin calls `revalidatePath("/[locale]", "layout")` after any
 * change so edits appear on the live site immediately.
 */

const loc = (v: unknown) => v as Localized;
const locArr = (v: unknown) => v as Localized[];

export async function getTours(): Promise<Tour[]> {
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
}

export async function getTour(slug: string): Promise<Tour | undefined> {
  const tours = await getTours();
  return tours.find((t) => t.slug === slug);
}

export async function getTourSlugs(): Promise<string[]> {
  const rows = await prisma.tour.findMany({
    where: { published: true },
    select: { slug: true },
    orderBy: { order: "asc" },
  });
  return rows.map((r) => r.slug);
}

export async function getRoutes(): Promise<Route[]> {
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
}

export async function getVehicles(): Promise<Vehicle[]> {
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
}

export async function getFaqItems(): Promise<FaqItem[]> {
  const rows = await prisma.faqItem.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
  return rows.map((r) => ({
    question: loc(r.question),
    answer: loc(r.answer),
  }));
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
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
}

export async function getTeam(): Promise<Member[]> {
  const rows = await prisma.teamMember.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
  return rows.map((r) => ({
    name: r.name,
    role: loc(r.role),
    image: r.image,
  }));
}

export async function getMilestones(): Promise<Milestone[]> {
  const rows = await prisma.milestone.findMany({ orderBy: { order: "asc" } });
  return rows.map((r) => ({
    year: r.year,
    title: loc(r.title),
    text: loc(r.text),
  }));
}

export async function getHotels(): Promise<Hotel[]> {
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
    amenities: locArr(r.amenities),
    priceSingle: r.priceSingle,
    priceCouple: r.priceCouple,
    priceTriple: r.priceTriple,
    priceQuadruple: r.priceQuadruple,
    stars: r.stars,
  }));
}

export async function getHotel(slug: string): Promise<Hotel | undefined> {
  const hotels = await getHotels();
  return hotels.find((h) => h.slug === slug);
}

export async function getHotelSlugs(): Promise<string[]> {
  const rows = await prisma.hotel.findMany({
    where: { published: true },
    select: { slug: true },
    orderBy: { order: "asc" },
  });
  return rows.map((r) => r.slug);
}

export async function getTestimonials(): Promise<Testimonial[]> {
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
}
