import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";
import { tours } from "@/data/tours";
import { routes } from "@/data/locations";
import { vehicles } from "@/data/vehicles";
import { faqItems } from "@/data/faq";
import { galleryImages } from "@/data/gallery";
import { team, milestones } from "@/data/about";
import { hotels } from "@/data/hotels";
import { testimonials } from "@/data/testimonials";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const email = (process.env.ADMIN_EMAIL ?? "admin@example.com").trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD ?? "achref-me";

    await prisma.adminUser.upsert({
      where: { email },
      update: { name: "Administrator", passwordHash: hashPassword(password) },
      create: { email, name: "Administrator", passwordHash: hashPassword(password) },
    });

    if ((await prisma.tour.count()) === 0) {
      await prisma.tour.createMany({ data: tours.map((t, i) => ({ ...t, order: i, bestSeller: t.bestSeller ?? false })) });
    }
    if ((await prisma.route.count()) === 0) {
      await prisma.route.createMany({ data: routes.map((r, i) => ({ fromLabel: r.from, toLabel: r.to, price: r.price, category: r.category, order: i })) });
    }
    if ((await prisma.vehicle.count()) === 0) {
      await prisma.vehicle.createMany({ data: vehicles.map((v, i) => ({ ...v, order: i })) });
    }
    if ((await prisma.faqItem.count()) === 0) {
      await prisma.faqItem.createMany({ data: faqItems.map((f, i) => ({ ...f, order: i })) });
    }
    if ((await prisma.galleryImage.count()) === 0) {
      await prisma.galleryImage.createMany({ data: galleryImages.map((g, i) => ({ ...g, wide: g.wide ?? false, tall: g.tall ?? false, order: i })) });
    }
    if ((await prisma.teamMember.count()) === 0) {
      await prisma.teamMember.createMany({ data: team.map((m, i) => ({ ...m, order: i })) });
    }
    if ((await prisma.milestone.count()) === 0) {
      await prisma.milestone.createMany({ data: milestones.map((m, i) => ({ ...m, order: i })) });
    }
    if ((await prisma.hotel.count()) === 0) {
      await prisma.hotel.createMany({ data: hotels.map((h, i) => ({ ...h, order: i })) });
    }
    if ((await prisma.testimonial.count()) === 0) {
      await prisma.testimonial.createMany({ data: testimonials.map((tm, i) => ({ ...tm, order: i })) });
    }

    return NextResponse.json({ success: true, message: "Database seeded successfully!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
