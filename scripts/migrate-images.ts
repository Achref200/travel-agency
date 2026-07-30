/**
 * One-time migration: pull every externally-hosted image into Cloudinary and
 * repoint the database at the new URL.
 *
 * Content images were pasted in as links to third-party sites (other agencies,
 * hotel sites, picsum). Those break without warning and are not ours to serve.
 * Cloudinary fetches each source itself, so nothing is re-uploaded by hand.
 *
 *   npx tsx scripts/migrate-images.ts --dry-run   # report only
 *   npx tsx scripts/migrate-images.ts             # migrate
 */
import { PrismaClient } from "@prisma/client";
import { uploadToCloudinary, cloudinaryConfigured } from "../src/lib/cloudinary";

const prisma = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");

type Target = {
  model: "galleryImage" | "hotel" | "tour" | "vehicle" | "teamMember";
  field: "src" | "image";
  id: string;
  label: string;
  url: string;
};

/** Already-hosted assets need no migration. */
function needsMigration(src: string): boolean {
  if (!src?.trim()) return false;
  if (src.includes("res.cloudinary.com")) return false;
  return /^https?:\/\//i.test(src);
}

async function collect(): Promise<Target[]> {
  const [gallery, hotels, tours, vehicles, team] = await Promise.all([
    prisma.galleryImage.findMany({ select: { id: true, src: true } }),
    prisma.hotel.findMany({ select: { id: true, slug: true, image: true } }),
    prisma.tour.findMany({ select: { id: true, slug: true, image: true } }),
    prisma.vehicle.findMany({ select: { id: true, slug: true, image: true } }),
    prisma.teamMember.findMany({ select: { id: true, name: true, image: true } }),
  ]);

  return [
    ...gallery.map((r) => ({
      model: "galleryImage" as const, field: "src" as const,
      id: r.id, label: `gallery/${r.id}`, url: r.src,
    })),
    ...hotels.map((r) => ({
      model: "hotel" as const, field: "image" as const,
      id: r.id, label: `hotel/${r.slug}`, url: r.image,
    })),
    ...tours.map((r) => ({
      model: "tour" as const, field: "image" as const,
      id: r.id, label: `tour/${r.slug}`, url: r.image,
    })),
    ...vehicles.map((r) => ({
      model: "vehicle" as const, field: "image" as const,
      id: r.id, label: `vehicle/${r.slug}`, url: r.image,
    })),
    ...team.map((r) => ({
      model: "teamMember" as const, field: "image" as const,
      id: r.id, label: `team/${r.name}`, url: r.image,
    })),
  ].filter((t) => needsMigration(t.url));
}

async function main() {
  if (!cloudinaryConfigured()) {
    console.error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME (or the " +
        "NEXT_PUBLIC_ one) plus CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.",
    );
    process.exitCode = 1;
    return;
  }

  const targets = await collect();
  if (targets.length === 0) {
    console.log("Every image already points at Cloudinary. Nothing to do.");
    return;
  }

  console.log(`${targets.length} externally-hosted image(s) found.\n`);
  if (dryRun) {
    for (const t of targets) console.log(`  ${t.label}\n    ${t.url}`);
    console.log("\nDry run — nothing changed. Re-run without --dry-run to migrate.");
    return;
  }

  let migrated = 0;
  const failures: { label: string; url: string; reason: string }[] = [];

  // Sequential on purpose: bulk parallel fetches trip Cloudinary rate limits
  // and hammer the source hosts.
  for (const t of targets) {
    process.stdout.write(`  ${t.label} … `);
    try {
      const { url } = await uploadToCloudinary(t.url);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (prisma as any)[t.model].update({
        where: { id: t.id },
        data: { [t.field]: url },
      });
      migrated += 1;
      console.log("ok");
    } catch (error) {
      const reason = error instanceof Error ? error.message : "unknown error";
      failures.push({ label: t.label, url: t.url, reason });
      console.log(`FAILED (${reason})`);
    }
  }

  console.log(`\nMigrated ${migrated}/${targets.length}.`);
  if (failures.length) {
    console.log("\nThese still point at their original host and need a manual upload:");
    for (const f of failures) console.log(`  ${f.label}\n    ${f.url}\n    ${f.reason}`);
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
