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

const CREATE_TABLES_SQL = [
  `CREATE TABLE IF NOT EXISTS \`AdminUser\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`email\` VARCHAR(191) NOT NULL,
    \`name\` VARCHAR(191) NULL,
    \`passwordHash\` VARCHAR(191) NOT NULL,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX \`AdminUser_email_key\`(\`email\`),
    PRIMARY KEY (\`id\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
  `CREATE TABLE IF NOT EXISTS \`Tour\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`slug\` VARCHAR(191) NOT NULL,
    \`title\` JSON NOT NULL,
    \`summary\` JSON NOT NULL,
    \`description\` JSON NOT NULL,
    \`category\` JSON NOT NULL,
    \`highlights\` JSON NOT NULL,
    \`price\` DOUBLE NOT NULL,
    \`priceType\` VARCHAR(191) NOT NULL DEFAULT 'person',
    \`durationHours\` INTEGER NOT NULL DEFAULT 1,
    \`image\` VARCHAR(191) NOT NULL,
    \`bestSeller\` BOOLEAN NOT NULL DEFAULT false,
    \`published\` BOOLEAN NOT NULL DEFAULT true,
    \`order\` INTEGER NOT NULL DEFAULT 0,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    UNIQUE INDEX \`Tour_slug_key\`(\`slug\`),
    INDEX \`Tour_published_order_idx\`(\`published\`, \`order\`),
    PRIMARY KEY (\`id\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
  `CREATE TABLE IF NOT EXISTS \`Route\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`fromLabel\` VARCHAR(191) NOT NULL,
    \`toLabel\` VARCHAR(191) NOT NULL,
    \`price\` DOUBLE NOT NULL,
    \`category\` VARCHAR(191) NOT NULL DEFAULT 'airport',
    \`published\` BOOLEAN NOT NULL DEFAULT true,
    \`order\` INTEGER NOT NULL DEFAULT 0,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    INDEX \`Route_category_order_idx\`(\`category\`, \`order\`),
    PRIMARY KEY (\`id\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
  `CREATE TABLE IF NOT EXISTS \`Vehicle\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`slug\` VARCHAR(191) NOT NULL,
    \`name\` VARCHAR(191) NOT NULL,
    \`className\` JSON NOT NULL,
    \`passengers\` INTEGER NOT NULL DEFAULT 1,
    \`luggage\` INTEGER NOT NULL DEFAULT 0,
    \`image\` VARCHAR(191) NOT NULL,
    \`features\` JSON NOT NULL,
    \`published\` BOOLEAN NOT NULL DEFAULT true,
    \`order\` INTEGER NOT NULL DEFAULT 0,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    UNIQUE INDEX \`Vehicle_slug_key\`(\`slug\`),
    INDEX \`Vehicle_published_order_idx\`(\`published\`, \`order\`),
    PRIMARY KEY (\`id\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
  `CREATE TABLE IF NOT EXISTS \`FaqItem\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`question\` JSON NOT NULL,
    \`answer\` JSON NOT NULL,
    \`published\` BOOLEAN NOT NULL DEFAULT true,
    \`order\` INTEGER NOT NULL DEFAULT 0,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    INDEX \`FaqItem_published_order_idx\`(\`published\`, \`order\`),
    PRIMARY KEY (\`id\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
  `CREATE TABLE IF NOT EXISTS \`GalleryImage\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`src\` VARCHAR(191) NOT NULL,
    \`alt\` JSON NOT NULL,
    \`wide\` BOOLEAN NOT NULL DEFAULT false,
    \`tall\` BOOLEAN NOT NULL DEFAULT false,
    \`published\` BOOLEAN NOT NULL DEFAULT true,
    \`order\` INTEGER NOT NULL DEFAULT 0,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    INDEX \`GalleryImage_published_order_idx\`(\`published\`, \`order\`),
    PRIMARY KEY (\`id\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
  `CREATE TABLE IF NOT EXISTS \`TeamMember\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`name\` VARCHAR(191) NOT NULL,
    \`role\` JSON NOT NULL,
    \`image\` VARCHAR(191) NOT NULL,
    \`published\` BOOLEAN NOT NULL DEFAULT true,
    \`order\` INTEGER NOT NULL DEFAULT 0,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    INDEX \`TeamMember_published_order_idx\`(\`published\`, \`order\`),
    PRIMARY KEY (\`id\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
  `CREATE TABLE IF NOT EXISTS \`Milestone\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`year\` VARCHAR(191) NOT NULL,
    \`title\` JSON NOT NULL,
    \`text\` JSON NOT NULL,
    \`order\` INTEGER NOT NULL DEFAULT 0,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    INDEX \`Milestone_order_idx\`(\`order\`),
    PRIMARY KEY (\`id\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
  `CREATE TABLE IF NOT EXISTS \`Hotel\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`slug\` VARCHAR(191) NOT NULL,
    \`name\` JSON NOT NULL,
    \`location\` VARCHAR(191) NOT NULL,
    \`description\` JSON NOT NULL,
    \`image\` VARCHAR(191) NOT NULL,
    \`amenities\` JSON NOT NULL,
    \`priceSingle\` DOUBLE NOT NULL DEFAULT 0,
    \`priceCouple\` DOUBLE NOT NULL DEFAULT 0,
    \`priceTriple\` DOUBLE NOT NULL DEFAULT 0,
    \`priceQuadruple\` DOUBLE NOT NULL DEFAULT 0,
    \`stars\` INTEGER NOT NULL DEFAULT 0,
    \`published\` BOOLEAN NOT NULL DEFAULT true,
    \`order\` INTEGER NOT NULL DEFAULT 0,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    UNIQUE INDEX \`Hotel_slug_key\`(\`slug\`),
    INDEX \`Hotel_published_order_idx\`(\`published\`, \`order\`),
    PRIMARY KEY (\`id\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
  `CREATE TABLE IF NOT EXISTS \`Testimonial\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`quote\` JSON NOT NULL,
    \`author\` VARCHAR(191) NOT NULL,
    \`origin\` VARCHAR(191) NOT NULL DEFAULT '',
    \`rating\` INTEGER NOT NULL DEFAULT 5,
    \`published\` BOOLEAN NOT NULL DEFAULT true,
    \`order\` INTEGER NOT NULL DEFAULT 0,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    INDEX \`Testimonial_published_order_idx\`(\`published\`, \`order\`),
    PRIMARY KEY (\`id\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
  `CREATE TABLE IF NOT EXISTS \`Booking\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`reference\` VARCHAR(191) NOT NULL,
    \`serviceType\` VARCHAR(191) NOT NULL,
    \`fromLocation\` VARCHAR(191) NOT NULL,
    \`toLocation\` VARCHAR(191) NULL,
    \`pickupAt\` DATETIME(3) NOT NULL,
    \`returnAt\` DATETIME(3) NULL,
    \`hours\` INTEGER NULL,
    \`passengers\` INTEGER NOT NULL DEFAULT 1,
    \`luggage\` INTEGER NOT NULL DEFAULT 0,
    \`flightNumber\` VARCHAR(191) NULL,
    \`roundTrip\` BOOLEAN NOT NULL DEFAULT false,
    \`fullName\` VARCHAR(191) NOT NULL,
    \`email\` VARCHAR(191) NOT NULL,
    \`phone\` VARCHAR(191) NOT NULL,
    \`notes\` TEXT NULL,
    \`locale\` VARCHAR(191) NOT NULL DEFAULT 'en',
    \`estimatedPrice\` DOUBLE NULL,
    \`status\` VARCHAR(191) NOT NULL DEFAULT 'pending',
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`hotelName\` VARCHAR(191) NULL,
    \`roomType\` VARCHAR(191) NULL,
    \`checkIn\` DATETIME(3) NULL,
    \`checkOut\` DATETIME(3) NULL,
    \`nights\` INTEGER NULL,
    \`rooms\` INTEGER NULL DEFAULT 1,
    UNIQUE INDEX \`Booking_reference_key\`(\`reference\`),
    INDEX \`Booking_email_idx\`(\`email\`),
    INDEX \`Booking_status_idx\`(\`status\`),
    INDEX \`Booking_createdAt_idx\`(\`createdAt\`),
    PRIMARY KEY (\`id\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
  `CREATE TABLE IF NOT EXISTS \`ContactMessage\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`name\` VARCHAR(191) NOT NULL,
    \`email\` VARCHAR(191) NOT NULL,
    \`phone\` VARCHAR(191) NULL,
    \`subject\` VARCHAR(191) NULL,
    \`message\` TEXT NOT NULL,
    \`locale\` VARCHAR(191) NOT NULL DEFAULT 'en',
    \`handled\` BOOLEAN NOT NULL DEFAULT false,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX \`ContactMessage_handled_idx\`(\`handled\`),
    INDEX \`ContactMessage_createdAt_idx\`(\`createdAt\`),
    PRIMARY KEY (\`id\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
];

export async function GET() {
  try {
    // 1. Auto-create all database tables if they do not exist yet
    for (const sql of CREATE_TABLES_SQL) {
      await prisma.$executeRawUnsafe(sql);
    }

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
