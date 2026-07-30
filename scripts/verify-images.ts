import { access, stat } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import { PrismaClient } from "@prisma/client";

type ImageReference = {
  contentType: string;
  id: string;
  label: string;
  src: string;
};

type Result = ImageReference & {
  status: "ok" | "missing" | "unreachable" | "invalid";
  detail: string;
};

const prisma = new PrismaClient();
const publicDir = resolve(process.cwd(), "public");

function isInsidePublicDir(path: string): boolean {
  const relativePath = relative(publicDir, path);
  return relativePath !== "" && !relativePath.startsWith("..") && !isAbsolute(relativePath);
}

async function verifyLocalAsset(reference: ImageReference): Promise<Result> {
  const pathname = reference.src.split(/[?#]/, 1)[0];
  const filePath = resolve(publicDir, `.${pathname}`);

  if (!isInsidePublicDir(filePath)) {
    return { ...reference, status: "invalid", detail: "path escapes public directory" };
  }

  try {
    await access(filePath);
    const file = await stat(filePath);
    if (!file.isFile() || file.size === 0) {
      return { ...reference, status: "missing", detail: "file is empty or not a file" };
    }
    return { ...reference, status: "ok", detail: `${file.size} bytes` };
  } catch {
    return { ...reference, status: "missing", detail: "file not found in public directory" };
  }
}

async function verifyRemoteAsset(reference: ImageReference): Promise<Result> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    let response = await fetch(reference.src, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    });

    if (response.status === 405 || response.status === 501) {
      response = await fetch(reference.src, {
        headers: { Range: "bytes=0-0" },
        redirect: "follow",
        signal: controller.signal,
      });
    }

    if (!response.ok) {
      return { ...reference, status: "unreachable", detail: `HTTP ${response.status}` };
    }

    const contentType = response.headers.get("content-type") ?? "unknown content type";
    return { ...reference, status: "ok", detail: contentType };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "request failed";
    return { ...reference, status: "unreachable", detail };
  } finally {
    clearTimeout(timeout);
  }
}

async function verify(reference: ImageReference): Promise<Result> {
  if (!reference.src.trim()) {
    return { ...reference, status: "invalid", detail: "empty image source" };
  }
  if (reference.src.startsWith("/")) return verifyLocalAsset(reference);
  if (/^https?:\/\//i.test(reference.src)) return verifyRemoteAsset(reference);
  return { ...reference, status: "invalid", detail: "expected a local path or HTTP(S) URL" };
}

async function imageReferences(): Promise<ImageReference[]> {
  const [gallery, hotels, tours, vehicles, team] = await Promise.all([
    prisma.galleryImage.findMany({ select: { id: true, src: true } }),
    prisma.hotel.findMany({ select: { id: true, slug: true, image: true } }),
    prisma.tour.findMany({ select: { id: true, slug: true, image: true } }),
    prisma.vehicle.findMany({ select: { id: true, slug: true, image: true } }),
    prisma.teamMember.findMany({ select: { id: true, name: true, image: true } }),
  ]);

  return [
    ...gallery.map((item) => ({ contentType: "gallery", id: item.id, label: item.id, src: item.src })),
    ...hotels.map((item) => ({ contentType: "hotel", id: item.id, label: item.slug, src: item.image })),
    ...tours.map((item) => ({ contentType: "tour", id: item.id, label: item.slug, src: item.image })),
    ...vehicles.map((item) => ({ contentType: "vehicle", id: item.id, label: item.slug, src: item.image })),
    ...team.map((item) => ({ contentType: "team", id: item.id, label: item.name, src: item.image })),
  ];
}

async function main() {
  const references = await imageReferences();
  const results = await Promise.all(references.map(verify));

  for (const result of results) {
    console.log(
      `${result.status.toUpperCase().padEnd(11)} ${result.contentType.padEnd(8)} ${result.label}: ${result.src} (${result.detail})`,
    );
  }

  const totals = results.reduce<Record<Result["status"], number>>(
    (counts, result) => ({ ...counts, [result.status]: counts[result.status] + 1 }),
    { ok: 0, missing: 0, unreachable: 0, invalid: 0 },
  );
  console.log(`\nChecked ${results.length} image reference(s): ${totals.ok} ok, ${totals.missing} missing, ${totals.unreachable} unreachable, ${totals.invalid} invalid.`);

  if (totals.missing || totals.unreachable || totals.invalid) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
