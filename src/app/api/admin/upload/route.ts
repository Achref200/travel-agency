import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Built-in fallback image upload (used when Cloudinary is not configured).
// Files are written to /public/uploads and served as static assets.
//
// NOTE: on hosts with an ephemeral filesystem (e.g. Render's free plan) these
// files do not survive a redeploy — configure Cloudinary for durable, CDN
// delivery in production.

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_form" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "no_file" }, { status: 400 });
  }

  const ext = EXT[file.type];
  if (!ext) {
    return NextResponse.json({ ok: false, error: "unsupported_type" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  // Random, safe filename — never trust the client-supplied name (path traversal).
  const name = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${ext}`;
  const dir = join(process.cwd(), "public", "uploads");

  try {
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, name), bytes);
  } catch (error) {
    console.error("upload_write_failed", error);
    return NextResponse.json({ ok: false, error: "write_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, url: `/uploads/${name}` });
}
