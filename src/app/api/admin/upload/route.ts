import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { cloudinaryConfigured, uploadToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024;

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

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ ok: false, error: "unsupported_type" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }
  if (!cloudinaryConfigured()) {
    return NextResponse.json({ ok: false, error: "cloudinary_not_configured" }, { status: 503 });
  }

  try {
    const uploaded = await uploadToCloudinary(file);
    return NextResponse.json({ ok: true, url: uploaded.url });
  } catch (error) {
    console.error("cloudinary_upload_failed", error);
    return NextResponse.json({ ok: false, error: "cloudinary_upload_failed" }, { status: 502 });
  }
}
