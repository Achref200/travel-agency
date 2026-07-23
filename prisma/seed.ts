import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";
import { tours } from "../src/data/tours";
import { routes } from "../src/data/locations";
import { vehicles } from "../src/data/vehicles";
import { faqItems } from "../src/data/faq";
import { galleryImages } from "../src/data/gallery";
import { team, milestones } from "../src/data/about";
import { hotels } from "../src/data/hotels";
import { testimonials } from "../src/data/testimonials";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  // Enable SQLite WAL (write-ahead logging) for better read/write concurrency
  // under load — readers no longer block on a writer. Persists on the DB file;
  // runs on every boot (harmless to repeat).
  try {
    await prisma.$queryRawUnsafe("PRAGMA journal_mode=WAL;");
    await prisma.$executeRawUnsafe("PRAGMA busy_timeout=5000;");
  } catch {
    // Non-fatal (e.g. a non-SQLite datasource) — ignore.
  }

  // ── Admin user ──
  const email = (process.env.ADMIN_EMAIL ?? "admin@example.com")
    .trim()
    .toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "achref-me";
  await prisma.adminUser.upsert({
    where: { email },
    update: {
      name: "Administrator",
      passwordHash: hashPassword(password),
    },
    create: {
      email,
      name: "Administrator",
      passwordHash: hashPassword(password),
    },
  });
  console.log(`✓ admin user ready: ${email}`);

  // ── Tours ──
  if ((await prisma.tour.count()) === 0) {
    await prisma.tour.createMany({
      data: tours.map((t, i) => ({
        slug: t.slug,
        title: t.title,
        summary: t.summary,
        description: t.description,
        category: t.category,
        highlights: t.highlights,
        price: t.price,
        priceType: t.priceType,
        durationHours: t.durationHours,
        image: t.image,
        bestSeller: t.bestSeller ?? false,
        order: i,
      })),
    });
    console.log(`✓ seeded ${tours.length} tours`);
  }

  // ── Routes ──
  if ((await prisma.route.count()) === 0) {
    await prisma.route.createMany({
      data: routes.map((r, i) => ({
        fromLabel: r.from,
        toLabel: r.to,
        price: r.price,
        category: r.category,
        order: i,
      })),
    });
    console.log(`✓ seeded ${routes.length} routes`);
  }

  // ── Vehicles ──
  if ((await prisma.vehicle.count()) === 0) {
    await prisma.vehicle.createMany({
      data: vehicles.map((v, i) => ({
        slug: v.slug,
        name: v.name,
        className: v.className,
        passengers: v.passengers,
        luggage: v.luggage,
        image: v.image,
        features: v.features,
        order: i,
      })),
    });
    console.log(`✓ seeded ${vehicles.length} vehicles`);
  }

  // ── FAQ ──
  if ((await prisma.faqItem.count()) === 0) {
    await prisma.faqItem.createMany({
      data: faqItems.map((f, i) => ({
        question: f.question,
        answer: f.answer,
        order: i,
      })),
    });
    console.log(`✓ seeded ${faqItems.length} FAQ items`);
  }

  // ── Gallery ──
  if ((await prisma.galleryImage.count()) === 0) {
    await prisma.galleryImage.createMany({
      data: galleryImages.map((g, i) => ({
        src: g.src,
        alt: g.alt,
        wide: g.wide ?? false,
        tall: g.tall ?? false,
        order: i,
      })),
    });
    console.log(`✓ seeded ${galleryImages.length} gallery images`);
  }

  // ── Team ──
  if ((await prisma.teamMember.count()) === 0) {
    await prisma.teamMember.createMany({
      data: team.map((m, i) => ({
        name: m.name,
        role: m.role,
        image: m.image,
        order: i,
      })),
    });
    console.log(`✓ seeded ${team.length} team members`);
  }

  // ── Milestones ──
  if ((await prisma.milestone.count()) === 0) {
    await prisma.milestone.createMany({
      data: milestones.map((m, i) => ({
        year: m.year,
        title: m.title,
        text: m.text,
        order: i,
      })),
    });
    console.log(`✓ seeded ${milestones.length} milestones`);
  }

  // ── Hotels ──
  if ((await prisma.hotel.count()) === 0) {
    await prisma.hotel.createMany({
      data: hotels.map((h, i) => ({
        slug: h.slug,
        name: h.name,
        location: h.location,
        description: h.description,
        image: h.image,
        amenities: h.amenities,
        priceSingle: h.priceSingle,
        priceCouple: h.priceCouple,
        priceTriple: h.priceTriple,
        priceQuadruple: h.priceQuadruple,
        stars: h.stars,
        order: i,
      })),
    });
    console.log(`✓ seeded ${hotels.length} hotels`);
  }

  // ── Testimonials ──
  if ((await prisma.testimonial.count()) === 0) {
    await prisma.testimonial.createMany({
      data: testimonials.map((tm, i) => ({
        quote: tm.quote,
        author: tm.author,
        origin: tm.origin,
        rating: tm.rating,
        order: i,
      })),
    });
    console.log(`✓ seeded ${testimonials.length} testimonials`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
